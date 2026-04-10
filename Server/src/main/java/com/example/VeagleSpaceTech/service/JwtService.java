package com.example.VeagleSpaceTech.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // 🔥 Use fixed secret (put in application.properties later)
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    // 🔥 Token validity (1 hour)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 *24; // 1 Day

    // ================= GENERATE TOKEN =================

public String generateToken(String email, String role) {

    return Jwts.builder()
            .setSubject(email)   // ✅ THIS IS IMPORTANT (email goes here)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 Day
            .signWith(getSignKey(), SignatureAlgorithm.HS256)
            .compact();
}

    private String createToken(Map<String, Object> claims, String subject) {

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ================= EXTRACT =================

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ================= VALIDATE =================

//    public boolean validateToken(String token, String email) {
//        final String username = extractUsername(token);
//        return (username.equals(email) && !isTokenExpired(token));
//    }
public boolean validateToken(String token, UserDetails userDetails) {

    final String username = extractUsername(token);

    return username.equals(userDetails.getUsername())
            && !isTokenExpired(token);
}

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ================= COMMON =================

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(encodeSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    //  Encode secret (only once)
    private String encodeSecret() {
        return java.util.Base64.getEncoder().encodeToString(SECRET_KEY.getBytes());
    }
}