del all-classes.js
del app-all.js
sencha -sdk C:\Development\Libraries\extsdk_latest compile -debug -classpath=../Shared -classpath=./ page -in GenPres.html -out test.html
move all-classes.js app-all.temp
del tests-all.js
sencha -sdk C:\Development\Libraries\extsdk_latest compile -debug -classpath=../Shared -classpath=./ page -in GenPresTests.html -out test.html
move all-classes.js tests-all.js
move app-all.temp app-all.js