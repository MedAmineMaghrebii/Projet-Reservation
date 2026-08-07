package net.travel.reservation.repositories;


import net.travel.reservation.entites.Espace;
import net.travel.reservation.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);


    boolean existsByEmail(String email);

    List<User> findByEspace(Espace espace);

}
