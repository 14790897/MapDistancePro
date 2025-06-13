# 推送环境变量到Vercel的PowerShell脚本
# 使用方法: .\push-env.ps1

param(
    [string]$Environment = "production",
    [switch]$Preview,
    [switch]$Development,
    [switch]$All
)

Write-Host "🚀 Vercel环境变量推送工具" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 检查Vercel CLI
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未找到Vercel CLI" -ForegroundColor Red
    Write-Host "请先安装: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# 检查登录状态
try {
    $user = vercel whoami 2>$null
    Write-Host "✅ 已登录用户: $user" -ForegroundColor Green
} catch {
    Write-Host "❌ 请先登录Vercel: vercel login" -ForegroundColor Red
    exit 1
}

# 检查.env.local文件
if (!(Test-Path ".env.local")) {
    Write-Host "❌ 未找到.env.local文件" -ForegroundColor Red
    exit 1
}

# 确定目标环境
$environments = @()
if ($All) {
    $environments = @("development", "preview", "production")
} elseif ($Development) {
    $environments = @("development")
} elseif ($Preview) {
    $environments = @("preview")
} else {
    $environments = @($Environment)
}

Write-Host "🎯 目标环境: $($environments -join ', ')" -ForegroundColor Cyan

# 解析.env.local文件
$envVars = @{}
$content = Get-Content ".env.local" -Raw
$lines = $content -split "`n"

foreach ($line in $lines) {
    $line = $line.Trim()
    # 跳过注释和空行
    if ($line -match "^#" -or $line -eq "") {
        continue
    }
    # 解析键值对
    if ($line -match "^([^=]+)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        # 移除引号
        $value = $value -replace '^["`'']|["`'']$', ''
        $envVars[$key] = $value
    }
}

Write-Host "📋 找到 $($envVars.Count) 个环境变量:" -ForegroundColor Blue
foreach ($key in $envVars.Keys) {
    $maskedValue = if ($envVars[$key].Length -gt 8) {
        $envVars[$key].Substring(0, 4) + "****" + $envVars[$key].Substring($envVars[$key].Length - 4)
    } else {
        "****"
    }
    Write-Host "  • $key = $maskedValue" -ForegroundColor Gray
}

Write-Host ""
$confirm = Read-Host "确认推送这些环境变量？(y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ 操作已取消" -ForegroundColor Yellow
    exit 0
}

# 推送环境变量
$successCount = 0
$failCount = 0

foreach ($env in $environments) {
    Write-Host ""
    Write-Host "📤 推送到 $env 环境..." -ForegroundColor Cyan
    
    foreach ($key in $envVars.Keys) {
        $value = $envVars[$key]
        Write-Host "  推送: $key" -NoNewline
        
        try {
            # 使用echo和管道来传递值
            $result = echo $value | vercel env add $key $env --force 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✅" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host " ❌ $result" -ForegroundColor Red
                $failCount++
            }
        } catch {
            Write-Host " ❌ $_" -ForegroundColor Red
            $failCount++
        }
    }
}
            }
        } catch {
            Write-Host " ❌ $_" -ForegroundColor Red
            $failCount++
        }
    }
}

Write-Host ""
Write-Host "📊 推送结果:" -ForegroundColor Blue
Write-Host "  ✅ 成功: $successCount" -ForegroundColor Green
Write-Host "  ❌ 失败: $failCount" -ForegroundColor Red

if ($failCount -eq 0) {
    Write-Host ""
    Write-Host "🎉 所有环境变量推送成功！" -ForegroundColor Green
    Write-Host "💡 建议重新部署项目以应用新的环境变量:" -ForegroundColor Yellow
    Write-Host "   vercel --prod" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "⚠️  有环境变量推送失败，请检查错误信息" -ForegroundColor Yellow
}

# 显示当前环境变量
Write-Host ""
Write-Host "📋 当前Vercel环境变量:" -ForegroundColor Blue
vercel env ls
