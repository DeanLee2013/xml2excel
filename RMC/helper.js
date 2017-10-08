/**
 * Created by lidian on 2016/6/12.
 */
// clone
var dicIDsJson=require('./template/dicIDs.json');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

//role_IDs_dic.json
this.getdicIDs= function getdicIDs() {

    var data  = fs.readFileSync('./template/dicIDs.json');
    var json =JSON.parse(data);
  return json;
}
//this.addID();
this.addID =function addID(package_plugin_list) {
  //getdicIDs();
  //   var package_plugin_list ;
  //   package_plugin_list['a']='b';
  //   package_plugin_list['c']='d';
  //   console.log(package_plugin_list);

   // var json  =[{'key':'1111'},{}]
   //  var builder = new xml2js.Builder();
   //  var xml = builder.buildObject(package_plugin_list);

    // fs.writeFileSync('./template/dicIDs.json',JSON.stringify(package_plugin_list), function (err) {
    //     if (err) {
    //         throw err;
    //         console.log('id保存失败:'+err);
    //     }
    fs.writeFileSync('./template/dicIDs.json',JSON.stringify(package_plugin_list));
        console.log("id保存成功");
}

// this.log = function(text)
// {
//     console.log(text);
//     if(‌typeof(document) == "undefined")
//     {
//         return;
//     }
//
//     txtLog = document.getElementById('txtLog');
//         if(txtLog){
//             txtLog.value  =text;
//         }
//
//
// };

// this.setTextlog =  function  (textlog) {
//     textlog = txtLog;
//     txtLog.value ="init ok";
// }


this.clone = function(myObj){
    if(typeof(myObj) != 'object') return myObj;
    if(myObj == null) return myObj;
    var myNewObj = new Object();
    for(var i in myObj)
        myNewObj[i] = this.clone(myObj[i]);
    return myNewObj;
};


function md5 (text) {

    var crypto = require('crypto');
    return crypto.createHash('md5').update(text).digest('hex');
};

this.createID22bit =  function createID22bit () {

    return '_'+ md5(Math.random().toString()).substr(0,22)
};
//createID22bit
this.createCommonID =  function createCommonID () {

    return '-'+ md5(Math.random().toString()).substr(0,22)
};


this.getID= function getID(name) {
    var dicIDs =this.getdicIDs();
    var ID;
    if(dicIDs[name] ==undefined)
    {
        console.log("注意： 没有"+name.trim()+"这个元素");

        return ""

    }else
    {
        ID =  dicIDs[name];
    }
    return ID;
}

this.getID_addID= function getID(name) {
    var dicIDs =this.getdicIDs();
    var ID;
    if(name=="")
    {
        console.log("注意：  元素name 等于 空");

    }
    if(dicIDs[name] ==undefined)
    {
        ID =this.createID22bit();
        dicIDs[name] =ID;
        this.addID(dicIDs);

    }else
    {
        ID =  dicIDs[name];
    }
    return ID;
}


this.getID_addID_CommonID= function getID_addID_CommonID(name) {
    var dicIDs =this.getdicIDs();
    var ID;
    if(name=="")
    {
        console.log("注意：  元素name 等于 空");

    }
    if(dicIDs[name] ==undefined)
    {
        ID =this.createCommonID(); // 因为不是元素的主ID，commonID是属于关联ID
       // dicIDs[name] =ID;
     //   this.addID(dicIDs);

    }else
    {
        ID =  dicIDs[name];
    }
    return ID;
}
// 老版本判断ID是否存在
this.isID= function isID(name) {
    var dicIDs =this.getdicIDs();
    if(dicIDs[name] ==undefined)
    {
        return false;

    }
    return true;
}
//role_IDs_dic
//role_link_IDs_dic  以下是把词典分开处理的方式 支持文件和任务都会按照下面思路重构
// 另外为以后反向写入xls文件做准备，如任务要制定路径，支持文件和角色增加需要手动添加和自动化。
this.isID_exsit= function isID_exsit(type,name) {
    var dicIDs =this.getdicIDwithType(type);
    if(dicIDs[name] ==undefined)
    {
    return false;
    }
    if(dicIDs[name][type] ==undefined)
    {
        return false;
    }
    if(dicIDs[name]['role_link'] ==undefined)
    {
        return false;
    }
    return true;
}
this.addID_for_role =function addID_for_role (name)
{
    var dicIDs =this.getdicIDwithType('role');

    if(dicIDs[name] ==undefined)
    {
        dicIDs[name] ={};
        ID =this.createID22bit(); // 因为不是元素的主ID，commonID是属于关联ID
        dicIDs[name]['role'] =ID;
        this.addID_with_type(dicIDs);
        return ID;
    }
    if(dicIDs[name]['role'] ==undefined)
    {
        ID =this.createID22bit(); // 因为不是元素的主ID，commonID是属于关联ID
        dicIDs[name][type] =ID;
        this.addID_with_type(dicIDs);
        return ID;
    }
    else
    {
        ID =  dicIDs[name]['role'];
    }
    return ID;
}
//role_link
this.getID_withType= function getID_withType(type,name) {
    var ID;
    if(name=="")
    {
        console.log("注意：  元素name 等于 空");

    }
    switch(type)
    {
        case 'role':
            var dicIDs =this.getdicIDwithType('role');

            if(dicIDs[name] ==undefined)
            {
                dicIDs[name] ={};
            }
            if(dicIDs[name][type] ==undefined)
            {
                ID =this.createID22bit(); // 因为不是元素的主ID，commonID是属于关联ID
                dicIDs[name][type] =ID;
                this.addID_with_type(dicIDs);
                return ID;
            }
            else
            {
                ID =  dicIDs[name][type];
            }
            break;
        case 'role_link':
            var dicIDs =this.getdicIDwithType('role');
            if(dicIDs[name] ==undefined)
            {
                dicIDs[name] ={};
            }
            if(dicIDs[name][type] ==undefined)
            {
                ID =this.createCommonID(); // 因为不是元素的主ID，commonID是属于关联ID
                dicIDs[name][type] =ID;
                this.addID_with_type(dicIDs);
            }else
            {
                ID =  dicIDs[name][type];
            }
            break;
        default:
    }




    return ID;
}
//role_IDs_dic.json
this.getdicIDwithType= function getdicIDwithType(type) {

    var data  = fs.readFileSync('./template/'+type+'_IDs_dic.json');
    var json =JSON.parse(data);
    return json;
}

this.addID_with_type =function addID_with_type(dic) {
    var path = 'role';
    fs.writeFileSync('./template/'+path+'_IDs_dic.json',JSON.stringify(dic));
    console.log("id保存成功");
}