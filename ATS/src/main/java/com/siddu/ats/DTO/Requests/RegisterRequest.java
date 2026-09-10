package com.siddu.ats.DTO.Requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 50,message = "please provide your name")
        String username,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(min = 10, max = 100, message = "Password must be at least 10 characters long")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).+$",
                message = "Password must contain uppercase, lowercase, number, and special character"
        )
        String password
) { }