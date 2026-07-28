package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.RefreshToken;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Créer un nouveau Refresh Token
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {

        // Un seul Refresh Token par utilisateur
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(LocalDateTime.now().plusDays(30))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Vérifier qu'un Refresh Token est valide
     */
    public RefreshToken verifyToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() ->
                        new RuntimeException("Refresh Token not found"));

        if (refreshToken.isRevoked()) {
            throw new RuntimeException("Refresh Token revoked");
        }

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh Token expired");
        }

        return refreshToken;
    }

    /**
     * Révoquer un Refresh Token
     */
    public void revokeToken(String token) {

        RefreshToken refreshToken = verifyToken(token);

        refreshToken.setRevoked(true);

        refreshTokenRepository.save(refreshToken);
    }

    /**
     * Supprimer le Refresh Token d'un utilisateur
     */
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

}

