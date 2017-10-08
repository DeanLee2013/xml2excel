/**
 * Created by lidian on 2016/8/2.
 */
/**
 * Created by lidian on 2016/6/12.
 */
var rolecase = '角色';
var fs = require('fs');
var xml2js = require('xml2js');
var helper = require('./helper.js');
var role_plugin_p=require('./template/role_plugin_p.json')
var role_plugin=require('./template/role_plugin.json')

var package_plugin=require('./template/package_plugin.json')
var Artifct_plugin=require('./template/Artifct_plugin.json')
var main = require('./bak/main.js');

//config 脚本
var create_task_config = require('./config_create_task');
var create_role_config = require('./config_create_role');

var config_new_template = require('./config_new_template');
var config_supporting_material = require('./config_supporting_material');

var plugin_task=require('./template/plugin_task.json')
var plugin_Template=require('./template/plugin_Template.json')
var plugin_SupportingMaterial=require('./template/plugin_SupportingMaterial.json')

var resourceDescriptors_in_plugin=require('./template/resourceDescriptors.json')

// 把xls中的xml读出来
var parser = new xml2js.Parser();

var xlsJsonArray =[];
var josnobj ;
var newcontentPackage=require('./template/package_plugin.json');
var package_plugin_list =  new Array(); //忘了
var package_plugin_Array =  []; //忘了
var role_desc_dic =  new Array(); //叠加介绍
var role_skill_dic =  new Array(); //叠加技能介绍
var task_name_dic =  new Array(); //去重

//var packages_dicArray = new Array();
var result=[];
var resourceDescriptors;

//init
this.xml_readiing =function xml_readiing(desc,targetname){
    console.log("第二步 读写xml 数据 ");
    resourceDescriptors=desc;
    if(global.xmlpath)
    {
        global.Workbook1Path=global.xmlpath;
        console.log(Workbook1Path);
    }
    var data  = fs.readFileSync(global.Workbook1Path,'utf-8');
    var JosnString;
    parser.parseString(data, function (err, result) {
        JosnString =result;
    });
    buildXML(JosnString,targetname);
    for(var key in package_plugin_list)
    {
        console.log("key:"+key+"子包:"+JSON.stringify(package_plugin_list[key]));
    }
    result[0]=package_plugin_list;
    result[1]=resourceDescriptors;
//configIDList.push(
    return result ;
};
var RoleSets ;
this.xml_readiing_updapting =function xml_readiing_updapting(RMC_jsonObj,targetname){
    console.log("第二步 读写xml 数据 ");
    if(global.xmlpath)
    {
        global.Workbook1Path=global.xmlpath;
        console.log(Workbook1Path);
    }
    var xlsdata  = fs.readFileSync(global.Workbook1Path,'utf-8');

   var  xlsJosnString ;//=  parser.parseString(xlsdata);
    parser.parseString(xlsdata, function (err, result) {
        xlsJosnString =result;
    });

    RoleSets = RMC_jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][0]['childPackages'][2]['contentElements'];
    // var newRoleSets = buildXML(xlsJosnString,targetname);
    // var newRoleSets =
    buildXML(xlsJosnString,targetname);

    RMC_jsonObj['xmi:XMI']['org.eclipse.epf.uma:MethodPlugin'][0]['methodPackages'][0]['childPackages'][0]['childPackages'][2]['contentElements'] = RoleSets;
    return RMC_jsonObj ;
};



var subpackagecount  = -1;
function getValue(cell_row_object,index) {
    if  ( cell_row_object[index]==undefined)
    {
        return '';
    }
    if  ( cell_row_object[index]['Data']==undefined)
    { return '';}
    if  ( cell_row_object[index]['Data']=='-')
    { return '';}
    var cell_row_objectString = cell_row_object[index]['Data'][0]['_'];
    if  ( cell_row_objectString=='-')
    { return '';}
    if  ( cell_row_objectString=='无')
    { return '';}
    return  cell_row_objectString.trim();
}
var rowindex1 = 0;

