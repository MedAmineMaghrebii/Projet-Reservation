package net.travel.reservation.repositories;

import net.travel.reservation.entites.Espace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EspaceRepository extends JpaRepository<Espace, Long> {

    // Trouver un espace par son nom exact
    Optional<Espace> findByNom(String nom);

    // Lister tous les espaces situés dans une ville spécifique (ignorant la casse ou non)
    List<Espace> findByVilleIgnoreCase(String ville);

    // Vérifier si un espace existe déjà par son nom
    boolean existsByNom(String nom);
    @Query("SELECT e FROM Espace e LEFT JOIN FETCH e.salles WHERE e IN (SELECT u.espace FROM User u WHERE u.userId = :userId)")
    Optional<Espace> findByUserId(@Param("userId") Long userId);
    // 🔍 Ajouts utiles :

    // Rechercher des espaces dont le nom contient un mot-clé (pratique pour une barre de recherche)
      List<Espace> findByNomContainingIgnoreCase(String keyword);

    // Rechercher des espaces par ville ET dont le nom contient un mot-clé
    List<Espace> findByVilleIgnoreCaseAndNomContainingIgnoreCase(String ville, String keyword);

    // Exemple de requête personnalisée JPQL si tu veux chercher par nom ou par ville en même temps
    @Query("SELECT e FROM Espace e WHERE LOWER(e.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.ville) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Espace> searchByNomOrVille(@Param("keyword") String keyword);
}