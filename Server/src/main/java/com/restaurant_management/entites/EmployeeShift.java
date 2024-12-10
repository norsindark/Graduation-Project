package com.restaurant_management.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "employee_shifts")
public class EmployeeShift {

    @Id
    @UuidGenerator
    @Column(name = "employee_shift_id", length = 36, nullable = false)
    private String id;

//    @ManyToOne
//    @JoinColumn(name = "employee_id", nullable = false)
//    private Employee employee;
//
//    @ManyToOne
//    @JoinColumn(name = "shift_id", nullable = false)
//    private Shift shift;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "shift_id", nullable = false)
    private String shiftId;

    @Column(name = "shift_name")
    private String shiftName;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "work_date", nullable = false)
    private Timestamp workDate;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
