package net.travel.reservation.repositories;



import net.travel.reservation.entites.Log;
import net.travel.reservation.entites.User;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface LogRepository extends JpaRepository<Log, Long> {


    @Query("SELECT l FROM Log l WHERE l.user.userId = :userId")
    List<Log> findByUserId(@Param("userId") Long userId);

    List<Log> findByAction(String action);

    List<Log> findByEntite(String entite);

    List<Log> findByEntiteAndEntiteId(String entite, Long entiteId);
}
