
// var fs = require('fs');
// textarea = document.getElementsByTagName('textareaLog')[0],
// button = document.getElementsByTagName('button')[0];
var main = require('./main_plugin_build');
var helper = require('./helper');

btnSubmit = document.getElementById('btnSubmit');
txtLog = document.getElementById('txtLog');
textfield = document.getElementById('textfield');
function outputLog() {
   // txtLog.value ="aaaaa";

    // fs.writeFileSync('message.txt',
    // text, 'utf8');

    global.xmlpath = document.getElementById("fileField").files[0].path;
    main.initJson();
    console.log( global.xmlpath);
}



btnSubmit.onclick = outputLog;
// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。