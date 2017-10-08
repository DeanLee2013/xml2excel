/**
 * Created by lidian on 2016/6/12.
 */
var fs = require('fs');
var xml2js = require('xml2js');
var helper = require('./../helper.js');
var role_plugin=require('./../template/role_plugin.json')
var package_plugin=require('./../template/package_plugin.json')
var Artifct_plugin=require('./../template/Artifct_plugin.json')
var task_plugin=require('./../template/plugin_task.json')
var resourceDescriptorsJson_config=require('./../template/resourceDescriptors.json')

var desktpPath   = 'C:\\Users\\IBM_ADMIN\\Desktop\\';
var rmcDemoPath =desktpPath+ 'BOC\\';
var bocGitPath = desktpPath+'BOCNodePro\\BOCNode\\';
var Workbook1Path = bocGitPath + 'xlsDemo.xml';
var pluginPath = rmcDemoPath+'BOCDemo\\BOC_SoftwareCenter_RMC\\' + 'plugin.xmi';
var configPath = rmcDemoPath+ '\\BOCDemo\\configurations\\BOC演示配置.xmi';
// 把xls中的xml读出来
var parser = new xml2js.Parser();

var xlsJsonArray =['需求意向调研'];
var josnobj ;
//初始化 内容包模板
var newcontentPackageTemplate = package_plugin;

//updateRMCxml();

// this.createrole =
this.push_role=function push_role(name,pname,desc)
{
    var  newIns =   JSON.parse(JSON.stringify(role_plugin));
    var newID22 =helper.createID22bit();
    //configIDList.push(newID22);
    newIns['$']['xmi:id'] =newID22;
    newIns['$']['guid'] =  newID22;
    newIns['$']['name'] =name//"测试角色";
    newIns['$']['presentationName'] =  pname//"测试角色11";

    console.log("newID22:",newID22);
    //xmlcontentElements.push(newIns);
    newcontentPackageTemplate['contentElements'].push(newIns);

}

this.push_Artifct = function push_Artifct(name,pname,desc)
{
    var  newIns =   JSON.parse(JSON.stringify(Artifct_plugin));
    var newID22 =helper.createID22bit();
    //configIDList.push(newID22);
    newIns['$']['xmi:id'] =newID22;
    newIns['$']['guid'] =  newID22;
    newIns['$']['name'] =name//"测试角色";
    newIns['$']['presentationName'] =  pname//"测试角色11";
    //工件
    newcontentPackageTemplate['contentElements'].push(newIns);
}
this.push_task = function push_task(name,pname,desc)
{
    var  newIns =   JSON.parse(JSON.stringify(task_plugin));
    var newID22 =helper.createID22bit();
    //configIDList.push(newID22);
    newIns['$']['xmi:id'] =newID22;
    newIns['$']['guid'] =  newID22;
    newIns['$']['name'] =name//"测试角色";
    newIns['$']['presentationName'] =  pname//"测试角色11";
    //工件
    newcontentPackageTemplate['contentElements'].push(newIns);
}

