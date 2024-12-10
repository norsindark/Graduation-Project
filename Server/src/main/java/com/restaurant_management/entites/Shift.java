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
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "shifts")
public class Shift {

    @Id
    @UuidGenerator
    @Column(name = "shift_id", length = 36, nullable = false)
    private String id;

    @Column(name = "shift_name", nullable = false)
    private String shiftName;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

//    @OneToMany(mappedBy = "shift")
//    @JsonIgnore
//    private Set<EmployeeShift> employeeShifts = new HashSet<>();

//    @OneToMany(mappedBy = "shift")
//    @JsonIgnore
//    private Set<Attendance> attendances = new HashSet<>();

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;

}
