package com.lanxin.demo.model;

import com.lanxin.demo.util.InterfaceUtil;

import java.security.Timestamp;

public class AppToken {
    String apptoken;
    long expires_in;//有效时间
    long begintime;//创建时间
    private static AppToken  appToken=new AppToken();
    private AppToken()
    {

    }

    public static AppToken getAppToken() {
        return appToken;
    }

    public String getApptoken() {
        return apptoken;
    }

    public void setApptoken(String apptoken) {
        this.apptoken = apptoken;
    }

    public long getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(long expires_in) {
        this.expires_in = expires_in;
    }

    public long getBegintime() {
        return begintime;
    }

    public void setBegintime(long begintime) {
        this.begintime = begintime;
    }
}
