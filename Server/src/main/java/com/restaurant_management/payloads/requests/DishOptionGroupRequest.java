package com.restaurant_management.payloads.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishOptionGroupRequest {
    private String groupName;
    private String description;
    private List<DishOptionRequest> options;
}
