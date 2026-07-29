#!/usr/bin/env bash
# ============================================================
# SpeakUp.ai — Render.com Build Script
# Installs: ffmpeg (system), faster-whisper (Python)
# then runs the standard npm build.
# ============================================================
set -e

echo "========================================"
echo " SpeakUp.ai — Render Build Script"
echo "========================================"

# ----------------------------------------------------------
# 1. System packages: ffmpeg
# ----------------------------------------------------------
echo ""
echo "📦 Installing system dependencies (ffmpeg)..."
apt-get update -qq && apt-get install -y --no-install-recommends ffmpeg

echo "✅ ffmpeg installed: $(ffmpeg -version 2>&1 | head -1)"

# ----------------------------------------------------------
# 2. Python: faster-whisper (for speech transcription ASR)
# ----------------------------------------------------------
echo ""
echo "🐍 Installing Python dependencies (faster-whisper)..."

# Use python3 / pip3 from the system (Render provides Python 3 on Ubuntu)
python3 -m pip install --quiet --upgrade pip
python3 -m pip install --quiet faster-whisper

echo "✅ faster-whisper installed: $(python3 -c 'import faster_whisper; print(faster_whisper.__version__)')"

# Pre-download the tiny.en model weights at build time so there's no download spike
# at runtime. tiny.en is 39MB — safe for Render free tier (512MB RAM limit).
echo ""
echo "⬇️  Pre-downloading Whisper tiny.en model weights..."
python3 -c "
from faster_whisper import WhisperModel
print('Downloading tiny.en model...')
m = WhisperModel('tiny.en', device='cpu', compute_type='int8', cpu_threads=1)
del m
print('tiny.en model cached successfully.')
" && echo "✅ Whisper tiny.en model ready." || echo "⚠️  Model pre-download skipped (will download on first request)."

# ----------------------------------------------------------
# 3. Node: npm install + vite build
# ----------------------------------------------------------
echo ""
echo "📦 Installing Node dependencies..."
npm install

echo ""
echo "🔨 Building frontend (vite) + backend (esbuild)..."
npm run build

echo ""
echo "========================================"
echo " ✅ Build complete — ready to start!"
echo "========================================"
