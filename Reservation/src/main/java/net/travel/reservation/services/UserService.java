package net.travel.reservation.services;


import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.User;
import net.travel.reservation.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepository userRepository;



    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    public User getUserById(Long id) {

        return (User) userRepository.findByUserId(id)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable"));
    }



    // Récupérer par email
    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Email introuvable"));
    }



    // Créer un utilisateur
    public User createUser(User user) {

        return userRepository.save(user);
    }








    // Supprimer un utilisateur
    public void deleteUser(Long id) {

        User user = getUserById(id);

        userRepository.delete(user);
    }



    // Vérifier existence email
    public boolean existsByEmail(String email) {

        return userRepository.existsByEmail(email);
    }

}