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
@Transactional(readOnly = true)
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Créer un nouveau Refresh Token (supprime l'ancien au préalable)
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Supprime l'ancien jeton de l'utilisateur pour éviter les doublons
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
     * Vérifier qu'un Refresh Token est valide et non expiré
     */
    public RefreshToken verifyToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh Token non trouvé"));

        if (refreshToken.isRevoked()) {
            throw new RuntimeException("Refresh Token révoqué");
        }

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh Token expiré");
        }

        return refreshToken;
    }

    /**
     * Révoquer un Refresh Token
     */
    @Transactional
    public void revokeToken(String token) {
        RefreshToken refreshToken = verifyToken(token);
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    /**
     * Supprimer le Refresh Token d'un utilisateur
     */
    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}