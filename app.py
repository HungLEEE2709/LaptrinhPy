from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import subprocess
import sys
import os
from database import create_user, check_login, save_score, get_top_scores

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

@app.route('/')
def index():
    if 'username' in session:
        return render_template('game.html', username=session['username'])
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    if check_login(username, password):
        session['username'] = username
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Tên đăng nhập hoặc mật khẩu không đúng'})

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    
    if create_user(username, password):
        session['username'] = username
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Tên đăng nhập đã tồn tại'})

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/game')
def game():
    if 'username' not in session:
        return redirect(url_for('index'))
    return render_template('game.html', username=session['username'])

@app.route('/start_game')
def start_game():
    if 'username' not in session:
        return jsonify({'error': 'Chưa đăng nhập'})
    
    try:
        # Chạy game Pygame trong nền
        username = session['username']
        subprocess.Popen([sys.executable, 'flappy.py', username])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/save_score', methods=['POST'])
def save_score_route():
    if 'username' not in session:
        return jsonify({'error': 'Chưa đăng nhập'})
    
    username = session['username']
    score = request.json.get('score')
    
    if score is not None:
        save_score(username, score)
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Không có điểm số'})

@app.route('/scores')
def scores():
    top_scores = get_top_scores(10)
    return render_template('scores.html', scores=top_scores)

@app.route('/api/scores')
def api_scores():
    top_scores = get_top_scores(10)
    # Chuyển ObjectId thành string cho JSON serialization
    scores_list = []
    for score in top_scores:
        scores_list.append({
            'username': score['username'],
            'score': score['score']
        })
    return jsonify(scores_list)

@app.route('/web_game')
def web_game():
    return render_template('web_game.html')

if __name__ == '__main__':
    # Tạo thư mục templates nếu chưa có
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    # Tạo thư mục static nếu chưa có
    if not os.path.exists('static'):
        os.makedirs('static')
    
    app.run(debug=True, host='0.0.0.0', port=5000)
