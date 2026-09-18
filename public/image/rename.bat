@echo off
setlocal EnableDelayedExpansion
set i=1

for %%f in (*.jpg *.jpeg *.png *.webp) do (
    set "num=0!i!"
    set "num=!num:~-2!"
    ren "%%f" "product_!num!%%~xf"
    set /a i+=1
)

echo Done!
pause
