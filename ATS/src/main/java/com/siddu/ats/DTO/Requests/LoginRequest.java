package com.siddu.ats.DTO.Requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank (message = "email id is required")
        @Email(message = "email must be valid")
        String Email,
        @NotBlank (message = "password is required")
        String password)
{ }