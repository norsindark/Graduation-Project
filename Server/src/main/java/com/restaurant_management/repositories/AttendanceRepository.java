package com.restaurant_management.repositories;

import com.restaurant_management.entites.Attendance;
import com.restaurant_management.entites.Employee;
import com.restaurant_management.entites.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    boolean existsByEmployeeAndShiftAndAttendanceDate(Employee employee, Shift shift, Timestamp attendanceDate);

    Page<Attendance> findByAttendanceDate(Timestamp date, Pageable pageable);

    List<Attendance> findByEmployeeIdAndShiftIdAndAttendanceDate(String employeeId, String shiftId, Timestamp attendanceDate);

    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE EXTRACT(MONTH FROM a.attendanceDate) = :month " +
            "AND EXTRACT(YEAR FROM a.attendanceDate) = :year " +
            "AND a.status = :status")
    Long countStatusPerMonth(@Param("month") int month, @Param("year") int year, @Param("status") String status);

    @Query("SELECT a.employee.id, " +
            "SUM(CASE WHEN LOWER(a.status) = 'present' THEN 1 ELSE 0 END) AS presentCount, " +
            "SUM(CASE WHEN LOWER(a.status) = 'absent' THEN 1 ELSE 0 END) AS absentCount " +
            "FROM Attendance a " +
            "WHERE EXTRACT(MONTH FROM a.attendanceDate) = :month " +
            "AND EXTRACT(YEAR FROM a.attendanceDate) = :year " +
            "GROUP BY a.employee.id")
    List<Object[]> countAttendanceByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT a.employee.id, " +
            "SUM(CASE WHEN LOWER(a.status) = 'present' THEN 1 ELSE 0 END) AS presentCount, " +
            "SUM(CASE WHEN LOWER(a.status) = 'absent' THEN 1 ELSE 0 END) AS absentCount " +
            "FROM Attendance a " +
            "WHERE EXTRACT(MONTH FROM a.attendanceDate) = :month " +
            "AND EXTRACT(YEAR FROM a.attendanceDate) = :year " +
            "AND a.employee.id = :employeeId " +
            "GROUP BY a.employee.id")
    List<Object[]> countAttendanceByEmployee(@Param("month") int month, @Param("year") int year, @Param("employeeId") String employeeId);
}