function buildXML(JosnString,targetname ) {
        //单独读取一行数据
    console.log("开始解析中间文件 ： 4-1 下面build增加新任务");

        var rowlist_josnobj ;// = JosnString['Workbook']['Worksheet'][0]['Table'][0]['Row']; //这里面可以做成变量，读取后下拉框选择 读取什么类型的表？
    console.log("rowlist_josnobj："+JSON.stringify( rowlist_josnobj));

    //根据目标判断读取的sheet。 如：角色内容包，或者过程名
    // console.log("sheet："+JSON.stringify( sheetlist));
    // var sheetname =JosnString['Workbook']['Worksheet'][0]['$']['ss:Name'];
    // console.log("sheetname："+JSON.stringify( sheetname));
    var sheetlist =JosnString['Workbook']['Worksheet'];
    for (var sheetindex in sheetlist) {
      var sheet = sheetlist[sheetindex]
        var sheetname =sheet['$']['ss:Name'];
        console.log("sheetname："+JSON.stringify( sheetname));
        if(sheetname ==targetname){
             rowlist_josnobj = sheetlist[sheetindex]['Table'][0]['Row']; //这里面可以做成变量，读取后下拉框选择 读取什么类型的表？
        }
    }
    // return;
        //遍历row的每一行 判断属性


    for (var rowindex in rowlist_josnobj) {
            var cell_row_object = rowlist_josnobj[rowindex]['Cell'];
            if(cell_row_object[0]['Data'] ==undefined)
            {
                break;
            }
        console.log("rowline： "+rowindex1 ++);
        var value_cell_source =  cell_row_object[0]['Data'][0]['_'];
      //  var value_cell_source = JSON.stringify(cell_row_object[0]['Data'][0]['_']);
         //   value_cell_source=value_cell_source.replace(/\"/g,"'");

        var strArr = /(.*[^\d])(\d+)$/.exec(value_cell_source);

        if(strArr==null && value_cell_source!='角色'  && value_cell_source!='子过程' && value_cell_source!='内容包名称' && value_cell_source!='支持文件'&& value_cell_source!='表单模板'&& value_cell_source!='过程文件' ) //角色 需要改
            continue;
        // strArr[0]是原字符串。
        // strArr[1]是数字前面的字符串。
        // strArr[2]是数字
        value_cell = value_cell_source;
        if(strArr!=null)
        {
            var value_cell =strArr[1];
            var elementIndex =strArr[2];
            if(elementIndex<10)
            {
                elementIndex = "0"+elementIndex;
            }
        }

            switch (value_cell) {
                case '子过程': //1
                    //1 读取子过程名称 2调用内容包创建
                    var name =getValue(cell_row_object,2);
                    //var subpackage_value2 =cell_row_object[5]['Data'][0]['_'];
                    //console.log("新子过程："+subpackage_value1 +"+"+subpackage_value1);
                    console.log("新子过程");
                    var newName =name;
                    if(elementIndex!=undefined)
                        newName =elementIndex+name;

                    add_contentPackage(newName,name);
                    break;
                case '内容包名称': //1
                    //1 读取子过程名称 2调用内容包创建
                    var name =getValue(cell_row_object,2);
                    //var subpackage_value2 =cell_row_object[5]['Data'][0]['_'];
                    //console.log("新子过程："+subpackage_value1 +"+"+subpackage_value1);
                    console.log("新子过程");
                    var newName =name;
                    if(elementIndex!=undefined)
                        newName =elementIndex+name;

                    add_contentPackage(newName,name);
                    break;
                case '工件'://2  基本不用了
                    //最新版本 关系数据模板
                    var artifct_name = cell_row_object[3]['Data'][0]['_'].trim();
                    var artifct_desc = cell_row_object[5]['Data'][0]['_'].trim();
                    var  data_Template_namestring = cell_row_object[8]['Data'][0]['_'].trim();
       //            cell_row_object[8]['Data'] == "无" ? data_Template_list=[] : data_Template_list= data_Template_namestring.split('，');//全角逗号

                    var data_Template_list = []; //数据模板
                    data_Template_namestring == "无" ? data_Template_list=[] : data_Template_list= data_Template_namestring.split('，');//全角逗号
                    var data_TemplateIDString="";
                    for(var i=0;i<data_Template_list.length;i++){
                        var data_Templatename  = data_Template_list[i];
                        var id =helper.getID_addID(data_Templatename)
                        data_TemplateIDString += id +" "
                    }
                    console.log("工作产品中的工件："+artifct_name);
                    add_Artifct(artifct_name,artifct_desc,data_TemplateIDString);
                    //第二版本，直接给工件数组
                    // var artifct_value1 = cell_row_object[5]['Data'][0]['_'].trim();
                    // // 需要输入 和输出。
                    // var input = artifct_value1.split('，'); //全角逗号
                    // console.log("工作产品中的工件："+input);
                    // push_ArtifctList(input);

                    //第一版输入输出解决方案。
                    // var artifct_value1 = cell_row_object[6]['Data'][0]['_'].trim();
                    // var artifct_value2 = cell_row_object[7]['Data'][0]['_'].trim();
                    // // var artifct_value3 = cell_row_object[5]['Data'][0]['_'].trim();
                    //
                    // var input = artifct_value1.split('，'); //全角逗号
                    // var output = artifct_value2.split('，'); //全角逗号
                    // console.log("工作产品中的工件："+input +typeof (input) +typeof ([]));
                    //
                    // //后期可以给他们做input和output 分类
                    // push_Artifct(input);
                    // push_Artifct(output);

                    break;

                case '任务'://4
                    console.log("第四 创建任务、步骤、和任务配置文件 ");


                    var taskname = elementIndex + getValue(cell_row_object,2); //name 2
                    var pname = pname;//cell_row_object[4]['Data'][0]['_'].trim(); //pname
                    // if(taskname != '')
                    //     index +=1 ;
                    var desc = getValue(cell_row_object,3); // desc 3
                    // if(desc != '')
                    //     index +=1 ;
                    // var index = 2;

                    var inputListString = getValue(cell_row_object,4); //input4
                    // if(inputListString != '')
                    //     index +=1 ;

                    var outputListString = getValue(cell_row_object,5); // output 5
                    // if(roleListString != '')
                    //     index +=1 ;
                    var roleListString =getValue(cell_row_object,6); // role PerformedBy 6
                    // if(roleListString != '')
                    //     index +=1 ;
                    // var stepcount = cell_row_object[9]['Data'][0]['_'].trim(); // stepcount
                    var addPerformedByListString =getValue(cell_row_object,7); // additionallyPerformedBy  7
                    // if(addPerformedByListString != '')
                    //     index +=1 ;
                    var supporting_material_liststring = getValue(cell_row_object,8); // supporting_material 8
                    // if(supporting_material_liststring != '')
                    //     index +=1 ;
                    var data_Template_liststring = getValue(cell_row_object,9); // data_Template 9

                    //  var supportcount = cell_row_object[10]['Data'][0]['_'].trim(); // supportcount

                    //supportingMaterials="_pq2agGCJEeaEyIwhtUH2yw" guidelines="_qXfeEGCJEeaEyIwhtUH2yw"

                    // console.log("产品的stepcount："+stepcount.trim());
                    // console.log("产品的supportcount："+supportcount.trim());

                    console.log("产品的role："+roleListString.trim());

                    var inputList = []; // 输入
                    inputListString == "" ? inputList=[] : inputList= inputListString.split('、');//全角顿号
                    var outputList = []; //输出
                    outputListString == "" ? outputList=[] : outputList= outputListString.split('、');//全角顿号
                    var roleLsit = []; //角色
                    roleListString == "" ? roleLsit=[] : roleLsit= roleListString.split('、');//全角顿号
                    var addPerformedByList = []; //次要执行人
                    addPerformedByListString == "" ? addPerformedByList=[] : addPerformedByList= addPerformedByListString.split('、');//全角顿号
                    var supporting_material_list = []; //支持材料
                    supporting_material_liststring == "" ? supporting_material_list=[] : supporting_material_list= supporting_material_liststring.split('、');//全角顿号
                  //  var data_Template_list = []; //表单模板  在遍历工件的时候 已经做了处理
                   // data_Template_liststring == "" ? data_Template_list=[] : data_Template_list= data_Template_liststring.split('、');//全角顿号


                    var supporting_material_IDString="";
                    for(var i=0;i<supporting_material_list.length;i++){
                        var supporting_material  = supporting_material_list[i];
                        supporting_material = supporting_material.replace("《", "");
                        supporting_material =  supporting_material.replace("》", "");
                        var id =helper.getID(supporting_material)
                        supporting_material_IDString += id +" "
                    }
                    // 主要执行人
                    var roles_IDs="";
                    for(var i=0;i<roleLsit.length;i++) {
                        var rolename = roleLsit[i];
                        var id =  add_role_with_workproduct(rolename,rolename,'')
                        // var id=  role_ID_Name_Dic[rolename];
                        roles_IDs += id +" "
                    }
                    // 次要执行人

                    var addPerformedByListString="";
                    for(var i=0;i<addPerformedByList.length;i++){
                        var addPerformedBy  = addPerformedByList[i];
                        var id  =  add_role_with_workproduct(addPerformedBy,addPerformedBy,'')
                        addPerformedByListString += id +" "
                    }



                    var mandatoryInput_IDs="";
                    for(var i=0;i<inputList.length;i++){
                        var mandatoryInputname  = inputList[i];
                        var id=  Artifct_ID_Name_List[mandatoryInputname];
                        if(id ==undefined)
                        {
                            // 工件与表单模板建立关系
                             var data_Template_list_input_IDString="";
                            var  mandatoryInputnameTemp = mandatoryInputname.replace("《", "");
                            mandatoryInputnameTemp =  mandatoryInputnameTemp.replace("》", "");
                            if(data_Template_liststring.indexOf(mandatoryInputnameTemp)!= -1)
                            {
                                var id =helper.getID(mandatoryInputnameTemp)
                                data_Template_list_input_IDString += id +" ";
                            }

                            // ADD工件 表单模板关系
                            add_Artifct(mandatoryInputname,mandatoryInputname,data_Template_list_input_IDString);
                            id =helper.getID_addID(mandatoryInputname);
                            Artifct_ID_Name_List[mandatoryInputname] = id;
                        }
                        mandatoryInput_IDs += id +" "
                    }
                    var outputString_IDs="";
                    for(var i=0;i<outputList.length;i++){
                        var outputStringname  = outputList[i];
                        var id=  Artifct_ID_Name_List[outputStringname];
                        if(id ==undefined)
                        {
                            // 工件与表单模板建立关系

                            var data_Template_list_output_IDString="";
                            var  outputStringnameTemp = outputStringname.replace("《", "");
                            outputStringnameTemp =  outputStringnameTemp.replace("》", "");
                            if(data_Template_liststring.indexOf(outputStringnameTemp)!= -1)
                            {
                                var id =helper.getID(outputStringnameTemp)
                                data_Template_list_output_IDString += id +" ";
                            }
                            // ADD工件 表单模板关系
                            add_Artifct(outputStringname,outputStringname,data_Template_list_output_IDString);
                            id =helper.getID_addID(outputStringname);
                            Artifct_ID_Name_List[outputStringname] = id;
                        }
                        outputString_IDs += id +" "
                    }
                    console.log("产品的input："+mandatoryInput_IDs.trim());
                    console.log("产品的output："+outputString_IDs.trim());

                    // "mandatoryInput": "_2c83c64b25701327bb1621",
                    // "output": "_2c83c64b25701327bb1621"

                   // var commonID =helper.createID22bit();
                    var commonID =helper.getID_addID(taskname); //name + id 在cogfig中
                    //去重机制
                    var newtaskname= taskname;
                    // var indexforrepeat =0;
                    // if (task_name_dic[newtaskname] == undefined)
                    // task_name_dic[newtaskname] =newtaskname;
                    //
                    // while(task_name_dic[newtaskname] != undefined)
                    // {
                    //     newtaskname = newtaskname + "("+indexforrepeat+")";
                    //     task_name_dic[newtaskname] =newtaskname;
                    //     indexforrepeat++;
                    // }

                    //第一步
                    var taskid=  add_task(commonID,newtaskname, pname, desc,mandatoryInput_IDs.trim(),outputString_IDs.trim(),roles_IDs.trim(),addPerformedByListString.trim(),supporting_material_IDString.trim());
                    //第二步 资源描述
                    add_resourceDescriptors_in_plugin(commonID,newtaskname,'tasks');
                    //第三步 任务步骤
                    var rowindexforStep = ++rowindex;
                    var steplist  =add_task_step(rowlist_josnobj,rowindexforStep);
                    // 下面是步骤读取，调用task创建的时候 ，在写入 ，（遍历row的每一行 判断属性）
                    create_task_config.add_task_config(taskid,commonID,taskname,desc,steplist);
                    //console.log("产品的stepcount："+stepcount.trim()); //add_task_step的方法  应该是当前所以rowindex+1 然后for stepcount

                    // 第四步 支持文件 先在plugin 增加ele 然后增加rd  增加config

                    //console.log("产品的supportcount："+supportcount.trim());//add_task_support的方法  应该是当前所以rowindex+stepcount+1 然后for循环 产品的supportcount
                    break;
                case rolecase ://3
                    var name =getValue(cell_row_object,1); //cell_row_object[1]['Data'][0]['_'];
                    var desc =getValue(cell_row_object,2); //=cell_row_object[2]['Data'][0]['_'];
                    var skill =getValue(cell_row_object,3); //cell_row_object[3]['Data'][0]['_'];
                    var department =getValue(cell_row_object,5); //cell_row_object[5]['Data'][0]['_'];
                    // 两个问题，原始文件不覆盖，多次执行会插入两次ID


                    var commonID =helper.getID_withType('role_link',name); //name + id 在附件文件中
                    var roleid =  add_role(commonID,name,name,desc,'');
                    add_department(department,roleid);

                    //第一步
                    if(role_desc_dic[name] == undefined)
                    {
                        role_desc_dic[name]  = desc;
                        role_skill_dic[name] =skill;
                        //第二步 资源描述
                        //   if(!helper.isID_exsit('role',name)) 暂不修复多次执行的bug,初次导入可能会有问你

                        if (!helper.isID_exsit('role', name))
                            add_resourceDescriptors_in_plugin(commonID,name,'roles'); //roles/总体部.xmi
                        //第三步不在里面 是因为需要更新
                    }else
                    {
                        if(role_desc_dic[name]!=desc)
                            role_desc_dic[name] +=  '<br\>' +desc;
                        if(role_skill_dic[name]!=skill)
                            role_skill_dic[name] +=  '<br\>' +skill;
                    }

                    var  config_role_desc = role_desc_dic[name];
                    var  config_role_skill = role_skill_dic[name];

                    // 第三步 重复执行 能够修改内容？
                    create_role_config.add_role_config(roleid,commonID,name,config_role_desc,config_role_skill);
                    console.log('角色创建成功：'+name);
                    // 可以调用添加部门及 部门归属的逻辑


                    break;

                case '支持文件'://5
                    var name = getValue(cell_row_object,2);
                    var desc = getValue(cell_row_object,1);

                    var commonID =helper.createID22bit();
                    //第一步
                    var supportid=  add_plug_support(commonID,name, desc+":"+name);
                    //第二步 资源描述
                    add_resourceDescriptors_plugin(commonID,'guidances/supportingmaterials',name);
                    //第三步 支持文件
                    config_supporting_material.add_support_config(supportid,commonID,name,desc);

                //    console.log("支持文件："+input +typeof (input) +typeof ([]));
                    break;
                case '过程文件'://5
                    var name = getValue(cell_row_object,2);
                    var desc = getValue(cell_row_object,1);

                    var commonID =helper.createID22bit();
                    //第一步
                    var supportid=  add_plug_support(commonID,name, desc+":"+name);
                    //第二步 资源描述
                    add_resourceDescriptors_plugin(commonID,'guidances/supportingmaterials',name);
                    //第三步 支持文件
                    config_supporting_material.add_support_config(supportid,commonID,name,desc);

                    //    console.log("支持文件："+input +typeof (input) +typeof ([]));
                    break;
                case '表单模板'://6
                    var name = getValue(cell_row_object,2);
                    var desc = getValue(cell_row_object,1);
                   // var atd = cell_row_object[4]['Data'][0]['_'].trim();

                    var commonID =helper.createID22bit();

                    var templateid=  add_template_support(commonID,name, desc+":"+name);
                    add_resourceDescriptors_plugin(commonID,'guidances/templates',name);

                    //plugin_Template
                    config_new_template.add_temple_config(templateid,commonID,name,"");


                    break;

                default:
            }
          //  xlsJsonArray.push(value_cell.trim())
        value_cell ="";
        }

};
function add_contentPackage(name,presentationName)
{
    var package_plugin_temp1  =   JSON.parse(JSON.stringify(newcontentPackage));
    var newID22 =helper.createID22bit();
    package_plugin_temp1['$']['xmi:id'] =newID22;
    package_plugin_temp1['$']['guid'] =  newID22;
    package_plugin_temp1['$']['name'] =name;
    package_plugin_temp1['$']['presentationName'] =  presentationName;
    console.log(" 子内容包方法执行");
    console.log("子内容包方法执行:"+JSON.stringify(package_plugin_temp1));
    package_plugin_list[newID22]=package_plugin_temp1; //内容包 增加
    package_plugin_Array.push(package_plugin_temp1);
    for (var item in package_plugin_Array)
    {
        console.log("内容包："+JSON.stringify(package_plugin_Array[item]))

    }
    subpackagecount++;
   // package_plugin_temp = JSON.parse(JSON.stringify(newcontentPackage)) ;
}


