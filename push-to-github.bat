@echo off
chcp 65001 >nul
cd /d "f:\ChamCong"

echo Đang khoi tao Git va day code len GitHub...
echo.

git init
git add .
git commit -m "App Cham cong - PWA, nhieu ca, xuat Excel"
git branch -M main
git remote add origin https://github.com/aciedtran271/ChamCong.git 2>nul
if errorlevel 1 git remote set-url origin https://github.com/aciedtran271/ChamCong.git
git push -u origin main

echo.
echo Xong. Neu push thanh cong, vao Settings - Pages - Source: GitHub Actions.
echo App se chay tai: https://aciedtran271.github.io/ChamCong/
pause
