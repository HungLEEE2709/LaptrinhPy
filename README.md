# Flappy Bird Web Game

A web-based Flappy Bird game built with Python, Pygame, and Flask.

## Features

- 🐦 Classic Flappy Bird gameplay
- 👥 User registration and login system
- 🏆 High score tracking
- 🌐 Web-based interface
- 🎮 Desktop game launcher

## Requirements

- Python 3.7+
- MongoDB (for database)
- Required Python packages (see requirements.txt)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LaptrinhPy
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up MongoDB:
- Install MongoDB on your system
- Make sure MongoDB is running on localhost:27017

## Running the Application

### Local Development

1. Start the Flask web server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

### Production Deployment

#### Option 1: Heroku
1. Create a `Procfile`:
```
web: gunicorn app:app
```

2. Deploy to Heroku:
```bash
heroku create
git push heroku main
```

#### Option 2: PythonAnywhere
1. Upload your files to PythonAnywhere
2. Install requirements in the virtual environment
3. Configure the web app to use `app.py`
4. Set up a MongoDB database (MongoDB Atlas recommended)

#### Option 3: VPS/Docker
1. Use the provided Dockerfile (if available)
2. Or manually set up with Nginx + Gunicorn

## Game Controls

- **Space/Click**: Make the bird jump
- **ESC**: Pause the game
- **Avoid pipes** to survive and increase your score

## API Endpoints

- `GET /` - Main page (login if not authenticated)
- `POST /login` - User login
- `POST /register` - User registration
- `GET /game` - Game page (requires login)
- `GET /start_game` - Launch desktop game
- `POST /save_score` - Save game score
- `GET /scores` - View high scores
- `GET /api/scores` - API endpoint for scores (JSON)

## Database Schema

### Users Collection
```json
{
  "username": "string",
  "password": "string"
}
```

### Scores Collection
```json
{
  "username": "string",
  "score": "number"
}
```

## File Structure

```
LaptrinhPy/
├── app.py                 # Flask web application
├── flappy.py             # Pygame game logic
├── main.py               # Main game entry point
├── database.py           # MongoDB database operations
├── requirements.txt      # Python dependencies
├── templates/            # HTML templates
│   ├── base.html
│   ├── login.html
│   ├── register.html
│   ├── game.html
│   └── scores.html
├── scenes/               # Game scenes
├── assets/               # Game assets (images, sounds)
└── AI/                   # AI training components
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on localhost:27017
- Check if MongoDB service is started
- Verify network connectivity

### Game Not Starting
- Make sure Pygame is properly installed
- Check if all game assets are present in the `assets/` folder
- Ensure the game window is not hidden behind other windows

### Web Server Issues
- Check if port 5000 is available
- Verify Flask installation
- Check for any syntax errors in the code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).