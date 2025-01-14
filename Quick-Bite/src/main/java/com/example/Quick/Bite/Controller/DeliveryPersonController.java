package com.example.Quick.Bite.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Quick.Bite.Domain.DeliveryPerson;
import com.example.Quick.Bite.Service.DeliveryPersonService;

@RestController
@RequestMapping("/api/delivery-persons")
public class DeliveryPersonController {

    @Autowired
    private DeliveryPersonService deliveryPersonService;

    @PostMapping("/add")
    public ResponseEntity<DeliveryPerson> createDeliveryPerson(@RequestBody DeliveryPerson deliveryPerson) {
        DeliveryPerson savedDeliveryPerson = deliveryPersonService.saveDeliveryPerson(deliveryPerson);
        return new ResponseEntity<>(savedDeliveryPerson, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DeliveryPerson>> getAllDeliveryPersons() {
        List<DeliveryPerson> deliveryPersons = deliveryPersonService.getAllDeliveryPersons();
        return new ResponseEntity<>(deliveryPersons, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryPerson> getDeliveryPersonById(@PathVariable Long id) {
        Optional<DeliveryPerson> deliveryPerson = deliveryPersonService.getDeliveryPersonById(id);
        return deliveryPerson.map(person -> new ResponseEntity<>(person, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeliveryPerson(@PathVariable Long id) {
        deliveryPersonService.deleteDeliveryPerson(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
