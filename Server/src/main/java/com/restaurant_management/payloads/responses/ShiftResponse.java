package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Shift;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShiftResponse {
    private String shiftId;
    private String shiftName;
    private String startTime;
    private String endTime;

    public ShiftResponse(Shift shift) {
        this.shiftId = shift.getId();
        this.shiftName = shift.getShiftName();
        this.startTime = shift.getStartTime().toString();
        this.endTime = shift.getEndTime().toString();
    }
}