//模板模板
function add_template_support(comID,name,desc)
{
    console.log("增加模板模板在plugin");
    var  newIns =   JSON.parse(JSON.stringify(plugin_Template));
    //词典保存ID
    var newID= helper.getID_addID(name);

    newIns['$']['xmi:id'] =newID;
    newIns['$']['guid'] =  newID;
    newIns['$']['name'] =name;
    newIns['$']['presentationName'] =  name;
    newIns['$']['briefDescription'] =  desc;
    newIns['presentation'][0]['$'] ['xmi:id'] =  comID//公共id;
    newIns['presentation'][0]['$'] ['href'] =  'uma://'+comID +'#'+comID;
    var currentPackage;
    for (var item in package_plugin_Array)
    {
        if(package_plugin_Array[item]['$']['name']=='数据模板')
        {
            currentPackage=package_plugin_Array[item];
        }
    }

    currentPackage['contentElements'].push(newIns);
    return newID;
}

// 支持文件
function add_plug_support(comID,name,desc)
{
    console.log("增加支持文件在plugin");
    var  newIns =   JSON.parse(JSON.stringify(plugin_SupportingMaterial));
    var newID= helper.getID_addID(name);
    newIns['$']['xmi:id'] =newID;
    newIns['$']['guid'] =  newID;
    newIns['$']['name'] =name;
    newIns['$']['presentationName'] =  name;
    newIns['$']['briefDescription'] =  desc;

    newIns['presentation'][0]['$'] ['xmi:id'] =  comID//公共id;
    newIns['presentation'][0]['$'] ['href'] =  'uma://'+comID +'#'+comID;
    console.log("子内容包方法执行 count:"+subpackagecount);
    var currentPackage;
    for (var item in package_plugin_Array)
    {
        if(package_plugin_Array[item]['$']['name']=='支持文件')
        {
            currentPackage=package_plugin_Array[item];
        }
    }

    currentPackage['contentElements'].push(newIns);
    //    package_plugin_Array[subpackagecount]['contentElements'].push(newIns);

    return newID;
}

