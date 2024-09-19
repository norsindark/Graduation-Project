package com.restaurant_management.repositories;

import com.restaurant_management.entites.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftRepository extends JpaRepository<Shift, String> {
    boolean existsByShiftName(String shiftName);
}
