@echo off

REM =====================================
REM SpringBoot 起動
REM =====================================

start "SpringBoot" cmd /k "cd /d %~dp0backend\games && mvnw.cmd spring-boot:run"

REM backend 起動待機（8080ポート監視）
echo Waiting backend (8080)...
:wait_backend
netstat -ano | findstr :8080 > nul
if errorlevel 1 (
    timeout /t 1 > nul
    goto wait_backend
)

REM =====================================
REM Phaser(frontend) 起動
REM =====================================

start "Frontend" cmd /k "cd /d %~dp0frontend\project && npm run dev"

REM frontend 起動待機（5173ポート監視）
echo Waiting frontend (5173)...
:wait_frontend
netstat -ano | findstr :5173 > nul
if errorlevel 1 (
    timeout /t 1 > nul
    goto wait_frontend
)

REM =====================================
REM ブラウザ起動
REM =====================================

start http://localhost:5173

REM ブラウザ起動待機（軽く猶予）
timeout /t 2 > nul

echo Set ws = CreateObject("WScript.Shell") > fullscreen.vbs
echo ws.AppActivate "Google Chrome" >> fullscreen.vbs
echo WScript.Sleep 1000 >> fullscreen.vbs
echo ws.SendKeys "{F11}" >> fullscreen.vbs

cscript //nologo fullscreen.vbs
del fullscreen.vbs