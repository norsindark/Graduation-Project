package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "employee")
public class Employee {

    @Id
    @UuidGenerator
    @Column(name = "employee_id", length = 36, nullable = false)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @JsonBackReference
    private User user;

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @Column(name = "salary")
    private double salary;

    @Column(name = "job_title")
    private String jobTitle;

    @ManyToMany
    @JoinTable(
            name = "employee_shifts",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "shift_id")
    )
    private Set<Shift> shifts = new HashSet<>();

    @OneToMany(mappedBy = "employee")
    private Set<Attendance> attendances = new HashSet<>();

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
