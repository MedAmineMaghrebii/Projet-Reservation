package net.travel.reservation.repositories;



import net.travel.reservation.entites.RefreshToken;
import net.travel.reservation.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;


public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, UUID> {


    // Chercher un refresh token par sa valeur
    Optional<RefreshToken> findByToken(String token);


    // Chercher le token d'un utilisateur
    Optional<RefreshToken> findByUser(User user);


    // Supprimer les tokens d'un utilisateur
    void deleteByUser(User user);

}
