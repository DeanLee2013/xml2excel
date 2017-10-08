/**
 * Created by lidian on 2016/6/23.
 */



var helper = require('./helper.js');
var fs = require('fs');
var xml2js = require('xml2js');

this.add_task_config=function add_task_config(id1, id2, name,desc,stepnamelist) {
     TaskDescription = require('./template/config_TaskDescription.json');
    var  newTaskDescription =   JSON.parse(JSON.stringify(TaskDescription));
    newTaskDescription["org.eclipse.epf.uma:TaskDescription"]['$']['xmi:id'] =  id2;
    newTaskDescription["org.eclipse.epf.uma:TaskDescription"]['$']['guid'] =  id2;
    newTaskDescription["org.eclipse.epf.uma:TaskDescription"]['$']['name'] =  name+','+id1;
    newTaskDescription["org.eclipse.epf.uma:TaskDescription"]['mainDescription'] = desc;

    // 生成步骤
    var steplist =[]
    for (var rowindex in stepnamelist) {
        var stepID = helper.createID22bit();
        var  newstepjson =   JSON.parse(JSON.stringify(stepjson));

        newstepjson['$']['xmi:id'] = stepID;
        newstepjson['$']['guid'] = stepID;
        var name_desc = stepnamelist[rowindex].split(',');
        newstepjson['$']['name'] = name_desc[0];
        newstepjson['sectionDescription'] = name_desc[1];
        steplist.push(newstepjson);
        console.log("生成步骤："+name_desc[0] +","+name_desc[1]);
    }
    newTaskDescription["org.eclipse.epf.uma:TaskDescription"]['sections']=steplist;

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(newTaskDescription);

    var tasksXmiFilepPath= global.tasksPath + name + '.xmi';

    fs.writeFile(tasksXmiFilepPath, xml, function (err) {
        if (err) throw err;
        console.log(tasksXmiFilepPath);
        console.log("第8步 task xmi File Saved !"); //文件被保存
    });

};

var stepjson =  {
    "$": {
        "xmi:id": "_L3DPQCfNEeaAUs4sqIcCRg",
        "name": "步骤1",
        "guid": "_L3DPQCfNEeaAUs4sqIcCRg"
    },
    "sectionDescription": [
        "描述1"
    ]
};