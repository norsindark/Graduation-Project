package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.DishOptionGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishOptionGroupResponse {
    private String groupId;
    private String groupName;
    private String description;
    private String createdAt;
    private String updatedAt;
    private List<DishOptionResponse> options;

    public DishOptionGroupResponse(DishOptionGroup dishOptionGroup) {
        this.groupId = dishOptionGroup.getId();
        this.groupName = dishOptionGroup.getGroupName();
        this.description = dishOptionGroup.getDescription();
        this.createdAt = dishOptionGroup.getCreatedAt().toString();
        this.updatedAt = dishOptionGroup.getUpdatedAt().toString();
        this.options = dishOptionGroup.getOptions().stream().map(DishOptionResponse::new).collect(Collectors.toList());
    }
}
