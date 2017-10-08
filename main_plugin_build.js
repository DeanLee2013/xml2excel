/**
 * Created by lidian on 2016/6/12.
 */
var fs = require('fs');
var xml2js = require('xml2js');
var helper = require('./helper.js');
var package_plugin=require('./template/package_plugin.json')
var parser = new xml2js.Parser();

var xml_realing_class  =require("./XML_reading_Josn_build.js");

//dir
var desktpPath   = 'C:\\Users\\IBM_ADMIN\\Desktop\\';
var pluginPath = desktpPath+'BOC2016wc\\trunk\\BOC_plugin\\' + 'plugin.xmi';
var configPath = desktpPath+'BOC2016wc\\trunk\\configurations\\Boc_config.xmi';
var bocGitPath = desktpPath+'BOC_RMC\\BOCNode\\';
var Workbook1Path = './中间文件基础包1.3.xml';
var collectionPath = './Book1.xml';//Book1.xml  //导入文件模板20161026

//需要写入config的文件
var RMCPath = 'BOC2016wc\\trunk\\BOC_plugin\\';
var tasksPath =desktpPath+RMCPath+ 'tasks\\';
var templatesPath =desktpPath+RMCPath+ 'guidances\\templates\\';
var supportingmaterialsPath =desktpPath+RMCPath+ 'guidances\\supportingmaterials\\';
var guidancesPath=desktpPath+RMCPath+ 'guidances\\';
var rolePath =desktpPath+RMCPath+ 'roles\\';


// 把xls中的xml读出来
var packageList_fromxls =['产品设计与实现过程文件','产品设计与实现过程文件（面向对象）','项目管理过程1','角色内容包','支持文件内容包']; // 第0部基础包创建  其中可能还包含分类等。常年不变的页面设计。
// '01 IT环境管理过程';//'02 产品功能测试过程';

var targetname = '角色内容包all'; // 第1步
//var targetname = '角色内容包test'; // 第1步
//var targetname = '支持文件内容包all'; // 第2步

//var targetname = '产品设计与实现过程文件'; // 第3步
//var targetname = '产品设计与实现过程文件（面向对象）'; // 第3步

//var targetname = '项目管理过程文件1'; // 第3步
//var targetname = '产品功能测试过程文件'; // 第3步


var jsonObj ; //整个 plugin的xml
//初始化方法
this.main =function main(){

    global.desktpPath = desktpPath;
    if(targetname=='项目管理过程文件1'||targetname=='产品设计与实现过程文件' ||targetname=='产品功能测试过程文件' ||targetname=='产品设计与实现过程文件（面向对象）' )
    {
        global.Workbook1Path = collectionPath;

    }else
    {
        global.Workbook1Path = Workbook1Path;

    }
    global.tasksPath = tasksPath;
    global.templatesPath = templatesPath;
    global.supportingmaterialsPath = supportingmaterialsPath;
    global.rolePath = rolePath;


    createDir();

    fs.readFile(pluginPath, function(err, data) {
        parser.parseString(data, function (err, result) {

            var jsonString = JSON.stringify(result);
            // helper.log('第一步 读取需要更新的plugin.xmi :' + jsonString);
            console.log('第一步 读取需要更新的plugin.xmi :' + jsonString);
          //  console.log('第一步 读取需要更新的plugin.xmi pluginPath :' + pluginPath);

            jsonObj = result;
            //内容包的根目录  CoreContent
            var plugin_0lv_childPackages = jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages'];//[0]["contentElements"];
          //var plugin_02v_childPackages = jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages'];//[0]["contentElements"];
            //RoleSets 下的contentElements （contentElements 下直接增加元素）
            var RoleSets = jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][0]['childPackages'][2]['contentElements'];//[0]["contentElements"];


            //下面这种方式取到的是三个methodPackages的数组。包括methodPackages  DeliveryProcesses ProcessContributions
            // var methodPackages =jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages']
            // console.log('第一步（1） methodPackages :' + JSON.stringify(methodPackages));
            //下面这种方式取到的是三个childPackages的数组。包括 Categories  CoreContent CapabilityPatterns
            //var childPackages = jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages']
            // console.log(childPackages :' + JSON.stringify(childPackages));
            // 根据以上规则，根据下面路径[1]取到CoreContent(数组第二位)。
            //jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]
            // 面下[1]['childPackages'] 就是父级包。30个过程应该在这一层。同时角色这一层。和指导文件应该在的她二级中。但现在临时放在这里。
            // jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages']

            console.log('第一步（1） 内容包的根目录 :' + JSON.stringify(plugin_0lv_childPackages));
            var ResourceManager = jsonObj['xmi:XMI']['org.eclipse.epf.uma.resourcemanager:ResourceManager'][0]['resourceDescriptors'];

            if (ResourceManager == undefined)
            {
                jsonObj['xmi:XMI']['org.eclipse.epf.uma.resourcemanager:ResourceManager']=
                    [
                        {
                            "$": {
                                "xmi:id": "_xCjDEHDrEea59qKaRLgS8w",
                                "guid": "_xCjDEHDrEea59qKaRLgS8w"
                            },
                            "resourceDescriptors": [ ]
                        }
                    ];

        };
           var  resourceDescriptors = jsonObj['xmi:XMI']['org.eclipse.epf.uma.resourcemanager:ResourceManager'][0]['resourceDescriptors'];

            //添加父类包 因为要增加child。
        //    add_0lv_contentPackage(plugin_0lv_childPackages);
            //为父类增加sub package
           add_02v_contentPackage(plugin_0lv_childPackages,resourceDescriptors)
        });
    });
}

