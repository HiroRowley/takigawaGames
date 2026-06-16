@echo off

cd /d "%~dp0project"

start http://localhost:5173

npm run dev