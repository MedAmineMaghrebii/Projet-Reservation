package net.travel.reservation.services;
import net.travel.reservation.entites.Role;  // ← Explicit import FIRST
import lombok.RequiredArgsConstructor;
import net.travel.reservation.dto.*;
import net.travel.reservation.entites.*;
import net.travel.reservation.repositories.UserRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class AuthService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final RefreshTokenService refreshTokenService;



    public AuthResponse register(RegisterRequest request){


        if(userRepository.existsByEmail(request.getEmail())){

            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .firstname(request.getFirstName()) // <-- AJOUTÉ
                .lastname(request.getLastName())   // <-- AJOUTÉ
                .hashPassword(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();



        userRepository.save(user);



        String accessToken =
                jwtService.generateToken(
                        user.getEmail()
                );


        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);


        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getUserId())
                .email(user.getEmail())
                .role(user.getRole()) // <-- AJOUTER ICI
                .build();

    }




    public AuthResponse login(LoginRequest request){



        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())

        );
        User user =
                userRepository.findByEmail(request.getEmail()).orElseThrow();
        String accessToken =
                jwtService.generateToken(
                        user.getEmail()
                );
        RefreshToken refreshToken =
                refreshTokenService
                        .createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .userId(user.getUserId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();


    }





    public AuthResponse refreshToken(
            RefreshTokenRequest request
    ){


        RefreshToken refreshToken =
                refreshTokenService
                        .verifyToken(
                                request.getRefreshToken()
                        );


        User user =
                refreshToken.getUser();



        String newAccessToken =
                jwtService.generateToken(
                        user.getEmail()
                );



        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(
                        refreshToken.getToken()
                )
                .userId(user.getUserId())
                .email(user.getEmail())
                .build();

    }

}