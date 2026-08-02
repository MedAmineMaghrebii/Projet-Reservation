package net.travel.reservation.config;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Role;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String email = "admin@gmail.com";

        if (!userRepository.existsByEmail(email)) {

            User admin = User.builder()
                    .firstname("Super")
                    .lastname("Admin")
                    .email(email)
                    .hashPassword(passwordEncoder.encode("Admin123"))
                    .role(Role.SUPER_ADMIN)
                    .build();

            userRepository.save(admin);

            System.out.println("SUPER ADMIN CREATED");
        }
    }
}