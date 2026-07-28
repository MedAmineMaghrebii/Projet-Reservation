package net.travel.reservation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @Pattern(
            regexp = "^[0-9]{8}$",
            message = "Phone must contain only numbers (8 digits)"
    )
    private String firstName;

    private String lastName;
    @Pattern(
            regexp = "^[0-9]{8}$",
            message = "Phone must contain only numbers (8 digits)"
    )
    @NotBlank(message = "Phone is required")
    private String phone;
}