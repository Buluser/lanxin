function log(text){
    console.log(text)
}

function onClickSignIn(){
    if(!is_js_api_inited){
        BootstrapDialog.alert("JS-SDK还未初始化。");
        return
    }

    var location = lx.device.getLocation({
        success: function (res) {
            log(res)
            let {latitude, longitude, address} = res;
            latitude = parseFloat(latitude);
            longitude = parseFloat(longitude);
            postSignIn(latitude,longitude,address);
        },
        fail: function (res) {
            log(res);
            BootstrapDialog.alert("JS-SDK获取地址失败。");
        }
    });
}

function postSignIn(latitude, longitude, address){
    try{
        var data = {"longitude":longitude,"latitude":latitude,"coordinate":1,"address":address} 
        $.ajax(
            {
                url:"/api/v1/signin/create",
                async : true ,
                cache : false,
                type : "POST",
                data: JSON.stringify(data),
                dataType : "json",
                success:function(data, textStatus){
                    if(data.code == 0){
                        log(data);
                        ajaxRequestSignInList();
                        BootstrapDialog.show(
                            {
                                title : "签到成功",
                                message : "恭喜你，签到成功！",
                                buttons:[{
                                        label:'我知道啦',
                                        cssClass:"btn-primary",
                                        action: function(dialogItself){
                                            dialogItself.close();
                                        }
                                    }
                                ]
                            }
                        );
                    }else{
                        log("/api/v1/signin code != 0" + data.code);
                        log(data);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    log("http status error for /api/v1/signin");
                    log(textStatus)
    
                }
            }
        );
    }catch(error){
        log("打卡失败：");
        log(error);
        BootstrapDialog.alert("打卡失败：" + error);
    }
}

function refreshSignInTable(data){
    var html = "<thead><tr><th>时间</th><th>签到地点</th></tr></thead><tbody>";
    for (index in data){
        var item = data[index];
        var temp = "<tr>";
        temp += "<td>";
        temp += item.create_time;
        temp += "</td>";
        temp += "<td>";
        temp += item.address;
        temp += "</td>";
        temp += "</tr>";
        html += temp;
    }
    html += "</tbody>";
    
    $("#signin_list").html(html);
}

function ajaxRequestSignInList(){
    $.ajax(
        {
            url:"/api/v1/signin/query/today",
            async : true ,
            cache : false,
            type : "GET",
            dataType : "json",
            success:function(data, textStatus){
                if(data.code == 0){
                    log(data);
                    refreshSignInTable(data.data)
                }else{
                    log("code != 0" + data.code);
                    log(data);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                log("http status error for /api/v1/getuserinfo");
            }
        }
    );
}

function initPage(){

    $.ajax(
        {
            url:"/lanxinService/userinfo",
            async : true ,
            cache : false,
            type : "GET",
            dataType : "json",
            success:function(data, textStatus){
                if(data.code == 0){
                    log(data);
                  //$("#username").text(data.data.name+ " - " + data.data.orgname);
                }else{
                    log("code != 0" + data.code);
                    log(data);

                    $("#username").text("出错了："+data.code);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                log("http status error for /api/v1/getuserinfo");
                $("#username").text("~出错了："+textStatus)
            }
        }
    );

    // ajaxRequestSignInList();
}
var is_js_api_inited = false;
function onJsApiPrepared(){
    is_js_api_inited = true;
    log("JS-SDK Success")
    BootstrapDialog.alert("JS-SDK init Success");
}

function onJsApiFailed(result){
    is_js_api_inited =false ;
    log("JS-SDK Error")
    BootstrapDialog.alert("JS-SDK init Error" + result);
}