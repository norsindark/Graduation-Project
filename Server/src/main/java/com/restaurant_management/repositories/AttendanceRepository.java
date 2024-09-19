package com.restaurant_management.repositories;
import com.restaurant_management.entites.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
}
