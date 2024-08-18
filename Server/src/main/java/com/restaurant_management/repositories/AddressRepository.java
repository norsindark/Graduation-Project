package com.restaurant_management.repositories;

import com.restaurant_management.entites.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, String> {
    Page<Address> findByUserId(String userId, Pageable pageable);
}

