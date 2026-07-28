package net.travel.reservation.repositories;
import net.travel.reservation.entites.Client;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;


public interface ClientRepository extends JpaRepository<Client, Long> {


    Optional<Client> findByCin(String cin);


    Optional<Client> findByEmail(String email);

    boolean existsByCin(String cin);

    boolean existsByEmail(String email);

    List<Client> findByVille(String ville);
}
