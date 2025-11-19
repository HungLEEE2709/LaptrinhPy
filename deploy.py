#!/usr/bin/env python3
"""
Simple deployment script for Flappy Bird Web Game
"""
import subprocess
import sys
import os

def check_requirements():
    """Check if all requirements are installed"""
    try:
        import flask
        import pygame
        import pymongo
        import gunicorn
        print("✅ All requirements available")
        return True
    except ImportError as e:
        print(f"❌ Missing requirement: {e}")
        return False

def test_local():
    """Test local deployment"""
    print("🧪 Testing local deployment...")
    try:
        os.system("python web_game.py &")
        import time
        time.sleep(3)
        import requests
        response = requests.get("http://localhost:5000/test")
        if response.status_code == 200:
            print("✅ Local test passed")
            return True
        else:
            print("❌ Local test failed")
            return False
    except Exception as e:
        print(f"❌ Local test error: {e}")
        return False

def deploy_instructions():
    """Print deployment instructions"""
    print("\n🚀 DEPLOYMENT INSTRUCTIONS")
    print("=" * 50)
    print("1. Push to GitHub:")
    print("   git add .")
    print("   git commit -m 'Ready for deployment'")
    print("   git push origin main")
    print("\n2. Deploy to Render.com:")
    print("   - Go to render.com")
    print("   - Connect GitHub repository")
    print("   - Use render.yaml configuration")
    print("   - Deploy!")
    print("\n3. Alternative: Railway.app")
    print("   - Similar process with railway.app")
    print("\n📝 Your game will be available at:")
    print("   https://your-app-name.onrender.com")

if __name__ == "__main__":
    print("🐦 Flappy Bird Web Deployment Helper")
    print("=" * 50)
    
    if check_requirements():
        if test_local():
            deploy_instructions()
        else:
            print("❌ Fix local issues first")
    else:
        print("❌ Install requirements: pip install -r requirements.txt")
