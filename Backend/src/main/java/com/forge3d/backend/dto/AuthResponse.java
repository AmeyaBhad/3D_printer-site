package com.forge3d.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String email;
    private String displayName;
    private String role;
    private String token; // Prepared for JWT
}
