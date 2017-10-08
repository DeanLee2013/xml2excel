/**
 * Created by lidian on 2016/6/23.
 */



var helper = require('./helper.js');
var fs = require('fs');
var xml2js = require('xml2js');

this.add_role_config=function add_role_config(id1, id2, name,desc,capability,rolelsit) {




    var   roleDescription = require('./template/config_role.json');
    var  newroleDescription =   JSON.parse(JSON.stringify(roleDescription));
    newroleDescription["org.eclipse.epf.uma:RoleDescription"]['$']['xmi:id'] =  id2;
    newroleDescription["org.eclipse.epf.uma:RoleDescription"]['$']['guid'] =  id2;
    newroleDescription["org.eclipse.epf.uma:RoleDescription"]['$']['name'] =  name+','+id1;
    newroleDescription["org.eclipse.epf.uma:RoleDescription"]['mainDescription'] = desc;
    newroleDescription["org.eclipse.epf.uma:RoleDescription"]['skills'] = capability;




    var builder = new xml2js.Builder();
    var xml = builder.buildObject(newroleDescription);

    var rolesXmiFilepPath= global.rolePath + name + '.xmi';

    fs.writeFile(rolesXmiFilepPath, xml, function (err) {
        if (err) throw err;
        console.log(rolesXmiFilepPath);
        console.log("角色基础包 role xmi File Saved !"); //文件被保存
    });

};
