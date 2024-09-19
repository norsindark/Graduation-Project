package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;
import java.time.LocalDateTime;

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

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id")
    @JsonManagedReference
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "shift_id", referencedColumnName = "shift_id")
    @JsonManagedReference
    private Shift shift;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "note")
    private String note;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
