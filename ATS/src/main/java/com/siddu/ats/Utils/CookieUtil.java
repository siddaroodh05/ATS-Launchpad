package com.siddu.ats.Utils;

import com.siddu.ats.Services.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
public class CookieUtil {
    private static final String ACCESS_TOKEN_COOKIE = "ACCESS_TOKEN";
    private final JwtService jwtService;
    private final boolean secure;
    private final String sameSite;

    public CookieUtil(JwtService jwtService,
                      @Value("${app.cookie.secure}") boolean secure,
                      @Value("${app.cookie.same-site}") String sameSite) {
        this.jwtService = jwtService;
        this.secure = secure;
        this.sameSite = sameSite;
    }

    public void addAccessToken(HttpServletResponse response, String token) {
        response.addHeader("Set-Cookie", ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(jwtService.getExpirationMillis() / 1000)
                .build()
                .toString());
    }

    public void clearAccessToken(HttpServletResponse response) {
        response.addHeader("Set-Cookie", ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build()
                .toString());
    }
}