//没用？
function add_task_support(rowlist_josnobj,rowindexforStep) {

    var  supportlist =[];
    var cell_row_object = rowlist_josnobj[rowindexforStep]['Cell'];
    var value_cell = JSON.stringify(cell_row_object[0]['Data'][0]['_']);
    while (value_cell=='步骤')
    {
        if(rowindexforStep==rowlist_josnobj.length)
        {
            break;
        }
        cell_row_object = rowlist_josnobj[rowindexforStep]['Cell'];
        value_cell = JSON.stringify(cell_row_object[0]['Data'][0]['_']);

        if(value_cell!='步骤')
        {
            break;
        }

        var step_value1 = cell_row_object[3]['Data'][0]['_'].trim();
        var step_value2 = cell_row_object[5]['Data'][0]['_'].trim();
        steplist.push(step_value1+','+step_value2);
        //console.log('步骤：'+step_value1+','+step_value2);
        ++rowindexforStep;

    }
    return steplist;
}
//增加通用的资源描述符
//
function add_resourceDescriptors_plugin(ComID,typyename,Name)
{
    console.log('update资源描述文件：' + Name);
    var  rdJson =   JSON.parse(JSON.stringify(resourceDescriptors_in_plugin));
    var rdID =helper.createID22bit();

    // "xmi:id": "_Sa9BISfNEeaAUs4sqIcCRg",
    // "id": "-siD5jizEm8MrSzn8JlQ_aQ",
    // "uri": "tasks/接收业务需求.xmi"

    rdJson['$']['xmi:id'] =  rdID;
    rdJson['$']['id'] =  ComID;
    rdJson['$']['uri'] = typyename+ '/'+Name+'.xmi'; //tasks/
    resourceDescriptors.push(rdJson);
}

