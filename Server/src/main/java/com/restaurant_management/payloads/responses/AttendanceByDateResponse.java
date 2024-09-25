package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Attendance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class AttendanceByDateResponse {
    private String attendanceId;
    private String employeeName;
    private String shiftName;
    private String shiftStartTime;
    private String shiftEndTime;
    private String attendanceDate;
    private String status;
    private String note;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public AttendanceByDateResponse(Attendance attendance) {
        this.attendanceId = attendance.getId();
        this.employeeName = attendance.getEmployee().getEmployeeName();
        this.shiftName = attendance.getShift().getShiftName();
        this.shiftStartTime = attendance.getShift().getStartTime().toString();
        this.shiftEndTime = attendance.getShift().getEndTime().toString();
        this.attendanceDate = attendance.getAttendanceDate().toString();
        this.status = attendance.getStatus();
        this.note = attendance.getNote();
        this.createdAt = attendance.getCreatedAt();
        this.updatedAt = attendance.getUpdatedAt();
    }
}
