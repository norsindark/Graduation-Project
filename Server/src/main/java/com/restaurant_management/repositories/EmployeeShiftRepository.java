package com.restaurant_management.repositories;

import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.entites.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface EmployeeShiftRepository extends JpaRepository<EmployeeShift, String> {

    void deleteByEmployeeId(String employeeId);

    List<EmployeeShift> findAllByShift(Shift shift);

    Optional<EmployeeShift> findByEmployeeIdAndShiftId(String employeeId, String shiftId);

    Page<EmployeeShift> findByEmployeeId(String employeeId, Pageable pageable);

    boolean existsByEmployeeAndShiftAndWorkDate(Employee employee, Shift shift, Timestamp workDate);
}
