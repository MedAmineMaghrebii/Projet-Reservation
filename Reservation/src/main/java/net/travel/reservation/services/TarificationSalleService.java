package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.TarificationSalle;
import net.travel.reservation.exceptions.BadRequestException;
import net.travel.reservation.exceptions.ResourceNotFoundException;
import net.travel.reservation.repositories.TarificationSalleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TarificationSalleService {

    private final TarificationSalleRepository tarificationSalleRepository;

    // ==========================
    // GET ALL TARIFICATIONS
    // ==========================
    public List<TarificationSalle> getAllTarifications() {
        return tarificationSalleRepository.findAll();
    }

    // ==========================
    // GET BY ID
    // ==========================
    public TarificationSalle getTarificationById(Long id) {
        if (id == null) {
            throw new BadRequestException("L'identifiant de la tarification est obligatoire");
        }

        return tarificationSalleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tarification introuvable avec l'ID : " + id
                ));
    }

    // ==========================
    // CREATE
    // ==========================
    @Transactional
    public TarificationSalle createTarification(TarificationSalle tarification) {

        if (tarification == null) {
            throw new BadRequestException("Les informations de tarification sont obligatoires");
        }

        // Verification du prix (adapte selon si c'est BigDecimal ou Double)
        if (tarification.getPrix() == null || tarification.getPrix().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Le prix doit être supérieur à 0");
        }

        return tarificationSalleRepository.save(tarification);
    }

    // ==========================
    // UPDATE
    // ==========================
    @Transactional
    public TarificationSalle updateTarification(Long id, TarificationSalle request) {

        if (request == null) {
            throw new BadRequestException("Les données de mise à jour sont obligatoires");
        }

        TarificationSalle tarification = getTarificationById(id);

        if (request.getPrix() != null) {
            if (request.getPrix().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Le prix doit être supérieur à 0");
            }
            tarification.setPrix(request.getPrix());
        }

        if (request.getPeriode() != null) {
            tarification.setPeriode(request.getPeriode());
        }

        if (request.getSalle() != null) {
            tarification.setSalle(request.getSalle());
        }

        return tarificationSalleRepository.save(tarification);
    }

    // ==========================
    // DELETE
    // ==========================
    @Transactional
    public void deleteTarification(Long id) {
        TarificationSalle tarification = getTarificationById(id);
        tarificationSalleRepository.delete(tarification);
    }

    // ==========================
    // RECHERCHE PAR SALLE
    // ==========================
    public List<TarificationSalle> findBySalleId(Long salleId) {

        if (salleId == null) {
            throw new BadRequestException("L'identifiant de la salle est obligatoire");
        }

        List<TarificationSalle> tarifications = tarificationSalleRepository.findBySalle_SalleId(salleId);

        if (tarifications.isEmpty()) {
            throw new ResourceNotFoundException("Aucune tarification trouvée pour la salle avec l'ID : " + salleId);
        }

        return tarifications;
    }
}