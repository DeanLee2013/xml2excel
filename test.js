/**
 * Created by DeanLee on 16/7/14.
 */
/**
 * Created by DeanLee on 16/7/12.
 */
var fs = require('fs');
var xml2js = require('xml2js');
var helper = require('./helper.js');
var role_plugin=require('./template/role_plugin.json')
var package_plugin=require('./template/package_plugin.json')
var Artifct_plugin=require('./template/Artifct_plugin.json')
var main = require('./bak/main.js');
var create_task_config = require('./config_create_task');
var desktpPath   = 'C:\\Users\\IBM_ADMIN\\Desktop\\';
var rmcDemoPath =desktpPath+ 'BOC\\';
var bocGitPath = desktpPath+'BOC_RMC\\BOCNode\\';
var Workbook1Path = bocGitPath + 'xlsDemo1.2.xml';
var pluginPath = rmcDemoPath+'BOCDemo\\BOC_SoftwareCenter_RMC\\' + 'plugin.xmi';
var configPath = rmcDemoPath+ '\\BOCDemo\\configurations\\BOC演示配置 - Copy.xmi';

var task_plugin=require('./template/plugin_task.json')
var resourceDescriptors_in_plugin=require('./template/resourceDescriptors.json')
/**
 * Created by lidian on 2016/6/12.
 */
// clone
var dicIDsJson=require('./template/dicIDs.json');
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
//
// //this.
// // addID('1','1');
// // var a =getdicIDs();
// // console.log(a);
// function getJsonObjLength(jsonObj) {
//     var Length = 0;
//     for (var item in jsonObj) {
//         Length++;
//     }
//     return Length;
// }
// this.getdicIDs= function getdicIDs() {
//
//     var data  = fs.readFileSync('./template/dicIDs.json');
//     // var JosnString={};
//     //     console.log(data);
//     //
//     //     parser.parseString(data, function (err, data) {
//     //     JosnString =data;
//     //
//     // });
//     console.log(data.length);
//     var json =JSON.parse(data);
//     console.log(getJsonObjLength(json));
//
//     return json;
// }
// this.getdicIDs();
// return;
// 把xls中的xml读出来
// var parser = new xml2js.Parser();
//
// var xlsJsonArray =[];
// var josnobj ;
// xml_readiing();
// function xml_readiing(){
//     var data  = fs.readFileSync(Workbook1Path,'utf-8');
//     var JosnString;
//     parser.parseString(data, function (err, result) {
//         JosnString =result;
//     });
//     console.log(JSON.stringify(JosnString));
//
//     buildXML(JosnString);
//
// };
//
// function buildXML(JosnString) {
//     //单独读取一行数据
//     console.log("4-1 下面build增加新任务");
//     console.log(JSON.stringify(JosnString));
//
//     var rowlist_josnobj = JosnString['Workbook']['Worksheet'][0]['Table'][0]['Row'];
//     var steplist =[];
//     //遍历row的每一行 判断属性
//     console.log(JSON.stringify(rowlist_josnobj));
//
//     var  rowindex =3;
//     var rowindexforStep = ++rowindex;
//     if(rowindexforStep==rowlist_josnobj.length)
//     {
//        // create_task_config.add_task_config(taskid,commonID,task1,steplist);
//         console.log(rowindexforStep+"下一行不是任务或者超出总行数 ");
//
//         retun;
//     }
//     console.log(rowindexforStep+"~~~~~~");
//
//     var cell_row_object = rowlist_josnobj[rowindexforStep]['Cell'];
//     var value_cell = JSON.stringify(cell_row_object[0]['Data'][0]['_']);
//     console.log(value_cell+"~~~~~~"+(value_cell==='"步骤"'));
//
//     while (value_cell=='"步骤"')
//     {
//         console.log(value_cell+"~单元格第一行");
//
//         cell_row_object = rowlist_josnobj[rowindexforStep]['Cell'];
//         value_cell = JSON.stringify(cell_row_object[0]['Data'][0]['_']);
//         console.log(JSON.stringify( value_cell)+"重新取值"+(value_cell =='"步骤"'));
//
//         if(value_cell!='"步骤"')
//         {
//             break;
//         }
//
//         var step_value1 = cell_row_object[3]['Data'][0]['_'].trim();
//         var step_value2 = cell_row_object[5]['Data'][0]['_'].trim();
//         steplist.push(step_value1+','+step_value2);
//         console.log('步骤：'+step_value1+','+step_value2);
//         ++rowindexforStep;
//
//     }
//  //   create_task_config.add_task_config(taskid,commonID,task1,steplist);
//
// };
//
// return;

// var myModule = require("./myModule.js");
//

//
// // var config=JSON.parse(fs.readFileSync('./template/role_plugin_p.json','utf-8'))
// // console.dir(config);
//
// var config=require('./template/role_plugin_p.json')
// console.dir(config);

//myModule.showLog();
//console.log(myModule.name);
//console.log(myModule.location);

//function cat(name, age, score){
//    this.name = name;
//    this.age = age;
//    this.score = score;
//}
//var c = new cat("miao", 2, [6,8,7]);
//console.dir(c);
//console.log(c);




//
// function md5 (text) {
//
//     var crypto = require('crypto');
//     return crypto.createHash('md5').update(text).digest('hex');
// };
//
// function createID22bit () {
//
//   return '_'+ md5(Math.random().toString()).substr(0,22)
// };
//
//
// console.log(createID22bit());
//
// // substring(0,6)
// return;



