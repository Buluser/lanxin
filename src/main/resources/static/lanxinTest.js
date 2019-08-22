var APP_TOKEN;
var USER_TOKEN;
var JS_API_TOKEN;
var CODE;
var BASE_URL = 'http://129.211.30.157/lanxin_base';//'https://apigw-cloud.lx.360.net';
var OAUTH_URL = 'http://129.211.30.157/lanxin_oauth';//'https://passport-cloud.lx.360.net';
var APP_ID = '12714496-1048576';
var APP_SECRET = '2284159D7689B04C24D2C0BAB099B342';
var SIGN;
var LATITUDE;
var LONGTITUDE;

$(function () {
    var timestampNow = Date.parse(new Date());
    var randomString = getRandomString();
    CODE = GetQueryString('code');
    if(CODE == null || CODE == undefined)   {
        window.location.href="https://passport-cloud.lx.360.net/oauth2/authorize?appid=12714496-1048576&response_type=code&scope=basic_userinfo&state=STATE&redirect_uri=http://129.211.30.157:8080/lanxinService/oauth/callback";
        return;
    }
    getAppToken();
    getUserToken();
    getJsApiToken();
    getSha1String(randomString,timestampNow);

    lx.config({
        debug: true, // 开启调试模式
        appId: '12714496-1048576', // 必填，应用的唯一标识
        timestamp: timestampNow, // 必填，生成签名的时间戳
        nonceStr: randomString, // 必填，生成签名的随机串
        signature: SIGN// 必填，签名
    });

    useLanxinInterface();

})



lx.ready(function(){
    // 调用jsapi
    alert('加载config成功')
});

lx.error(function(result){
    alert(result);
});

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function getAppToken()  {
    $.ajax({
        url: BASE_URL + "/v1/apptoken/create",
        type: "GET",
        dataType: "json",
        data: {
            'grant_type':'client_credential',
            'appid':APP_ID,
            'secret':APP_SECRET

        },
        async: false,
        success: function(data) {
            if(data.errCode == '0')    {
                APP_TOKEN =data.data.app_token;
            }
        }
    });
}

function getUserToken() {
    $.ajax({
        url: BASE_URL + "/v1/usertoken/create",
        type: "GET",
        dataType: "json",
        data: {
            'app_token':APP_TOKEN,
            'grant_type':'authorization_code',
            'code':CODE,
            'secret':'2284159D7689B04C24D2C0BAB099B342'

        },
        async: false,
        success: function(data) {
            if(data.errCode == '0')    {
                USER_TOKEN =data.data.user_token;
            }
        }
    });
}

function getJsApiToken() {
    $.ajax({
        url: BASE_URL + "/v1/jsapitoken/create",
        type: "GET",
        dataType: "json",
        data: {
            'app_token':APP_TOKEN,
            'user_token':USER_TOKEN

        },
        async: false,
        success: function(data) {
            if(data.errCode == '0')    {
                JS_API_TOKEN =data.data.js_api_token;
            }
        }
    });
}

function getOauthCode() {
    $.ajax({
        url: OAUTH_URL + "/oauth2/authorize",
        type: "POST",
        dataType: "json",
        data: {
            'appid':APP_ID,
            'response_type':'code',
            'scope':'basic_userinfor',
            'state':'abc',
            'redirect_uri': 'http://129.211.30.157:8080/lanxinService/oauth/callback'

        },
        async: false,
        success: function(data) {
            document.write(data);
            /*if(data.errMsg == 'ok')    {
                CODE =data.data.code;
            }*/
        }
    });
}

function getSha1String(random,timestamp) {
    $.ajax({
        url: "http://129.211.30.157:8080/lanxinService/desBySha1",
        type: "POST",
        dataType: "json",
        data: {
            'js_api_token':JS_API_TOKEN,
            'noncestr':random,
            'timestamp':timestamp,
            'url':window.location.href

        },
        async: false,
        success: function(data) {
            if(data.msg==0)    {
                SIGN = data.sha1String;
            }
        }
    });
}

function getRandomString() {
    var len = 16;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function useLanxinInterface()  {

    lx.device.getLocation({
        "coordinateType": "wgs84",
        complete: function (result) {

        },
        tigger: function (result) {
            // TODO
        },
        success: function (result) {
            $('#label1').text(result.address);
            $('#input2').text(result.address);
            LATITUDE = result.latitude;
            LONGTITUDE = result.longitude;
        },
        fail: function (result) {
            // TODO
        }
    })

}

function closeWindow()  {
    lx.ui.closeWindow();
}

function openLocation() {
    lx.device.displayLocation({
        "coordinateType": "wgs84",
        "latitude": LATITUDE,
        "longitude": LONGTITUDE,
        complete: function (result) {

        },
        tigger: function (result) {
            // TODO
        },
        success: function (result) {
            $('#label1').text(result.address);
            $('#input2').text(result.address);
        },
        fail: function (result) {
            // TODO
        }
    })
}

function chooseContacts()   {
    lx.biz.chooseContacts({
        "title": "选择联系人",
        "multiple": true,
        complete: function (result) {

        },
        tigger: function (result) {
            // TODO
        },
        success: function (result) {
            $('#label1').text(result.address);
            $('#input2').text(result.address);
        },
        fail: function (result) {
            // TODO
        }
    })
}