package net.travel.reservation.services;

import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Permission;
import net.travel.reservation.repositories.PermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {


    private final PermissionRepository permissionRepository;


    public Permission createPermission(Permission permission) {

        if(permissionRepository.existsByName(permission.getName())) {

            throw new RuntimeException(
                    "Permission already exists"
            );
        }

        return permissionRepository.save(permission);
    }



    public List<Permission> getAllPermissions() {

        return permissionRepository.findAll();
    }



    public Permission getPermissionById(Long id) {

        return permissionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Permission not found"
                        )
                );
    }



    public Permission updatePermission(
            Long id,
            Permission permission
    ) {

        Permission existing =
                getPermissionById(id);


        existing.setName(permission.getName());

        existing.setDescription(
                permission.getDescription()
        );


        return permissionRepository.save(existing);
    }



    public void deletePermission(Long id) {

        Permission permission =
                getPermissionById(id);


        permissionRepository.delete(permission);
    }

}