//任务描述符
function add_resourceDescriptors_in_plugin(ID_RD_Task_TaskFile,Name,Path)
{
    console.log('update资源描述文件：' + Name);
    var  rdJson =   JSON.parse(JSON.stringify(resourceDescriptors_in_plugin));
    var rdID =helper.createID22bit();

    // "xmi:id": "_Sa9BISfNEeaAUs4sqIcCRg",
    // "id": "-siD5jizEm8MrSzn8JlQ_aQ",
    // "uri": "tasks/接收业务需求.xmi"

    rdJson['$']['xmi:id'] =  rdID;
    rdJson['$']['id'] =  ID_RD_Task_TaskFile;
    rdJson['$']['uri'] = Path+ '/'+Name+'.xmi';
    resourceDescriptors.push(rdJson);
}
function add_task_step(rowlist_josnobj,rowindexforStep) {

    var  steplist =[];
    if(rowlist_josnobj[rowindexforStep] ==undefined)
    {
        return;
    }
    var cell_row_object = rowlist_josnobj[rowindexforStep]['Cell'];
    if(cell_row_object[0]['Data'] ==undefined)
    {
        return;
    }
    var value_cell = JSON.stringify(cell_row_object[0]['Data'][0]['_']);
    var ishave  =  value_cell.indexOf('步骤')!=-1;
    while (ishave)
    {
        if(rowindexforStep==rowlist_josnobj.length)
        {
            break;
        }
        cell_row_object = rowlist_josnobj[rowindexforStep]['Cell'];
        //退出条件 不能没有。
        if(cell_row_object[0]['Data'] ==undefined)
        {break; }

        value_cell = JSON.stringify(cell_row_object[0]['Data'][0]['_']);
        var ishave  =  value_cell.indexOf('步骤')!=-1;
        if(!ishave)
        {
            break;
        }

        var step_value1 = getValue(cell_row_object,2);
        var step_value2 = getValue(cell_row_object,3);

        steplist.push(step_value1+','+step_value2);

        // steplist.push('\\<p\\>'+step_value1+':\<\/p\>,'+step_value2);

        //console.log('步骤：'+step_value1+','+step_value2);
        ++rowindexforStep;

    }
    return steplist;
}


