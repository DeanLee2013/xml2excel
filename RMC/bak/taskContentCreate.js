/**
 * Created by lidian on 2016/6/12.
 */
var fs = require('fs');
var xml2js = require('xml2js');
var helper = require('./../helper.js');

var desktpPath   = 'C:\\Users\\IBM_ADMIN\\Desktop\\';
var rmcDemoPath =desktpPath+ 'BOC\\';
var bocGitPath = desktpPath+'BOCNodePro\\BOCNode\\';
var Workbook1Path = bocGitPath + 'Workbook11.xml';
var pluginPath = rmcDemoPath+'BOCDemo\\BOC_SoftwareCenter_RMC\\' + 'plugin.xmi';
var configPath = rmcDemoPath+ '\\BOCDemo\\configurations\\BOC演示配置 - Copy.xmi';
// 把xls中的xml读出来
var parser = new xml2js.Parser();

var xlsJsonArray =[];
var josnobj ;
this.UpadateXML =function getXmlfromXLS(){
fs.readFile(Workbook1Path, function(err, data) {

        parser.parseString(data, function (err, result) {
            console.log("从xls中拿到json："+ JSON.stringify(result));

            var josnobj=  result['Workbook']['Worksheet'][0]['Table'][0]['Row'];
            for ( var row in josnobj)
            {
                var value_cell =JSON.stringify(josnobj[row]['Cell'][0]['Data'][0]['_']);
                console.dir( value_cell);
                xlsJsonArray.push(value_cell.trim())
            }

            console.log( xlsJsonArray);
            updateRMCxml();


        })
    }
);
};

function updateRMCxml(){
    fs.readFile(pluginPath, function(err, data) {
        parser.parseString(data, function (err, result) {

            var jsonString = JSON.stringify(result);
            var jsonObj = result;
            console.log('需要更新的plugin.xmi :' + jsonString);

            var xmlcontentElements =   jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][1]['childPackages'];//[0]["contentElements"];

            console.log('从xml中拿到的json'+ JSON.stringify( xmlcontentElements));


            var newcontentPackageTemplate =
// {
//     "childPackages":
            {
                "$": {
                    "xsi:type": "org.eclipse.epf.uma:ContentPackage",
                    "xmi:id": "_oU9toCgKEeaKzYzycMmkRw",
                    "name": "测试内容包",
                    "guid": "_oU9toCgKEeaKzYzycMmkRw",
                    "presentationName": "测试内容包"
                },
                "methodElementProperty": [
                    {
                        "$": {
                            "xmi:id": "_pa4M0CgKEeaKzYzycMmkRw",
                            "name": "me_edited",
                            "value": "true"
                        }
                    }
                ],
                "contentElements": [
                    {
                        "$": {
                            "xsi:type": "org.eclipse.epf.uma:Task",
                            "xmi:id": "_pB8mEDk6EeaWnYMysYl40g",
                            "name": "new_task11",
                            "guid": "_pB8mEDk6EeaWnYMysYl40g",
                            "presentationName": "New Task11",
                            "briefDescription": "1"
                        },
                        "methodElementProperty": [
                            {
                                "$": {
                                    "xmi:id": "_q9P1IDk6EeaWnYMysYl40g",
                                    "name": "me_edited",
                                    "value": "true"
                                }
                            }
                        ]
                    },
                    {
                        "$": {
                            "xsi:type": "org.eclipse.epf.uma:Task",
                            "xmi:id": "_pvFY4Dk6EeaWnYMysYl40g",
                            "name": "new_task_2",
                            "guid": "_pvFY4Dk6EeaWnYMysYl40g",
                            "presentationName": "New Task 2",
                            "briefDescription": "1"
                        },
                        "methodElementProperty": [
                            {
                                "$": {
                                    "xmi:id": "_qerp0Dk6EeaWnYMysYl40g",
                                    "name": "me_edited",
                                    "value": "true"
                                }
                            }
                        ]
                    }
                ]
            }
//}

            var contentElements =
            {
                "$": {
                    "xsi:type": "org.eclipse.epf.uma:Task",
                    "xmi:id": "_YAGKQDkcEeaWnYMysYl40g",
                    "name": "new_task1",
                    "guid": "_YAGKQDkcEeaWnYMysYl40g",
                    "presentationName": "New Task1",
                    "briefDescription": "22"
                },
                "methodElementProperty": [
                    {
                        "$": {
                            "xmi:id": "_cPT8sDkcEeaWnYMysYl40g",
                            "name": "me_edited",
                            "Zvalue": "true"
                        }
                    }
                ]
            };
            console.log(JSON.stringify(newcontentPackageTemplate['contentElements']));
            newcontentPackageTemplate['contentElements'].push(contentElements);
            console.log(JSON.stringify(newcontentPackageTemplate));

            // var builder = new xml2js.Builder();
            // var xml = builder.buildObject(newcontentPackageTemplate);
            //
            // console.log(xml);
            // return;
            // var configIDList =[];
            // var newID22 =helper.createID22bit();
            // configIDList.push(newID22);

            xmlcontentElements.push(newcontentPackageTemplate);





           var configIDList =[];

            for(var rowIndex in xlsJsonArray)
            {
                var  newcontentPackage = helper.clone(newcontentPackageTemplate);
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
            console.log('更新配置文件：' + jsonString);

            var methodPackageSelectionArray = jsonObj['org.eclipse.epf.uma:MethodConfiguration']['methodPackageSelection'];

            console.log('从xml中拿到的json' + JSON.stringify(methodPackageSelectionArray));
            console.log('methodPackageSelectionArray count: ' + methodPackageSelectionArray.length);

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

            console.log('生成的方法报配置：' + JSON.stringify(methodPackageSelectionArray));

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
