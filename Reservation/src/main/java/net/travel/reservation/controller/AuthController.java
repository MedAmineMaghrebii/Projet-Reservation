package net.travel.reservation.controller;




import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import net.travel.reservation.dto.*;

import net.travel.reservation.services.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthService authService;



    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ){

        return ResponseEntity.ok(
                authService.register(request)
        );

    }





    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        try {

            return ResponseEntity.ok(
                    authService.login(request)
            );

        } catch (BadCredentialsException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message", "Invalid email or password"
                            )
                    );
        }
    }





    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ){

        return ResponseEntity.ok(
                authService.refreshToken(request)
        );

    }

}
