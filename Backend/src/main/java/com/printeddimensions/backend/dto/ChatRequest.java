package com.printeddimensions.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatRequest {
    @NotBlank
    @Size(max = 500)
    private String message;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
