package net.travel.reservation.dto;

import lombok.*;
import net.travel.reservation.entites.Role;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String accessToken;

    private String refreshToken;


    private String tokenType = "Bearer";

    private Long userId;

    private String email;

    private Role role;

}