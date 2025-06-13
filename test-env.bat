@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo 🚀 测试读取.env.local文件
echo ================================

if not exist ".env.local" (
    echo ❌ 未找到.env.local文件
    pause
    exit /b 1
)

echo 📋 文件内容:
type .env.local
echo.

echo 📋 解析结果:
for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
    set "key=%%a"
    set "value=%%b"
    echo 原始: %%a=%%b
    echo 处理: !key!=!value!
    if not "!key:~0,1!"=="#" if not "!key!"=="" (
        echo 有效变量: !key!
    )
    echo ---
)

pause
