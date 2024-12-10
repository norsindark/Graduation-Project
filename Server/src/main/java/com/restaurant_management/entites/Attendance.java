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

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "attendances")
public class Attendance {

    @Id
    @UuidGenerator
    @Column(name = "attendance_id", length = 36, nullable = false)
    private String id;

//    @ManyToOne
//    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id")
//    @JsonIgnore
//    private Employee employee;
//
//    @ManyToOne
//    @JoinColumn(name = "shift_id", referencedColumnName = "shift_id")
//    @JsonIgnore
//    private Shift shift;

    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "shift_id")
    private String shiftId;

    @Column(name = "employee_name")
    private String employeeName;

    @Column(name = "shift_name")
    private String shiftName;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    @Column(name = "attendance_date", nullable = false)
    private Timestamp attendanceDate;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "note", length = 2000)
    private String note;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
