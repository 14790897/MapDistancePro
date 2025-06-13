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

REM 显示即将推送的环境变量
echo 📋 找到以下环境变量:
for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
    set "key=%%a"
    set "value=%%b"
    REM 跳过注释行和空行
    if not "!key:~0,1!"=="#" if not "!key!"=="" (
        echo   • !key!
    )
)

echo.
set /p confirm="确认推送到production环境？(y/N): "
if /i not "%confirm%"=="y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo 📤 开始推送...

REM 推送环境变量
for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
    set "key=%%a"
    set "value=%%b"
    if not "!key:~0,1!"=="#" if not "!key!"=="" (
        echo 推送: !key!
        echo !value! | vercel env add "!key!" production --force >nul 2>&1
        if !errorlevel! equ 0 (
            echo ✅ !key! 推送成功
        ) else (
            echo ❌ !key! 推送失败
        )
    )
)

echo.
echo 🎉 环境变量推送完成！
echo 💡 建议重新部署: vercel --prod
echo.
echo 📋 当前环境变量列表:
vercel env ls

pause
