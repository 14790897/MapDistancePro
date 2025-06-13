@echo off
echo 🚀 推送环境变量到Vercel...
echo.

REM 检查Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到Vercel CLI，请先安装：
    echo npm i -g vercel
    pause
    exit /b 1
)

REM 检查是否已登录
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 请先登录Vercel：
    echo vercel login
    pause
    exit /b 1
)

REM 推送环境变量
echo 📤 推送 NEXT_PUBLIC_AMAP_JS_API_KEY...
echo %NEXT_PUBLIC_AMAP_JS_API_KEY% | vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production --force

echo 📤 推送 NEXT_PUBLIC_AMAP_REST_API_KEY...
echo %NEXT_PUBLIC_AMAP_REST_API_KEY% | vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production --force

echo 📤 推送 NEXT_PUBLIC_AMAP_SECURITY_CODE...
echo %NEXT_PUBLIC_AMAP_SECURITY_CODE% | vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production --force

echo 📤 推送 NEXT_PUBLIC_DEFAULT_LOCATION...
echo %NEXT_PUBLIC_DEFAULT_LOCATION% | vercel env add NEXT_PUBLIC_DEFAULT_LOCATION production --force

echo 📤 推送 NEXT_PUBLIC_REQUEST_LIMIT...
echo %NEXT_PUBLIC_REQUEST_LIMIT% | vercel env add NEXT_PUBLIC_REQUEST_LIMIT production --force

echo 📤 推送 NEXT_PUBLIC_REQUEST_DELAY...
echo %NEXT_PUBLIC_REQUEST_DELAY% | vercel env add NEXT_PUBLIC_REQUEST_DELAY production --force

echo.
echo 🎉 环境变量推送完成！
echo 💡 请运行以下命令重新部署：vercel --prod
echo.
echo 📋 当前环境变量列表：
vercel env ls

pause
