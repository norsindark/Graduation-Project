package com.restaurant_management.payloads.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GeocodingResponse {
    private String from;
    private String to;
    private String distance;
    private String fee;
    private String duration;
}
