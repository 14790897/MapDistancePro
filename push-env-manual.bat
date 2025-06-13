@echo off
chcp 65001 >nul
echo 🚀 手动推送环境变量到Vercel
echo ================================

REM 检查登录状态
vercel whoami
if %errorlevel% neq 0 (
    echo 请先登录: vercel login
    pause
    exit /b 1
)

echo.
echo 📋 即将推送以下环境变量到production环境:
echo.

REM 从.env.local文件读取并显示
type .env.local | findstr /v "^#" | findstr /v "^$"

echo.
set /p confirm="确认推送？(y/N): "
if /i not "%confirm%"=="y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo 📤 开始推送...

REM 手动推送每个环境变量
echo 89dd9a1afc15e80083ca4673807cd3bb | vercel env add NEXT_PUBLIC_AMAP_JS_API_KEY production --force
echo ✅ NEXT_PUBLIC_AMAP_JS_API_KEY

echo 748def3642c8b92810edd33f072760c2 | vercel env add NEXT_PUBLIC_AMAP_REST_API_KEY production --force
echo ✅ NEXT_PUBLIC_AMAP_REST_API_KEY

echo 7ad9cacaa164bc1f6c29bd90b5e496aa | vercel env add NEXT_PUBLIC_AMAP_SECURITY_CODE production --force
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