//updateRMCxml();//
this.updateRMCxml =function updateRMCxml(){
    fs.readFile(pluginPath, function(err, data) {
        parser.parseString(data, function (err, result) {

            var jsonString = JSON.stringify(result);
            var jsonObj = result;
            console.log('需要更新的plugin.xmi :' + jsonString);
            //内容包的根目录
            var xmlcontentElements =   jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages'];//[0]["contentElements"];

            var resourceDescriptors =jsonObj['xmi:XMI']['org.eclipse.epf.uma.resourcemanager:ResourceManager'][0]['resourceDescriptors'];
//console.log(resourceDescriptors);
            console.log(resourceDescriptors);

            //  console.log('从xml中拿到的json'+ JSON.stringify( xmlcontentElements));

            //可以独立独立出一个方法
            //像上面一样
            resourceDescriptors.push(resourceDescriptorsJson_config);
            //也可以独立一个方法
           var configIDList =[];
            for(var rowIndex in xlsJsonArray)
            {
                var  newcontentPackage =   JSON.parse(JSON.stringify(newcontentPackageTemplate));
                newcontentPackage['$']['name'] =xlsJsonArray[rowIndex];
                var newID22 =helper.createID22bit();
                configIDList.push(newID22);
                newcontentPackage['$']['xmi:id'] =newID22;
                newcontentPackage['$']['guid'] =  newID22;
                console.log("newcontentPackage:",newcontentPackage);
                //newcontentPackage['contentElements'].push(contentElements);

                xmlcontentElements.push(newcontentPackage);
                //
            };

            //更新resource 描述 增加文件
            jsonObj['xmi:XMI']['org.eclipse.epf.uma.resourcemanager:ResourceManager'][0]['resourceDescriptors']= resourceDescriptors;
            //更新内容包
            jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages']=xmlcontentElements;

            var builder = new xml2js.Builder();
            var xml = builder.buildObject(jsonObj);

            fs.writeFile(pluginPath,xml,function (err) {
                if (err) throw err ;
                console.log("plugin.xmi File Saved !"); //文件被保存
            }) ;


           updateRMCConfigXml(configIDList);

        });
    });
}


//更新配置文件
function updateRMCConfigXml(newPackages) {
//C:\Users\IBM_ADMIN\Desktop\BOC\bocconfig.xmi
    fs.readFile(configPath, function (err, data) {

        parser.parseString(data, function (err, result) {
            // console.dir(result);
            //  console.log('Done');
            //读config

            jsonString = JSON.stringify(result);
            var jsonObj = result;
            console.log('更新配置文件：' );//+ jsonString);

            var methodPackageSelectionArray = jsonObj['org.eclipse.epf.uma:MethodConfiguration']['methodPackageSelection'];

          //  console.log('从xml中拿到的json' + JSON.stringify(methodPackageSelectionArray));
           // console.log('methodPackageSelectionArray count: ' + methodPackageSelectionArray.length);

            var methodPackageSelectionTemplate =
            {
                "$": {
                    "xsi:type": "org.eclipse.epf.uma:ContentPackage",
                    "href": "uma://_TKMJwClOEeabmZQ4OgAhFg#_oU9toCgKEeaKzYzycMmkRw"
                }
            };



            //给 从上一个方法传进来三个ID
            //console.log('SelectionIndex' + JSON.stringify(newPackages));

            for (var SelectionIndex in newPackages) {
                // 前面的uma 应该是plugin的ID  后面是新生成的ID。需要分开传
                console.log('SelectionIndex：' + JSON.stringify('uma://_TKMJwClOEeabmZQ4OgAhFg#' + newPackages[SelectionIndex]));

                var newmethodPackageSelectionTemplate = helper.clone(methodPackageSelectionTemplate);
                newmethodPackageSelectionTemplate['$']['href'] = 'uma://_TKMJwClOEeabmZQ4OgAhFg#' + newPackages[SelectionIndex];
                methodPackageSelectionArray.push(newmethodPackageSelectionTemplate);
                console.log('SelectionIndex：' + JSON.stringify(newmethodPackageSelectionTemplate));

            };

            console.log('methodPackageSelectionArray count: ' + methodPackageSelectionArray.length);

            console.log('生成的方法包的配置：');// + JSON.stringify(methodPackageSelectionArray));

            //写书文件。
            jsonObj['org.eclipse.epf.uma:MethodConfiguration']['methodPackageSelection'] = methodPackageSelectionArray;
            console.log('写入文件：' + JSON.stringify(jsonObj));


            var builder = new xml2js.Builder();
            var xml = builder.buildObject(jsonObj);

            fs.writeFile(configPath, xml, function (err) {
                if (err) throw err;
                console.log("BOC演示配置.xmi File Saved !"); //文件被保存
            });
        });
    })
};