var Artifct_ID_Name_List=new Array();
//工作产品 的工件
function push_ArtifctList(ArtifctList)
{
    //console.log("工作产品中的工件 build："+ArtifctList.length);

    for(var i=0;i<ArtifctList.length;i++){
        var name  = ArtifctList[i];
        //工件
        var  newIns =   JSON.parse(JSON.stringify(Artifct_plugin));
        var newID22 =helper.getID_addID(name);
        //需要在全局记下来ID
        newIns['$']['xmi:id'] =newID22;
        newIns['$']['guid'] =  newID22;
        newIns['$']['name'] =name;
        newIns['$']['presentationName'] =  name;
       // newIns['$']['briefDescription'] =  briefDescription;

        package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
       // Artifct_ID_Name_List.push(newID22+","+name)
        Artifct_ID_Name_List[name] = newID22;
        console.log("新增工作产品中的工件："+name+" 关系集合："+newID22+","+name);
    }
}
function add_Artifct(name,briefDescription,data_template)
{

        //工件
        var  newIns =   JSON.parse(JSON.stringify(Artifct_plugin));
        var newID22 =helper.getID_addID(name);
        //需要在全局记下来ID
        newIns['$']['xmi:id'] =newID22;
        newIns['$']['guid'] =  newID22;
        newIns['$']['name'] =name;
        newIns['$']['presentationName'] =  name;
        newIns['$']['briefDescription'] =  briefDescription;
         if(data_template!="")
        newIns['$']['templates'] =  data_template;


        package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
        Artifct_ID_Name_List[name] = newID22;
        console.log("新增工作产品中的工件："+name+" 关系集合："+newID22+","+name);
}


