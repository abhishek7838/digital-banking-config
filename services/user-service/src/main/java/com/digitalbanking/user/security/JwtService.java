package com.digitalbanking.user.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String secretKey;

    @Value("${security.jwt.expiration-ms}")
    private long expirationMs;

    @PostConstruct
    public void debug() {
        System.out.println("USER-SERVICE JWT SECRET length = " + (secretKey == null ? 0 : secretKey.length()));
    }


    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }
    
    
    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);

        // Must match the claim key used in auth-service
        // Common: "role" or "roles" or "authorities"
        String role = claims.get("role", String.class);

        // fallback if token doesn't contain role claim
        return (role == null || role.isBlank()) ? "CUSTOMER" : role;
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
