package com.restaurant_management.entites;

import jakarta.persistence.*;
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
@Table(name = "categories_blog")
public class CategoryBlog {
    @Id
    @UuidGenerator
    @Column(name = "category_blog_id", length = 36, nullable = false)
    private String id;

    @Column(name = "category_blog_name", unique = true)
    private String name;

    @Column(name = "slug")
    private String slug;

    @Column(name = "thumbnail")
    private String thumbnail;

    @Column(name = "status")
    private String status;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
