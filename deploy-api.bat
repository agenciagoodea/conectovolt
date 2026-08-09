@echo off
setlocal

set HOST=pro122.dnspro.com.br:2083
set USER=kryontecnologic
set PASS=ZQ(~{Y?9de&;DqYA
set BASEDIR=/home/kryontecnologic/conectovolt

echo === Deploy ConectoVolt via cPanel API ===
echo.

REM Passo 1 - git pull
echo [1/5] Atualizando codigo do GitHub...
curl.exe -k -s -u "%USER%:%PASS%" -X POST ^
  "https://%HOST%/execute/Fileman/mkdir?path=%%2Ftmp"
curl.exe -k -s -u "%USER%:%PASS%" -G ^
  "https://%HOST%/json-api/cpanel?cpanel_jsonapi_module=CommandManager&cpanel_jsonapi_func=execute&cpanel_jsonapi_version=1" ^
  --data-urlencode "command=cd %BASEDIR% && git pull origin master && echo GIT_PULL_OK"

echo [2/5] Instalando dependencias do backend...
curl.exe -k -s -u "%USER%:%PASS%" ^
  "https://%HOST%/json-api/cpanel?cpanel_jsonapi_module=CommandManager&cpanel_jsonapi_func=execute&cpanel_jsonapi_version=1" ^
  --data-urlencode "command=cd %BASEDIR%/backend && npm install --production=false && echo NPM_INSTALL_OK"

echo [3/5] Gerando Prisma Client MySQL...
curl.exe -k -s -u "%USER%:%PASS%" ^
  "https://%HOST%/json-api/cpanel?cpanel_jsonapi_module=CommandManager&cpanel_jsonapi_func=execute&cpanel_jsonapi_version=1" ^
  --data-urlencode "command=cd %BASEDIR%/backend && npx prisma generate --schema=prisma/schema.mysql.prisma && echo PRISMA_GEN_OK"

echo [4/5] Aplicando schema no banco MySQL...
curl.exe -k -s -u "%USER%:%PASS%" ^
  "https://%HOST%/json-api/cpanel?cpanel_jsonapi_module=CommandManager&cpanel_jsonapi_func=execute&cpanel_jsonapi_version=1" ^
  --data-urlencode "command=cd %BASEDIR%/backend && npx prisma db push --schema=prisma/schema.mysql.prisma && echo DB_PUSH_OK"

echo [5/5] Compilando backend NestJS...
curl.exe -k -s -u "%USER%:%PASS%" ^
  "https://%HOST%/json-api/cpanel?cpanel_jsonapi_module=CommandManager&cpanel_jsonapi_func=execute&cpanel_jsonapi_version=1" ^
  --data-urlencode "command=cd %BASEDIR%/backend && npm run build && echo BUILD_OK"

echo.
echo === Deploy Finalizado! ===
