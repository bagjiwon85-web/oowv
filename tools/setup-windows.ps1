# Windows 원클릭 설치: uv, Blender, Node.js, FFmpeg, Git, HyperFrames, Manim
# 사용법: PowerShell에서  powershell -ExecutionPolicy Bypass -File tools\setup-windows.ps1

function Install-Winget($id) {
    Write-Host "==> $id" -ForegroundColor Cyan
    winget install -e --id $id --accept-package-agreements --accept-source-agreements
}

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "==> uv" -ForegroundColor Cyan
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
}

Install-Winget "Git.Git"
Install-Winget "BlenderFoundation.Blender"
Install-Winget "OpenJS.NodeJS.LTS"
Install-Winget "Gyan.FFmpeg"

# 방금 설치한 프로그램이 이 창에서 인식되도록 PATH 갱신
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
            [Environment]::GetEnvironmentVariable("Path","User") + ";$env:USERPROFILE\.local\bin"

Write-Host "==> hyperframes" -ForegroundColor Cyan
npm i -g hyperframes
Write-Host "==> manim" -ForegroundColor Cyan
uv tool install manim

Write-Host ""
Write-Host "완료! 남은 수동 단계:" -ForegroundColor Green
Write-Host "1) Blender 실행 > Edit > Preferences > Add-ons > Install from Disk"
Write-Host "   tools\blender\blender_mcp_addon.py 선택 후 체크"
Write-Host "2) 3D 화면에서 N키 > BlenderMCP 탭 > Connect to Claude"
Write-Host "3) 이 폴더에서 claude 실행 후 blender MCP 서버 허용"
Write-Host "(수식 쓰려면: winget install MiKTeX.MiKTeX)"