//this.add_task =
//新增任务
function add_task(comID, name, pname, desc,mandatoryInput,outputString,performedByString,addPerformedByListString,supporting_material_IDString)
{
    console.log("4-2 下面是增加新任务");
    var  newIns =   JSON.parse(JSON.stringify(plugin_task));
    //  var newID= helper.getID_addID(name);
    var newID =helper.createID22bit(); //ID2

    newIns['$']['xmi:id'] =newID;
    newIns['$']['guid'] =  newID;
    newIns['$']['name'] =name;
    newIns['$']['presentationName'] =  name;
    newIns['$']['mandatoryInput'] =  mandatoryInput;
    newIns['$']['output'] =  outputString;
    newIns['$']['performedBy'] =  performedByString;
    newIns['$']['additionallyPerformedBy'] =  addPerformedByListString;
    newIns['$']['supportingMaterials'] =  supporting_material_IDString;
    // supportingMaterials="_51db7d6906179649ccb2c7"
    // var P_ID22 =helper.createID22bit(); //ID2
    newIns['presentation'][0]['$'] ['xmi:id'] =  comID//"测试角色11";
    newIns['presentation'][0]['$'] ['href'] =  'uma://'+comID +'#'+comID;
    package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
    return newID;
}
var role_ID_Name_Dic=new Array();
//自动添加角色和产品关系
var rolelist = Array()
function add_role_with_workproduct(name,pname,responsibleFor)
{
    console.log("负责push_role:",responsibleFor);

    var  newIns =   JSON.parse(JSON.stringify(role_plugin));

    if (helper.isID_exsit('role', name))
    {
        return  helper.getID_withType('role', name);
    }
    var  newID = helper.getID_withType('role', name)
    if(role_ID_Name_Dic[name] ==undefined)
    {
        role_ID_Name_Dic[name]=newID;
    }else
    {
        return role_ID_Name_Dic[name]
    }

    //configIDList.push(newID22);
    newIns['$']['xmi:id'] =newID;
    newIns['$']['guid'] =  newID;
    newIns['$']['name'] =name+'（系统识别）';
    newIns['$']['presentationName'] =  pname;
    //newIns['$']['responsibleFor'] =  responsibleFor;
    package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
    role_ID_Name_Dic[name] = newID;
    return newID;
}
//单纯角色
function add_role(comID,name,pname,desc,responsibleFor)
{
    var  newIns =   JSON.parse(JSON.stringify(role_plugin_p));
    var newID= helper.getID_withType('role',name);
    if(package_plugin_Array.length >0 )
    var rolelsit = package_plugin_Array[subpackagecount]['contentElements']
    //增加叠加的描述，可以用于为角色添加产品。但是要保证 package_plugin_Array 读出最新的数据
    for (roleindex in rolelsit)
    {
        console.log('角色名称：'+ rolelsit[roleindex]['$']['name']);
        if( rolelsit[roleindex]['$']['name'] ==name)
        {
           // 段描述，没必要添加
           // var newdesc=   rolelsit[roleindex]['$']['briefDescription']+';'+desc;
           // rolelsit[roleindex]['$']['briefDescription'] =newdesc;
            return newID;
        }
    }

    newIns['$']['xmi:id'] =newID;
    newIns['$']['guid'] =  newID;
    newIns['$']['name'] =name;
    newIns['$']['presentationName'] =  pname;
    newIns['$']['briefDescription'] =  desc;
    newIns['$']['responsibleFor'] =  responsibleFor;
    newIns['presentation'][0]['$'] ['xmi:id'] =  comID//"测试角色11";
    newIns['presentation'][0]['$'] ['href'] =  'uma://'+comID +'#'+comID;

    package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
    role_ID_Name_Dic[name] = newID;
    return newID;

}

