/**
 * Created by lidian on 2016/6/23.
 */

var helper = require('./helper.js');

var fs = require('fs');
var xml2js = require('xml2js');
var  newTaskDescription;
this.add_temple_config=function add_temple_config(id1, id2, name,mainDescription,attachments) {
    var config_new_template = require('./template/config_new_template.json');
    var  config_new_template =   JSON.parse(JSON.stringify(config_new_template));
    config_new_template["org.eclipse.epf.uma:GuidanceDescription"]['$']['xmi:id'] =  id2;
    config_new_template["org.eclipse.epf.uma:GuidanceDescription"]['$']['guid'] =  id2;
    config_new_template["org.eclipse.epf.uma:GuidanceDescription"]['$']['name'] =  name+','+id1;
    //config_new_template["org.eclipse.epf.uma:GuidanceDescription"]['mainDescription']=mainDescription;  //可以是超链接
    //config_new_template["org.eclipse.epf.uma:GuidanceDescription"]['attachments']=attachments;  //可以是超链接  resources/任务分解1.0.txt|<a href=\"http://11\">www.baidu.com</a>


    var builder = new xml2js.Builder();
    var xml = builder.buildObject(config_new_template);


    var tasksXmiFilepPath= global.templatesPath + name +'.xmi';

    fs.writeFile(tasksXmiFilepPath, xml, function (err) {
        if (err) throw err;
        console.log(tasksXmiFilepPath);
        console.log("第n步 config_new_template  xmi File Saved !"); //文件被保存
    });

};