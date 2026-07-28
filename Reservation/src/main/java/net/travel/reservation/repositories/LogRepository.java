package net.travel.reservation.repositories;



import net.travel.reservation.entites.Log;
import net.travel.reservation.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LogRepository extends JpaRepository<Log, Long> {


    // Trouver les logs par utilisateur
    List<Log> findByUser(User user);


    // Trouver les logs par type d'action
    List<Log> findByAction(String action);


    // Trouver les logs d'une entité précise
    List<Log> findByEntite(String entite);


    // Trouver les logs d'un objet précis
    List<Log> findByEntiteAndEntiteId(String entite, Long entiteId);


}
