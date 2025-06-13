#!/usr/bin/env powershell

# Vercel环境变量推送脚本
# 使用方法: .\scripts\push-env-to-vercel.ps1

Write-Host "🚀 开始推送环境变量到Vercel..." -ForegroundColor Green

# 检查是否安装了Vercel CLI
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未找到Vercel CLI，请先安装：" -ForegroundColor Red
    Write-Host "npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# 检查是否已登录Vercel
$whoami = vercel whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 请先登录Vercel：" -ForegroundColor Red
    Write-Host "vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 当前登录用户: $whoami" -ForegroundColor Green

# 检查.env.local文件是否存在
if (!(Test-Path ".env.local")) {
    Write-Host "❌ 未找到.env.local文件" -ForegroundColor Red
    exit 1
}

# 读取.env.local文件
$envVars = @{}
Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.*)$") {
        $envVars[$matches[1]] = $matches[2]
    }
}

Write-Host "📋 找到 $($envVars.Count) 个环境变量" -ForegroundColor Blue

# 推送每个环境变量
foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "📤 推送: $key" -ForegroundColor Cyan
    
    # 推送到production环境
    $value | vercel env add $key production --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $key 推送成功" -ForegroundColor Green
    } else {
        Write-Host "❌ $key 推送失败" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 环境变量推送完成！" -ForegroundColor Green
Write-Host "💡 提示：请运行以下命令重新部署项目：" -ForegroundColor Yellow
Write-Host "vercel --prod" -ForegroundColor Cyan

# 显示当前环境变量列表
Write-Host ""
Write-Host "📋 当前Vercel环境变量列表：" -ForegroundColor Blue
vercel env ls
