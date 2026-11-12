@echo off
setlocal

REM ===========================================================================
REM  Library-RDCFlexTron - one-time setup for its UNIT TESTS
REM
REM  The library itself needs nothing from this script: RDC-FlexTron-Library.sws
REM  is a DataFlex 26 package, and the Studio fetches what it depends on. This
REM  script is only for running the unit tests of the library. It clones DFUnit,
REM  the unit-test library, as a sibling of this folder (..\DFUnit), which is
REM  where RDCFlexTronDev26.0.sws expects it for the test program
REM  AppSrc\UnitTests.src.
REM
REM  A workspace that uses the library never needs this script: the package
REM  does not know DFUnit.
REM ===========================================================================

cd /d "%~dp0"

echo.
echo === Library-RDCFlexTron unit-test setup ===
echo Folder: %CD%
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Git was not found on your PATH.
    echo         Install Git ^(or the GitHub Desktop app^), reopen the
    echo         command prompt, and run setup.bat again.
    echo.
    pause
    exit /b 1
)

if exist "..\DFUnit\.git" (
    echo [DFUnit] already present - pulling latest...
    git -C "..\DFUnit" pull --ff-only
) else (
    echo [DFUnit] cloning as a sibling...
    git clone https://github.com/NilsSve/Library-DFUnit.git "..\DFUnit"
    if errorlevel 1 (
        echo.
        echo [ERROR] Could not clone Library-DFUnit.
        echo         Check your connection and that you can reach:
        echo           https://github.com/NilsSve/Library-DFUnit.git
        echo.
        pause
        exit /b 1
    )
)

echo.
echo === Setup complete ===
echo.
echo DFUnit is now a sibling of this folder. Open RDCFlexTronDev26.0.sws in the
echo Studio and build UnitTests.src to run the unit tests of the library.
echo.
pause
exit /b 0