// function update_content() {
//     //添加父类包 因为要增加child。
//     add_0lv_contentPackage();
//     //为父类增加sub package
//    // add_02v_contentPackage()
//
// }
//下面这种方式取到的是三个methodPackages的数组。包括methodPackages  DeliveryProcesses ProcessContributions
// var methodPackages =jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages']
// console.log('第一步（1） methodPackages :' + JSON.stringify(methodPackages));
//下面这种方式取到的是三个childPackages的数组。包括 Categories  CoreContent CapabilityPatterns
//var childPackages = jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages']
// console.log(childPackages :' + JSON.stringify(childPackages));
// 根据以上规则，根据下面路径[1]取到CoreContent(数组第二位)。
//jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]
// 面下[1]['childPackages'] 就是父级包。30个过程应该在这一层。与角同级。  指导文件应该在的它二级中。但现在临时放在这里。
// jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages']

//给他们赋值 可以省略
//jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages']=plugin_0lv_childPackages;
// jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages'].push(plugin_0lv_childPackages)

//正常的逻辑，是应该我给对方一个内容包。对方就在这个内容包下
function add_02v_contentPackage(plugin_0lv_childPackages,resourceDescriptors)// sub package and element
{

    if(targetname == '角色内容包all') // 角色包的重构，后面重构其他的target
    {
        jsonObj =xml_realing_class.xml_readiing_updapting(jsonObj,targetname);
        update_plugin_save();
        return;
    }
    var target ; //找到目标的targt 然后对她增加内容。可能是过程或者角色。

    for(var packagekey in plugin_0lv_childPackages)
    {
        //package['$']['name'];
      //  console.log('遍历父级内容包 :' + JSON.stringify( plugin_0lv_childPackages[packagekey]));

      var currentname = plugin_0lv_childPackages[packagekey]['$']['name']
        if(currentname ==targetname)
        {
            target =plugin_0lv_childPackages[packagekey];
           break;
        }

        console.log('遍历父级内容包 :'+ currentname);

    }
    //*********
    // 读取xml 并赋值
    //*********

    var xml_readiing_result  =   xml_realing_class.xml_readiing(resourceDescriptors,targetname); //返回两个列表
    resourceDescriptors =  xml_readiing_result[1];// 获取描述符。
    //更新resource 描述 增加文件
    jsonObj['xmi:XMI']['org.eclipse.epf.uma.resourcemanager:ResourceManager'][0]['resourceDescriptors']= resourceDescriptors;
    //文件更新 plugin 和 config
    var package_plugin_list =  xml_readiing_result[0]; // 获取child page list 遍历push到 01LV的
    var SubPackageIDList_for_config =[];
    if(!target.hasOwnProperty('childPackages'));
    {
        target.childPackages = [];
    }
    for(var key in package_plugin_list)
    {
        target.childPackages.push(package_plugin_list[key]);
        SubPackageIDList_for_config.push(key);
    }

    update_plugin_save();
    update_config_save(SubPackageIDList_for_config);

}
//this.updateRMC_PlugInXml =
// 创建角色包
// 创建过程包
// 过程包下面创建一个指导文件包 应该在 02lv下面。现在临时和角色同级
//add_0lv_contentPackage 是在做父级包的过程。 packageList_fromxls 现在是写在这个数组中。实际应该从xls中获得。
function add_0lv_contentPackage(plugin_0lv_childPackages) {
   var PackageIDList_for_config=[];
    for(var rowIndex in packageList_fromxls)
    {
        var  newcontentPackage =   JSON.parse(JSON.stringify(package_plugin));
        newcontentPackage['$']['name'] =packageList_fromxls[rowIndex];
        var newID22 =helper.createID22bit();
        PackageIDList_for_config.push(newID22);
        newcontentPackage['$']['xmi:id'] =newID22;
        newcontentPackage['$']['guid'] =  newID22;
        console.log("父内容包0LV:"+newcontentPackage['$']['name']);
        //newcontentPackage['contentElements'].push(contentElements);
       // plugin_0lv_childPackages.push(newcontentPackage);
        //
        jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages'].push(newcontentPackage)
    };
    //下面这种方式取到的是三个methodPackages的数组。包括methodPackages  DeliveryProcesses ProcessContributions
    // var methodPackages =jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages']
    // console.log('第一步（1） methodPackages :' + JSON.stringify(methodPackages));
    //下面这种方式取到的是三个childPackages的数组。包括 Categories  CoreContent CapabilityPatterns
    //var childPackages = jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages']
    // console.log(childPackages :' + JSON.stringify(childPackages));
    // 根据以上规则，根据下面路径[1]取到CoreContent(数组第二位)。
    //jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]
    // 面下[1]['childPackages'] 就是父级包。30个过程应该在这一层。同时角色这一层。和指导文件应该在的她二级中。但现在临时放在这里。
    // jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages']

    //把父内容包放入CoreContent（内容包）
  //  jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages']=plugin_0lv_childPackages;

    update_plugin_save();
    update_config_save(PackageIDList_for_config);
}



