package com.restaurant_management.repositories;

import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.entites.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeShiftRepository extends JpaRepository<EmployeeShift, String> {

    void deleteByEmployeeId(String employeeId);

    List<EmployeeShift> findAllByShift(Shift shift);
}
