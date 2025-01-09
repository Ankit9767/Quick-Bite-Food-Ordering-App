package com.example.Quick.Bite.Service;


import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Quick.Bite.Domain.Cart;
import com.example.Quick.Bite.Domain.OrgUser;
import com.example.Quick.Bite.Enumerations.CartStatus;
import com.example.Quick.Bite.Repository.OrgUserRepository;

@Service
public class OrgUserService {
	
    private final Logger log = LoggerFactory.getLogger(OrgUserService.class);
    
    private final OrgUserRepository orgUserRepository;
    private final PasswordEncoder passwordEncoder;

    private final CartService cartService;

    @Autowired
    public OrgUserService(OrgUserRepository orgUserRepository, PasswordEncoder passwordEncoder, CartService cartService) {
        this.orgUserRepository = orgUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.cartService = cartService;
    }
    
    public OrgUser registerUser(OrgUser user) {
        log.info("Attempting to register user with username: {}", user.getUserName());

        if (orgUserRepository.findByUserName(user.getUserName()).isPresent()) {
            log.warn("Registration failed: Username '{}' already exists", user.getUserName());
            throw new RuntimeException("Username already exists: " + user.getUserName());
        }

        if (orgUserRepository.findByEmail(user.getEmail()).isPresent()) {
            log.warn("Registration failed: Email '{}' already exists", user.getEmail());
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        user.setIsActive(true);

        OrgUser savedUser = orgUserRepository.save(user);
        log.info("User with username '{}' registered successfully.", user.getUserName());

        return savedUser;
    }
    


    public void createCartForUser(OrgUser user) {
        log.info("Checking if user '{}' already has a cart...", user.getUserName());
        
        Cart existingCart = cartService.getCartByUserId(user.getId());
        if (existingCart != null) {
            log.info("User '{}' already has a cart with ID: {}", user.getUserName(), existingCart.getId());
            return;
        }

        log.info("Creating a new cart for user '{}' with restaurant ID 1", user.getUserName());
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setRestaurantId(1L);
        cart.setStatus(CartStatus.ACTIVE);

        Cart createdCart = cartService.createCart(cart);
        log.info("Cart created for user '{}' with ID: {}", user.getUserName(), createdCart.getId());
    }

    
    public OrgUser saveUser(OrgUser user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        log.info("Saving user with encrypted password {}",passwordEncoder.encode(user.getPassword()));
        return orgUserRepository.save(user);
    }

    public List<OrgUser> getAllUsers() {
        log.info("Fetching all users...");
        return orgUserRepository.findAll();
    }

    public Optional<OrgUser> getUserById(Long id) {
        log.info("Fetching user with ID: {}", id);
        return orgUserRepository.findById(id);
    }

    public Optional<OrgUser> getUserByUserName(String userName) {
        log.info("Fetching user with username: {}", userName);
        return orgUserRepository.findByUserName(userName);
    }
    
    public Optional<OrgUser> getUserByEmail(String email) {
        log.info("Fetching user with email: {}", email);
        return orgUserRepository.findByEmail(email);
    }
    
    public void deleteUser(Long id) {
        orgUserRepository.deleteById(id);
    }

}


