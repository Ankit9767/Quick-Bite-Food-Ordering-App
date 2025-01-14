package com.example.Quick.Bite.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Quick.Bite.Domain.DeliveryPerson;
import com.example.Quick.Bite.Repository.DeliveryPersonRepository;

@Service
public class DeliveryPersonService {

    @Autowired
    private DeliveryPersonRepository deliveryPersonRepository;

    public DeliveryPerson saveDeliveryPerson(DeliveryPerson deliveryPerson) {
        return deliveryPersonRepository.save(deliveryPerson);
    }

    public List<DeliveryPerson> getAllDeliveryPersons() {
        return deliveryPersonRepository.findAll();
    }

    public Optional<DeliveryPerson> getDeliveryPersonById(Long id) {
        return deliveryPersonRepository.findById(id);
    }

    public void deleteDeliveryPerson(Long id) {
        deliveryPersonRepository.deleteById(id);
    }
}
