package com.restaurant_management.repositories;

import com.restaurant_management.entites.Attendance;
import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    boolean existsByEmployeeAndShiftAndAttendanceDate(Employee employee, Shift shift, Timestamp attendanceDate);

    Page<Attendance> findByAttendanceDate(Timestamp date, Pageable pageable);

    List<Attendance> findByEmployeeIdAndShiftIdAndAttendanceDate(String employeeId, String shiftId, Timestamp attendanceDate);

}
