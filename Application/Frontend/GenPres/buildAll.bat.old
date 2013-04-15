del all-classes.js
del app-all.js
del tests-all.js
del apptest-all.js

sencha compile include -namespace GenPres -classpath=../Shared -classpath=./ page -in GenPres.html -out test.html
move all-classes.js app-all.temp

REM sencha compile -debug -classpath=../Shared -classpath=./ page -in GenPresTests.html -out test.html
REM move all-classes.js tests-all.temp

REM sencha compile -debug -classpath=../Shared -classpath=./ page -in GenPresAppTest.html -out test.html

REM move all-classes.js apptest-all.js
move app-all.temp app-all.js
REM gmove tests-all.temp tests-all.js


c:\Development\Projects\Informedica.GenPres.WebApp>sencha compile -classpath=../Shared -classpath=./ page -name=page -in GenPres.html -out test.html and include -namespace GenPres and concat app-all.js
 