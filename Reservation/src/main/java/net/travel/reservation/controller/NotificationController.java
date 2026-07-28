package net.travel.reservation.controller;
import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Notification;
import net.travel.reservation.entites.User;
import net.travel.reservation.services.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;


    // Récupérer toutes les notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {

        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }


    // Récupérer une notification par ID
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                notificationService.getNotificationById(id)
        );
    }


    // Créer une notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody Notification notification) {

        Notification nouvelleNotification =
                notificationService.createNotification(notification);

        return new ResponseEntity<>(
                nouvelleNotification,
                HttpStatus.CREATED
        );
    }


    // Récupérer les notifications d'un utilisateur
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUserNotifications(userId)
        );
    }


    // Notifications non lues
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId)
        );
    }


    // Nombre de notifications non lues
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countUnread(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.countUnread(userId)
        );
    }


    // Marquer une notification comme lue
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }


    // Supprimer une notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable UUID id) {

        notificationService.deleteNotification(id);

        return ResponseEntity.noContent().build();
    }


    // Supprimer toutes les notifications d'un utilisateur
    @DeleteMapping("/user")
    public ResponseEntity<Void> deleteAllUserNotifications(
            @RequestBody User user) {

        notificationService.deleteAllUserNotifications(user);

        return ResponseEntity.noContent().build();
    }

}