// var arr = ["One","Two","Three"];
//
// var arrtooo = arr.concat();
// arrtooo[1] = "set Map To";
// console.log("数组的原始值：" + arr + "<br />");//Export:数组的原始值：One,Two,Three
// console.log("数组的新值：" + arrtooo + "<br />");//Export:数组的新值：One,set Map To,Three
//


var fs = require('fs'),
    xml2js = require('xml2js');
var josnobj ;

var parser = new xml2js.Parser();
//fs.readFile('/Users/DeanLee/Documents/git/RMC_XLS_XMI/XML/' + 'plugin2.xmi', function(err, data) {
fs.readFile( 'test.xml', function(err, data) {

    parser.parseString(data, function (err, result) {
        // console.dir(result);
        //  console.log('Done');

        josnobj=   JSON.stringify(result)
         console.dir(josnobj);
        //console.log(typeof josnobj);

        //var fs = require('fs'),
        //    xml2js = require('xml2js');

        //var obj = {name: "Super", Surname: "Man", age: 23};
        //console.log(typeof obj);



        var builder = new xml2js.Builder();
        var xml = builder.buildObject(result);
        //  console.log(result);

        // console.log(result['xmi:XMI']['$']['xmi:version'])
        //Worksheet
        //
        console.log(' 打印table Done');

        //console.log(result['Workbook']['Worksheet'][0]);
        //console.log(' 打印table Done2');
        //// 伪代码取值
        //console.log(result['Workbook']['Worksheet'][0]['Table'][0]['Row'][0]['Cell'][0]['Data']);
        //console.log(result['Workbook']['Worksheet'][0]['Table'][0]['Row'][0]['Cell'][0]['Data'][0]['_']);
        //


        var tables =result['Workbook']['Worksheet'] ;
        console.log(typeof  tables);

        for(var item in tables){
            //item 表示Json串中的属性，如'name'
            var jValue=tables[item];//key所对应的value
            console.log("values"+jValue);

            console.log("keys："+item);

        }


        //第二种获得值的方式
        for(var item in result['Workbook']['Worksheet']){
            if(item=='xmi:XMI'){  //item 表示Json串中的属性，如'name'
                var jValue=result[item];//key所对应的value
                console.log(jValue);

            }
        }


        //var eValue=eval('result[''xmi:XMI''].'+'''$''');
        //
        //console.log(eValue);




        //console.log(xml);
        //console.log(typeof xml);


    });

});

function hello() {
    console.log('Hello World!');
}

//随机码
//https://nodejs.org/api/crypto.html#crypto_new_crypto_certificate

//var parseString = require('xml2js').parseString;
//var xml = "<root>Hello xml2js!</root>"
//parseString(xml, function (err, result) {
//    console.dir(result);
//    console.log('Done2');
//
//    console.dir(result);
//
//});


//备份

function add_role1(name,desc,responsibleFor)
{
    // console.log("负责push_role:",responsibleFor);
    var rolelsit = package_plugin_Array[subpackagecount]['contentElements']
    // for (roleindex in rolelsit)
    // {
    //     console.log('角色名称：'+ rolelsit[roleindex]['$']['name']);
    //     if( rolelsit[roleindex]['$']['name'] ==name)
    //     {
    //        // var newdesc=
    //         var newdesc=   rolelsit[roleindex]['$']['briefDescription']+'</b>'+desc;
    //         rolelsit[roleindex]['$']['briefDescription'] =newdesc;
    //
    //         package_plugin_Array[subpackagecount]['contentElements']+=desc;
    //         return;
    //     }
    // }

    var  newIns =   JSON.parse(JSON.stringify(role_plugin));
    var newID= helper.getID_addID(name);
    newIns['$']['xmi:id'] =newID;
    newIns['$']['guid'] =  newID;
    newIns['$']['name'] =name;
    newIns['$']['presentationName'] =  name;
    newIns['$']['briefDescription'] =  desc;
    newIns['$']['responsibleFor'] =  responsibleFor;
    package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
    role_ID_Name_Dic[name] = newID;
    //
    // return;
    // var ishasID =helper.isID(name);
    //
    // var rolelsit = package_plugin_Array[subpackagecount]['contentElements']
    // if(ishasID)
    // {
    //     for (roleindex in rolelsit)
    //     {
    //         console.log('角色名称：'+ rolelsit[roleindex]['$']['name']);
    //         if( rolelsit[roleindex]['$']['name'] ==name)
    //         {
    //             package_plugin_Array[subpackagecount]['contentElements']+=desc;
    //
    //           //  rolelsit[roleindex]['$']['briefDescription']+=desc;
    //         }
    //     }
    // }else
    // {
    //     var  newIns =   JSON.parse(JSON.stringify(role_plugin_p));
    //     var newID= helper.getID_addID(name);
    //     newIns['$']['xmi:id'] =newID;
    //     newIns['$']['guid'] =  newID;
    //     newIns['$']['name'] =name;
    //     newIns['$']['presentationName'] =  name;
    //     newIns['$']['briefDescription'] =  desc;
    //     newIns['$']['responsibleFor'] =  responsibleFor;
    //     package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
    //     role_ID_Name_Dic[name] = newID;
    // }
    // var newID= helper.getID_addID(name);
    //
    // newIns['$']['xmi:id'] =newID;
    // newIns['$']['guid'] =  newID;
    // newIns['$']['name'] =name;
    // newIns['$']['presentationName'] =  desc;
    // newIns['$']['responsibleFor'] =  responsibleFor;
    // package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
    // role_ID_Name_Dic[name] = newID;
}
