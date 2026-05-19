package com.forge3d.backend.dto;



public class AuthResponse {
    private Long id;
    private String email;
    private String displayName;
    private String role;
    private String token; // Prepared for JWT

    public AuthResponse() {
    }

    public AuthResponse(Long id, String email, String displayName, String role, String token) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
