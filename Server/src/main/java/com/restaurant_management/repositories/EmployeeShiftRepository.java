package com.restaurant_management.repositories;

import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.EmployeeShift;
import com.restaurant_management.entites.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface EmployeeShiftRepository extends JpaRepository<EmployeeShift, String> {

    void deleteByEmployeeId(String employeeId);

    List<EmployeeShift> findAllByShift(Shift shift);

    Optional<EmployeeShift> findByEmployeeIdAndShiftIdAndWorkDate(String employeeId, String shiftId, Timestamp workDate);

    Page<EmployeeShift> findByEmployeeId(String employeeId, Pageable pageable);

    boolean existsByEmployeeAndShiftAndWorkDate(Employee employee, Shift shift, Timestamp workDate);

    @Query("SELECT COUNT(e) FROM EmployeeShift e WHERE MONTH(e.workDate) = ?1 AND YEAR(e.workDate) = ?2")
    Long countEmployeeShiftsByMonthAndYear(Integer month, Integer year);

    @Query("SELECT s.startTime, s.endTime " +
            "FROM Shift s JOIN s.employeeShifts es " +
            "WHERE EXTRACT(MONTH FROM es.workDate) = :month " +
            "AND EXTRACT(YEAR FROM es.workDate) = :year")
    List<Object[]> findShiftsByMonthAndYear(@Param("month") Integer month, @Param("year") Integer year);
}
