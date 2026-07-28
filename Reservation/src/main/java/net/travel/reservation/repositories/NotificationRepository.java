package net.travel.reservation.repositories;


import net.travel.reservation.entites.Notification;
import net.travel.reservation.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;


public interface NotificationRepository
        extends JpaRepository<Notification, UUID> {


    // Trouver toutes les notifications d'un utilisateur
    List<Notification> findByUser(User user);


    // Trouver les notifications par userId
    List<Notification> findByUserUserId(Long userId);


    // Notifications non lues d'un utilisateur
    List<Notification> findByUserUserIdAndLueFalse(Long userId);


    // Compter les notifications non lues
    long countByUserUserIdAndLueFalse(Long userId);

}
