package com.siddu.ats.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.siddu.ats.DTO.Requests.LoginRequest;
import com.siddu.ats.DTO.Requests.RegisterRequest;
import com.siddu.ats.DTO.Response.AuthResult;
import com.siddu.ats.DTO.Response.AuthResponse;
import com.siddu.ats.Services.AuthService;
import com.siddu.ats.Utils.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final CookieUtil cookieUtil;

    public AuthController(AuthService authService, CookieUtil cookieUtil) {
        this.authService = authService;
        this.cookieUtil = cookieUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                 HttpServletResponse response) {
        AuthResult result = authService.register(request);
        cookieUtil.addAccessToken(response, result.accessToken());
        return ResponseEntity.ok(new AuthResponse(result.name(), result.email()));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                              HttpServletResponse response) {
        AuthResult result = authService.login(request);
        cookieUtil.addAccessToken(response, result.accessToken());
        return ResponseEntity.ok(new AuthResponse(result.name(), result.email()));
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        cookieUtil.clearAccessToken(response);
        return ResponseEntity.ok("logout successfully");
    }
}