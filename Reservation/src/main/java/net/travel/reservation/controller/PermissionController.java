package net.travel.reservation.controller;


import lombok.RequiredArgsConstructor;
import net.travel.reservation.entites.Permission;
import net.travel.reservation.services.PermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {


    private final PermissionService permissionService;



    // CREATE
    @PostMapping
    public ResponseEntity<Permission> createPermission(
            @RequestBody Permission permission
    ){

        return new ResponseEntity<>(
                permissionService.createPermission(permission),
                HttpStatus.CREATED
        );
    }




    // READ ALL
    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions(){

        return ResponseEntity.ok(
                permissionService.getAllPermissions()
        );
    }





    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Permission> getPermissionById(
            @PathVariable Long id
    ){

        return ResponseEntity.ok(
                permissionService.getPermissionById(id)
        );
    }





    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Permission> updatePermission(
            @PathVariable Long id,
            @RequestBody Permission permission
    ){

        return ResponseEntity.ok(
                permissionService.updatePermission(id, permission)
        );
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(
            @PathVariable Long id
    ){

        permissionService.deletePermission(id);

        return ResponseEntity.noContent().build();
    }

}