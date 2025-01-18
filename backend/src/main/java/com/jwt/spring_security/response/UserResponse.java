package com.jwt.spring_security.response;


import com.jwt.spring_security.model.Users;

public class UserResponse {
    private Users user;
    private String token;

    public UserResponse(Users user, String token) {
        this.user = user;
        this.token = token;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }


}
