package com.lanxin.demo.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.lanxin.demo.model.AppToken;
import com.lanxin.demo.model.UserToken;
import com.lanxin.demo.util.InterfaceUtil;
import org.apache.catalina.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@Controller
@RequestMapping("/lanxinService")
public class callbackController {
    static String path = "oauth2/authorize";
    static String isvdomain = "passport-cloud.lx.360.net";
    static String openapi = "https://apigw-cloud.lx.360.net";
    static String redirect_uri = "http://129.211.30.157:8080/lanxinService/otherSource?to=10.15.0.251:8080/lanxinservice/oauth/callback";
    static String appid = "12714496-1048576";
    static String SecretID = "2284159D7689B04C24D2C0BAB099B342";
    static String allcode = "";
    //    private static final Logger logger = Logger.getLogger(UserController.class);
    static AppToken appToken = AppToken.getAppToken();
    static UserToken userToken = UserToken.getUserToken();

    @RequestMapping("/oauth/callback")

    public void hello(String code, String state, HttpServletRequest request, HttpServletResponse response) {
        Map map = new HashMap();
        allcode = code;
        System.out.println(code);
        System.out.println(state);
        map.put("code", code);
        map.put("state", state);
        //获取apptoken
        getapptoken();
        //获取usertoken
        getusertoken(code);
        try {
            request.getRequestDispatcher("/index.html").forward(request, response);
        } catch (ServletException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/getuserinfo")

    public ModelAndView userinfo() {
        if (System.currentTimeMillis() - appToken.getBegintime() > appToken.getExpires_in()) {
            getapptoken();
        }
        if (System.currentTimeMillis() - userToken.getBegintime() > userToken.getExpires_in()) {
            getusertoken(allcode);
        }
        String url = openapi + "/v1/users/fetch?app_token=" + appToken.getApptoken() + "&user_token=" + userToken.getUser_token();
        String jsonstr = InterfaceUtil.interfaceUtil(url, "");
        System.out.println(jsonstr);
        JSONObject obj = JSON.parseObject(jsonstr);
        Map map=new HashMap();
        map.put("name",obj.getJSONObject("data").getString("name"));
        map.put("orgname",obj.getJSONObject("data").getString("orgname"));
        map.put("phoneNum",obj.getJSONObject("data").getJSONObject("mobilePhone").getString("number"));
        //map.put("departmentname",obj.getJSONObject("data").getJSONObject("department").getString("name"));
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping("/getapptoken")

    public void getapptoken() {
        String url = openapi + "/v1/apptoken/create?grant_type=client_credential&appid=" + appid + "&secret=" + SecretID;
        String jsonstr = InterfaceUtil.interfaceUtil(url, "");
        System.out.println(jsonstr);
        JSONObject obj = JSON.parseObject(jsonstr);

        if (obj.getString("errMsg").equals("OK")) {
            appToken.setApptoken(obj.getJSONObject("data").getString("app_token"));
            appToken.setExpires_in(obj.getJSONObject("data").getLongValue("expires_in"));
            appToken.setBegintime(System.currentTimeMillis());
        }

    }

    @RequestMapping("/getusertoken")

    public void getusertoken(String code) {
        // System.out.println(System.currentTimeMillis()-appToken.getBegintime());
        if (System.currentTimeMillis() - appToken.getBegintime() > appToken.getExpires_in()) {
            getapptoken();
        }
        String url = openapi + "/v1/usertoken/create?app_token=" + appToken.getApptoken() + "&grant_type=authorization_code&code=" + code;
        String jsonstr = InterfaceUtil.interfaceUtil(url, "");
        System.out.println(jsonstr);
        JSONObject obj = JSON.parseObject(jsonstr);
        if (obj.getString("errMsg").equals("OK")) {
            userToken.setUser_token(obj.getJSONObject("data").getString("user_token"));
            userToken.setExpires_in(obj.getJSONObject("data").getLongValue("expires_in"));
            userToken.setScope(obj.getJSONObject("data").getString("scope"));
            userToken.setState(obj.getJSONObject("data").getString("state"));
            userToken.setBegintime(System.currentTimeMillis());
        }
    }

    @RequestMapping("/getoauth")

    public  void oauth(HttpServletResponse response) {

        String url = "https://" + isvdomain + "/" + path + "?appid=12714496-1048576&response_type=code&scope=basic_userinfor&state=" + 200 + "&redirect_uri=" + redirect_uri;
        try {
            System.out.println(url);
            response.sendRedirect(url);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}