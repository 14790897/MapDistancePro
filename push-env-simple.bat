@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo 🚀 推送环境变量到Vercel
echo ================================

REM 检查Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到Vercel CLI
    echo 请先安装: npm i -g vercel
    pause
    exit /b 1
)

REM 检查登录状态
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 请先登录Vercel
    echo 运行: vercel login
    pause
    exit /b 1
)

REM 检查.env.local文件
if not exist ".env.local" (
    echo ❌ 未找到.env.local文件
    pause
    exit /b 1
)

echo ✅ 开始推送环境变量...
echo.

REM 读取并推送每个环境变量
for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
    set "line=%%a"
    if not "!line:~0,1!"=="#" if not "%%a"=="" (
        echo 📤 推送: %%a
        echo %%b | vercel env add "%%a" production
        if !errorlevel! equ 0 (
            echo ✅ %%a 推送成功
        ) else (
            echo ❌ %%a 推送失败
        )
        echo.
    )
)

echo 🎉 环境变量推送完成！
echo 💡 建议重新部署: vercel --prod
echo.
echo 📋 当前环境变量列表:
vercel env ls

pause
