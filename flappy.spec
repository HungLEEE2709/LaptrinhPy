# flappy.spec - cấu hình build web cho pygbag

[project]
main = "flappy_web.py"      # file game chạy web
name = "flappybird"
width = 500
height = 600
fps = 60
src = "."

[packages]
copy = [
    "assets",
    "AI",
    "player_scores.json",
    "ai_best_model.json",
    "ai_best_model.npz",
    "ai_metadata.json"
]

[python]
version = "3.11"

[server]
port = 8000
