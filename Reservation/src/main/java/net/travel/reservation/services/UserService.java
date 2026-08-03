package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.User;
import net.travel.reservation.exceptions.BadRequestException;
import net.travel.reservation.exceptions.ResourceNotFoundException;
import net.travel.reservation.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // --- Récupérer tous les utilisateurs ---
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- Récupérer par ID ---
    public User getUserById(Long id) {
        if (id == null) {
            throw new BadRequestException("L'identifiant de l'utilisateur est obligatoire");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'ID : " + id));
    }

    // --- Récupérer par email ---
    public User getUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("L'email est obligatoire");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'email : " + email));
    }

    // --- Créer un utilisateur ---
    @Transactional
    public User createUser(User user) {
        if (user == null) {
            throw new BadRequestException("Les informations utilisateur sont obligatoires");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new BadRequestException("L'email de l'utilisateur est obligatoire");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Un utilisateur existe déjà avec l'email : " + user.getEmail());
        }

        // Initialiser les collections
        if (user.getPermissions() == null) {
            user.setPermissions(new HashSet<>());
        }

        // Hachage du mot de passe avec BCrypt
        if (user.getHashPassword() != null && !user.getHashPassword().isBlank()) {
            user.setHashPassword(passwordEncoder.encode(user.getHashPassword()));
        }

        return userRepository.save(user);
    }

    // --- Modifier un utilisateur ---
    @Transactional
    public User updateUser(Long id, User userRequest) {
        User existingUser = getUserById(id);

        // Vérification d'unicité en cas de changement d'email
        if (userRequest.getEmail() != null &&
                !userRequest.getEmail().equalsIgnoreCase(existingUser.getEmail()) &&
                userRepository.existsByEmail(userRequest.getEmail())) {
            throw new BadRequestException("Un autre utilisateur utilise déjà l'email : " + userRequest.getEmail());
        }

        if (userRequest.getLastname() != null) existingUser.setLastname(userRequest.getLastname());
        if (userRequest.getFirstname() != null) existingUser.setFirstname(userRequest.getFirstname());
        if (userRequest.getEmail() != null) existingUser.setEmail(userRequest.getEmail());
        if (userRequest.getRole() != null) existingUser.setRole(userRequest.getRole());
        if (userRequest.getSalle() != null) existingUser.setSalle(userRequest.getSalle());
        if (userRequest.getPost() != null) {
            existingUser.setPost(userRequest.getPost());
        }

        if (userRequest.getTelephone() != null) {
            existingUser.setTelephone(userRequest.getTelephone());
        }
        if (userRequest.getStatut() != null) {
            existingUser.setStatut(userRequest.getStatut());
        }
        // Si le mot de passe est modifié
        if (userRequest.getHashPassword() != null && !userRequest.getHashPassword().isBlank()) {
            existingUser.setHashPassword(passwordEncoder.encode(userRequest.getHashPassword()));
        }

        return userRepository.save(existingUser);
    }

    // --- Supprimer un utilisateur ---
    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    // --- Vérifier existence email ---
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}