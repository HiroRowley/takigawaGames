
@echo off

REM =====================================
REM SpringBoot 起動
REM =====================================

start "SpringBoot" cmd /k "cd /d %~dp0backend\games && mvnw.cmd spring-boot:run"

REM backend 起動待機
timeout /t 5 > nul

REM =====================================
REM Phaser(frontend) 起動
REM =====================================

start "Frontend" cmd /k "cd /d %~dp0frontend\project && npm run dev"

REM frontend 起動待機
timeout /t 3 > nul

REM =====================================
REM ブラウザ起動
REM =====================================

start http://localhost:5173

timeout /t 5 > nul

echo Set ws = CreateObject("WScript.Shell") > fullscreen.vbs
echo ws.AppActivate "Chrome" >> fullscreen.vbs
echo WScript.Sleep 1000 >> fullscreen.vbs
echo ws.SendKeys "{F11}" >> fullscreen.vbs

cscript //nologo fullscreen.vbs
del fullscreen.vbs

