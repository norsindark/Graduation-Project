package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {

        private String id;
        private String name;
        private String thumbnail;
        private String slug;
        private String status;

        public CategoryResponse(Category category) {
            this.id = category.getId();
            this.name = category.getName();
            this.thumbnail = category.getThumbnail();
            this.slug = category.getSlug();
            this.status = category.getStatus();
        }
}
