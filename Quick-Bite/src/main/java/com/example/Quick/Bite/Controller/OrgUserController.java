package com.example.Quick.Bite.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Quick.Bite.Domain.OrgUser;
import com.example.Quick.Bite.Service.OrgUserService;

@RestController
@RequestMapping("/api/users")
public class OrgUserController {

    @Autowired
    private OrgUserService orgUserService;

    @PostMapping("/create")
    public ResponseEntity<OrgUser> createUser(@RequestBody OrgUser user) {
        return ResponseEntity.ok(orgUserService.saveUser(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrgUser>> getAllUsers() {
        return ResponseEntity.ok(orgUserService.getAllUsers());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<OrgUser> getByUsername(@PathVariable String username) {
        return orgUserService.getUserByUserName(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/id/{id}")
    public ResponseEntity<OrgUser> getById(@PathVariable Long id) {
        return orgUserService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        orgUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
   
}

