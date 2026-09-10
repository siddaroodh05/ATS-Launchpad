package com.siddu.ats.Services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    private final SecretKey key;
    @Getter
    private final long expirationMillis;

    public JwtService(@Value("${app.auth.jwt-secret}") String secret,
                      @Value("${app.auth.access-token-expiration-ms}") long expirationMillis) {
        this.key = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
        this.expirationMillis = expirationMillis;
    }

    public String createToken(UUID userId, String email) {

        Instant now = Instant.now();
        return Jwts.builder().
                subject(userId.toString()).
                claim("email", email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMillis)))
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser().
                verifyWith(key).
                build().
                parseSignedClaims(token).
                getPayload();
    }

}