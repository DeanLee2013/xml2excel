/**
 * Created by lidian on 2016/6/23.
 */

var helper = require('./helper.js');

var fs = require('fs');
var xml2js = require('xml2js');

this.add_support_config=function add_support_config(id1, id2, name,mainDescription) {
    var jsontemp = require('./template/config_supporting_material.json');
    console.log(JSON.stringify(jsontemp));
    var  config_supporting_material =   JSON.parse(JSON.stringify(jsontemp));
    config_supporting_material["org.eclipse.epf.uma:ContentDescription"]['$']['xmi:id'] =  id2;
    config_supporting_material["org.eclipse.epf.uma:ContentDescription"]['$']['guid'] =  id2;
    config_supporting_material["org.eclipse.epf.uma:ContentDescription"]['$']['name'] =  name+','+id1;


    var builder = new xml2js.Builder();
    var xml = builder.buildObject(config_supporting_material);


    var tasksXmiFilepPath= global.supportingmaterialsPath +name+'.xmi';

    fs.writeFile(tasksXmiFilepPath, xml, function (err) {
        if (err) throw err;
        console.log(tasksXmiFilepPath);
        console.log("第n步 supportingmaterials  xmi File Saved !"); //文件被保存
    });

};