//更新配置文件 this.updateRMCConfigXml = PackageIDList_for_config 需要一个ID在config文件中 注册ID。
function update_config_save(PackageIDList_for_config) {

    //C:\Users\IBM_ADMIN\Desktop\BOC\bocconfig.xmi
    fs.readFile(configPath, function (err, data) {

        parser.parseString(data, function (err, result) {

            jsonString = JSON.stringify(result);
            var jsonObj = result;
            console.log('第五步 更新配置文件：' );//+ jsonString);

            var methodPackageSelectionArray = jsonObj['org.eclipse.epf.uma:MethodConfiguration']['methodPackageSelection'];
            var methodPackageSelectionTemplate =
            {
                "$": {
                    "xsi:type": "org.eclipse.epf.uma:ContentPackage",
                    "href": "uma://_TKMJwClOEeabmZQ4OgAhFg#_oU9toCgKEeaKzYzycMmkRw"
                }
            };

            for (var SelectionIndex in PackageIDList_for_config) {
                // 前面的uma 应该是plugin的ID  后面是新生成的ID。需要分开传
                var newmethodPackageSelectionTemplate = helper.clone(methodPackageSelectionTemplate);
                newmethodPackageSelectionTemplate['$']['href'] = 'uma://_TKMJwClOEeabmZQ4OgAhFg#' + PackageIDList_for_config[SelectionIndex];
                methodPackageSelectionArray.push(newmethodPackageSelectionTemplate);

            };

            console.log('第六步 生成的方法包的配置：');// + JSON.stringify(methodPackageSelectionArray));

            //写书文件。
            jsonObj['org.eclipse.epf.uma:MethodConfiguration']['methodPackageSelection'] = methodPackageSelectionArray;
            console.log( '第七步 写入文件：' + JSON.stringify(jsonObj));


            var builder = new xml2js.Builder();
            var xml = builder.buildObject(jsonObj);

            fs.writeFile(configPath, xml, function (err) {
                if (err) throw err;
                console.log("第十步 BOC演示配置.xmi File Saved !"); //文件被保存
            });
        });
    })
};

function createDir() {

    fs.mkdir(rolePath, function (err) {
        if (!err) {
            console.log("rolePath文件夹创建成功！");
        } else {
            console.log("rolePath文件夹已存在."+err);
        }
    });

    fs.mkdir(guidancesPath, function (err) {
        if (!err) {
            console.log("guidances文件夹创建成功！");
        } else {
            console.log("guidances文件夹已存在."+err);
        }
    });

    fs.mkdir(supportingmaterialsPath, function (err) {
        if (!err) {
            console.log("supportingmaterials文件夹创建成功！");
        } else {
            console.log("supportingmaterials文件夹已存在."+err);
        }
    });

    fs.mkdir(tasksPath, function (err) {
        if (!err) {
            console.log("tasks文件夹创建成功！");
        } else {
            console.log("tasks文件夹已存在."+err);
        }
    });


    fs.mkdir(templatesPath, function (err) {
        if (!err) {
            console.log("templates文件夹创建成功！");
        } else {
            // console.log("操作失败！" + err);
            console.log("templates文件夹已存在."+err);
        }
    });
}


function update_plugin_save() {
    console.log("第九步 更新plugin xml  update_plugin_save");

    var builder = new xml2js.Builder();
    console.log("第九步 更新plugin xml  update_plugin_save:"+JSON.stringify(jsonObj));

    var xml = builder.buildObject(jsonObj);

    fs.writeFile(pluginPath,xml,function (err) {
        if (err) throw err ;
        console.log("第九步 plugin.xmi File Saved !"); //文件被保存
    }) ;
}