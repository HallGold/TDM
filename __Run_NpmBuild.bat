@echo on

set CURR_CD=%cd%
set NGINX_HOME = D:/SpaceRun/nginx-1.12.0

cd /d %CURR_CD%
git pull && npm run-script build  && xcopy %CURR_CD%/pms/*  %NGINX_HOME%/html/pms

pause>nul