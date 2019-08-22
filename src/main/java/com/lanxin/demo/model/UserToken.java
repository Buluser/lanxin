package com.lanxin.demo.model;


public class UserToken {
    private String user_token;
    private long expires_in;//有效时间
    private String scope;//当用户选择的授权SCOPE 和 请求的 SCOPE 不一致的时候，该字段出现。其表示最终用户选择的授权列表。
    private String  state;//和请求授权的参数STATE 一致。
    private long begintime;//开始时间戳
    private static UserToken userToken=new UserToken();

    public static UserToken getUserToken()
    {
        return userToken;
    }

    private UserToken()
    {

    }
    public String getUser_token() {
        return user_token;
    }

    public void setUser_token(String user_token) {
        this.user_token = user_token;
    }

    public long getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(long expires_in) {
        this.expires_in = expires_in;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public long getBegintime() {
        return begintime;
    }

    public void setBegintime(long begintime) {
        this.begintime = begintime;
    }
}
