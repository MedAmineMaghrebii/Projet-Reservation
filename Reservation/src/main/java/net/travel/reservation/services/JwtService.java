package net.travel.reservation.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {


    @Value("${jwt.secret}")

    private String secret;


    @Value("${jwt.expiration}")
    private long expiration;

    // Générer le token
    public String generateToken(
            String email
    ){

        Map<String,Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + expiration)
                )
                .signWith(getSigningKey())
                .compact();
    }



    // Extraire email depuis token
    public String extractUsername(String token){

        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey)getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }



    // Vérifier token
    public boolean isTokenValid(
            String token,
            String username
    ){

        String email = extractUsername(token);

        return email.equals(username)
                && !isTokenExpired(token);
    }



    private boolean isTokenExpired(String token){

        Date expiration =
                Jwts.parser()
                        .verifyWith((javax.crypto.SecretKey)getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getExpiration();

        return expiration.before(new Date());
    }



    private Key getSigningKey(){

        return Keys.hmacShaKeyFor(
                secret.getBytes()
        );
    }
}