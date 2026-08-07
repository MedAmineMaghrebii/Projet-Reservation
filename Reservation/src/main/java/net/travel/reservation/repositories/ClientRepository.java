package net.travel.reservation.repositories;
import net.travel.reservation.dto.ClientSummary;
import net.travel.reservation.entites.Client;
import net.travel.reservation.entites.Espace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;


public interface ClientRepository extends JpaRepository<Client, Long> {


    Optional<Client> findByCin(String cin);


    Optional<Client> findByEmail(String email);

    boolean existsByCin(String cin);

    boolean existsByEmail(String email);

    List<Client> findByVille(String ville);

    @Query("""
    SELECT new net.travel.reservation.dto.ClientSummary(
        c.clientId,
        c.cin,
        c.nom,
        c.prenom,
        c.email,
        c.telephone,
        MAX(r.date),
        COUNT(r),
        SUM(p.montant)
    )
    FROM Client c
    LEFT JOIN c.reservations r
    LEFT JOIN r.paiements p
    GROUP BY
        c.clientId,
        c.cin,
        c.nom,
        c.prenom,
        c.email,
        c.telephone
""")
    List<ClientSummary> getClientsSummary();

    @Query("""
    SELECT new net.travel.reservation.dto.ClientSummary(
        c.clientId,
        c.cin,
        c.nom,
        c.prenom,
        c.email,
        c.telephone,
        MAX(r.date),
        COUNT(r),
        SUM(p.montant)
    )
    FROM Client c
    LEFT JOIN c.reservations r
    LEFT JOIN r.paiements p
    WHERE r.espace = :espace
    GROUP BY
        c.clientId,
        c.cin,
        c.nom,
        c.prenom,
        c.email,
        c.telephone
""")
    List<ClientSummary> getClientsSummaryByEspace(@Param("espace") Espace espace);

}