var role_department_Dic= Array()
function add_department(name,roleid)
{
    // 每一个id 和部门进来
    // 先确定是否有部门 ，没有创建，有的话把示例取出来
    //对示例 取值 拿出来ID，包含ID不做操作，不包含ID， +=拼接。
    if(role_department_Dic[name]!=undefined)
    {
        var roidString =  role_department_Dic[name]['$']['roles'];
        if(roidString.indexOf(roleid) == -1)
        {
            roidString += " "+ roleid
            role_department_Dic[name]['$']['roles']=roidString;
        }
        return role_department_Dic[name];
    }
    var jsonItem =  {
        "$": {
            "xsi:type": "org.eclipse.epf.uma:RoleSet",
            "xmi:id": "_M15koJtyEeakE6yoFY7Z8g",
            "name": "部门1",
            "guid": "_M15koJtyEeakE6yoFY7Z8g",
            "presentationName": "部门1",
            "roles": ""
        },
        "methodElementProperty": [
            {
                "$": {
                    "xmi:id": "_NsRL8JtyEeakE6yoFY7Z8g",
                    "name": "me_edited",
                    "value": "true"
                }
            }
        ]
    }
    var  newIns =   JSON.parse(JSON.stringify(jsonItem));
    var newID= helper.getID_withType('role',name);

    newIns['$']['xmi:id'] =newID;
    newIns['$']['guid'] =  newID;
    newIns['$']['name'] =name;
    newIns['$']['presentationName'] =  name;
    //newIns['$']['briefDescription'] =  desc;
    newIns['$']['roles'] =  roleid;
  //  newIns['methodElementProperty'][0]['$'] ['xmi:id'] =  comID//"测试角色11";
   // newIns['methodElementProperty'][0]['$'] ['href'] =  'uma://'+comID +'#'+comID;
//
  //  package_plugin_Array[subpackagecount]['contentElements'].push(newIns);
    role_department_Dic[name] = newIns;
    RoleSets.push(newIns);
    return newIns;
}