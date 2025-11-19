class FlappyBirdGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 400;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Game state
        this.bird = {
            x: 50,
            y: 300,
            width: 30,
            height: 25,
            velocity: 0,
            gravity: 0.5,
            jump: -8
        };
        
        this.pipes = [];
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.pipeGap = 150;
        this.pipeWidth = 60;
        this.pipeSpeed = 2;
        
        // Colors
        this.colors = {
            background: '#70c5ce',
            bird: '#f7d354',
            pipe: '#73c767',
            text: '#ffffff'
        };
        
        this.bindEvents();
        this.gameLoop();
    }
    
    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameOver) {
                e.preventDefault();
                this.jump();
            }
        });
        
        // Mouse/Touch controls
        this.canvas.addEventListener('click', () => {
            if (!this.gameOver) {
                this.jump();
            }
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.gameOver) {
                this.jump();
            }
        });
    }
    
    jump() {
        if (!this.gameStarted) {
            this.gameStarted = true;
        }
        this.bird.velocity = this.bird.jump;
    }
    
    reset() {
        this.bird.y = 300;
        this.bird.velocity = 0;
        this.pipes = [];
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
    }
    
    update() {
        if (this.gameOver || !this.gameStarted) return;
        
        // Update bird
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;
        
        // Check boundaries
        if (this.bird.y < 0 || this.bird.y + this.bird.height > this.height) {
            this.endGame();
            return;
        }
        
        // Update pipes
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.width - 200) {
            const pipeHeight = Math.random() * (this.height - this.pipeGap - 100) + 50;
            this.pipes.push({
                x: this.width,
                topHeight: pipeHeight,
                passed: false
            });
        }
        
        // Move pipes and check collisions
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            
            // Remove off-screen pipes
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
                continue;
            }
            
            // Check collision
            if (this.checkCollision(pipe)) {
                this.endGame();
                return;
            }
            
            // Update score
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score++;
            }
        }
    }
    
    checkCollision(pipe) {
        const birdLeft = this.bird.x;
        const birdRight = this.bird.x + this.bird.width;
        const birdTop = this.bird.y;
        const birdBottom = this.bird.y + this.bird.height;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + this.pipeWidth;
        const pipeTopBottom = pipe.topHeight;
        const pipeBottomTop = pipe.topHeight + this.pipeGap;
        
        // Check if bird overlaps with pipe horizontally
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Check if bird hits top or bottom pipe
            if (birdTop < pipeTopBottom || birdBottom > pipeBottomTop) {
                return true;
            }
        }
        
        return false;
    }
    
    endGame() {
        this.gameOver = true;
        // Send score to server
        this.sendScore();
    }
    
    async sendScore() {
        try {
            const response = await fetch('/save_score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: this.score })
            });
            
            if (response.ok) {
                console.log('Score saved successfully');
            }
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw bird
        this.ctx.fillStyle = this.colors.bird;
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.width, this.bird.height);
        
        // Draw pipes
        this.ctx.fillStyle = this.colors.pipe;
        for (const pipe of this.pipes) {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.topHeight + this.pipeGap, this.pipeWidth, this.height - pipe.topHeight - this.pipeGap);
        }
        
        // Draw score
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText(this.score.toString(), 20, 40);
        
        // Draw start message
        if (!this.gameStarted) {
            this.ctx.font = '20px Arial';
            this.ctx.fillText('Nhấn SPACE hoặc click để bắt đầu', 50, this.height / 2);
        }
        
        // Draw game over message
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = 'bold 30px Arial';
            this.ctx.fillText('Game Over!', this.width / 2 - 70, this.height / 2 - 30);
            
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`Điểm: ${this.score}`, this.width / 2 - 30, this.height / 2);
            this.ctx.fillText('Click để chơi lại', this.width / 2 - 60, this.height / 2 + 30);
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        
        if (this.gameOver) {
            // Wait for click to restart
            this.canvas.addEventListener('click', () => {
                if (this.gameOver) {
                    this.reset();
                }
            }, { once: true });
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        new FlappyBirdGame(canvas);
    }
});
