
@echo off

rem ASP.NET Core repository contains some useful code samples, therefore a script for 
rem its checkout is included here.

rem This script updates a specific IGLib's module by cloning its Git 
rem repository (if necessary), and updating it to the current state.

rem Bootstrap scripting such that update scripts are available:
set BootStrapScripting=%~dp0\0bootstrappingscripts\BootStrapScripting.bat
echo.
echo SCRIPT: BootStrapScripting: "%BootStrapScripting%"
echo.
if not exist "%BootStrapScripting%" (
  echo.
  echo ERROR: Variable BootStrapScripting does not contain a valid
  echo   script path.
  echo.
  goto finalize
)
call "%BootStrapScripting%"

rem Start local context, such that generation script does not have side effects:
setlocal
rem Reset the error level (by running an always successfull command):
ver > nul

rem Repository update parameters:
set ModuleDirRelative=igor
set CheckoutBranch=main
set RepositoryAddress=https://github.com/ajgorhoe/igor.git
set RepositoryAddressSecondary=
set RepositoryAddressLocal=
set Remote=origin
set RemoteSecondary=
set RemoteLocal=downstream_PowerShell

rem Derived parameters:
set ModuleDir=%~dp0%ModuleDirRelative%


echo.
echo SCRIPT: UpdateRepo: "%UpdateRepo%"
echo.
if not exist "%UpdateRepo%" (
  echo.
  echo ERROR: Variable UpdateRepo does not contain a valid script path.
  echo   BoorstrapScripting probably not performed correctly.
  echo.
  goto finalize
)



echo #####################$$$$$$$$$$$$$$$$$$$$$$$$$

rem Finally, perform repository clone / update by using the scripts
rem prepared in the bootstrapping stage:
echo.
echo Executing: 
echo   call "%UpdateRepo%" %*
echo.
call "%UpdateRepo%" %*

echo #####################%%%%%%%%%%%%%%%%%%%%%%%%


if 1 NEQ 0 (
  rem After restoring / updating the IGLib repository, we also need to
  rem restore / update its modulles and submodules. This is done by 
  rem calling the appropriate script in IGLib repo:
  echo.
  echo **************************************************************
  echo **************************************************************
  echo.
  echo Updating internal and external dependency modules of IGLib...
  echo Execuding:
  echo   call "%~dp0\iglib\UpdateGLibDependencies.bat"
  call call "%~dp0\iglib\UpdateGLibDependencies.bat"
  echo.
  echo  ... updating IGLib dependencies done.
  echo.
  echo **************************************
  echo **************************************
  echo.
)




:finalize


endlocal

