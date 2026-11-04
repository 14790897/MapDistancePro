@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 手动推送环境变量到Vercel
echo ================================
echo.
echo 本脚本从 .env.local 读取密钥，仓库里不留任何明文。
echo.

if not exist ".env.local" (
    echo ❌ 未找到 .env.local
    echo    请先复制 .env.example 为 .env.local，填入你自己的高德密钥。
    pause
    exit /b 1
)

REM ---- 从 .env.local 读取 ----
set "JS_KEY="
set "REST_KEY="
set "SEC_CODE="
for /f "usebackq tokens=1,* delims==" %%A in (".env.local") do (
    set "K=%%A"
    set "V=%%B"
    if defined V (
        if "!V:~0,1!"=="" set "V=!V:~1,-1!"
        if /i "!K!"=="NEXT_PUBLIC_AMAP_JS_API_KEY"     set "JS_KEY=!V!"
        if /i "!K!"=="NEXT_PUBLIC_AMAP_REST_API_KEY"   set "REST_KEY=!V!"
        if /i "!K!"=="NEXT_PUBLIC_AMAP_SECURITY_CODE"  set "SEC_CODE=!V!"
    )
)

if not defined JS_KEY (
    echo ❌ .env.local 里没有 NEXT_PUBLIC_AMAP_JS_API_KEY
    pause
    exit /b 1
)
if not defined REST_KEY (
    echo ❌ .env.local 里没有 NEXT_PUBLIC_AMAP_REST_API_KEY
    pause
    exit /b 1
)
if not defined SEC_CODE (
    echo ❌ .env.local 里没有 NEXT_PUBLIC_AMAP_SECURITY_CODE
    pause
    exit /b 1
)

REM ---- 检查登录 ----
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 请先登录: vercel login
    pause
    exit /b 1
)

echo.
echo 📋 即将推送的环境变量（已脱敏）:
echo    NEXT_PUBLIC_AMAP_JS_API_KEY      = !JS_KEY:~0,6!****
echo    NEXT_PUBLIC_AMAP_REST_API_KEY    = !REST_KEY:~0,6!****
echo    NEXT_PUBLIC_AMAP_SECURITY_CODE   = !SEC_CODE:~0,6!****
echo    NEXT_PUBLIC_DEFAULT_LOCATION     = 鹤沙航城
echo    NEXT_PUBLIC_REQUEST_LIMIT        = 50
echo    NEXT_PUBLIC_REQUEST_DELAY        = 1000
echo.

set /p confirm="确认推送到 production？(y/N): "
if /i not "%confirm%"=="y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo 📤 开始推送...

echo !JS_KEY! | vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production --force
echo ✅ NEXT_PUBLIC_AMAP_JS_API_KEY

echo !REST_KEY! | vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production --force
echo ✅ NEXT_PUBLIC_AMAP_REST_API_KEY

echo !SEC_CODE! | vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production --force
echo ✅ NEXT_PUBLIC_AMAP_SECURITY_CODE

echo 鹤沙航城 | vercel env add NEXT_PUBLIC_DEFAULT_LOCATION production --force
echo ✅ NEXT_PUBLIC_DEFAULT_LOCATION

echo 50 | vercel env add NEXT_PUBLIC_REQUEST_LIMIT production --force
echo ✅ NEXT_PUBLIC_REQUEST_LIMIT

echo 1000 | vercel env add NEXT_PUBLIC_REQUEST_DELAY production --force
echo ✅ NEXT_PUBLIC_REQUEST_DELAY

echo.
echo 🎉 所有环境变量推送完成！
echo 💡 现在可以部署项目: vercel --prod
echo.
echo 📋 验证环境变量:
vercel env ls

pause
