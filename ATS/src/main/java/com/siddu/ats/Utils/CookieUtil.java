package com.siddu.ats.Utils;

import com.siddu.ats.Services.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
    private static final String ACCESS_TOKEN_COOKIE = "ACCESS_TOKEN";
    private final JwtService jwtService;

    public CookieUtil(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public void addAccessToken(HttpServletResponse response, String token) {
        response.addHeader("Set-Cookie", ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(jwtService.getExpirationMillis() / 1000)
                .build()
                .toString());
    }

    public void clearAccessToken(HttpServletResponse response) {
        response.addHeader("Set-Cookie", ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build()
                .toString());
    }
}