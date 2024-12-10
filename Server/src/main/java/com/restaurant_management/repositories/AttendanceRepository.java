package com.restaurant_management.repositories;

import com.restaurant_management.entites.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
//    boolean existsByEmployeeAndShiftAndAttendanceDate(Employee employee, Shift shift, Timestamp attendanceDate);

    boolean existsByEmployeeNameAndShiftNameAndAttendanceDate(String employee, String shift, Timestamp attendanceDate);

//    @Query("SELECT a FROM Attendance a JOIN a.shift s JOIN a.employee e WHERE a.attendanceDate = :attendanceDate")
//    Page<Attendance> findByAttendanceDate(@Param("attendanceDate") Timestamp attendanceDate, Pageable pageable);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :attendanceDate")
    Page<Attendance> findByAttendanceDate(@Param("attendanceDate") Timestamp attendanceDate, Pageable pageable);


    List<Attendance> findByEmployeeIdAndShiftIdAndAttendanceDate(String employeeId, String shiftId, Timestamp attendanceDate);

    @Query("SELECT COUNT(a) FROM Attendance a " +
            "WHERE EXTRACT(MONTH FROM a.attendanceDate) = :month " +
            "AND EXTRACT(YEAR FROM a.attendanceDate) = :year " +
            "AND a.status = :status")
    Long countStatusPerMonth(@Param("month") int month, @Param("year") int year, @Param("status") String status);

    @Query("SELECT a.employeeId, " +
            "SUM(CASE WHEN LOWER(a.status) = 'present' THEN 1 ELSE 0 END) AS presentCount, " +
            "SUM(CASE WHEN LOWER(a.status) = 'absent' THEN 1 ELSE 0 END) AS absentCount " +
            "FROM Attendance a " +
            "WHERE EXTRACT(MONTH FROM a.attendanceDate) = :month " +
            "AND EXTRACT(YEAR FROM a.attendanceDate) = :year " +
            "GROUP BY a.employeeId")
    List<Object[]> countAttendanceByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT a.employeeId, " +
            "SUM(CASE WHEN LOWER(a.status) = 'present' THEN 1 ELSE 0 END) AS presentCount, " +
            "SUM(CASE WHEN LOWER(a.status) = 'absent' THEN 1 ELSE 0 END) AS absentCount " +
            "FROM Attendance a " +
            "WHERE EXTRACT(MONTH FROM a.attendanceDate) = :month " +
            "AND EXTRACT(YEAR FROM a.attendanceDate) = :year " +
            "AND a.employeeId = :employeeId " +
            "GROUP BY a.employeeId")
    List<Object[]> countAttendanceByEmployee(@Param("month") int month, @Param("year") int year, @Param("employeeId") String employeeId);
}
