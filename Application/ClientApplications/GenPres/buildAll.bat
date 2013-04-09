del all-classes.js
del app-all.js
del tests-all.js
del apptest-all.js

sencha -sdk C:\Development\Libraries\extsdk_latest compile -debug -classpath=../Shared -classpath=./ page -in GenPres.html -out test.html
move all-classes.js app-all.temp

sencha -sdk C:\Development\Libraries\extsdk_latest compile -debug -classpath=../Shared -classpath=./ page -in GenPresTests.html -out test.html
move all-classes.js tests-all.temp

sencha -sdk C:\Development\Libraries\extsdk_latest compile -debug -classpath=../Shared -classpath=./ page -in GenPresAppTest.html -out test.html

move all-classes.js apptest-all.js
move app-all.temp app-all.js
move tests-all.temp tests-all.js
