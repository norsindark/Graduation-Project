package com.restaurant_management.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "comments")
public class Comment {

    @Id
    @UuidGenerator
    @Column(name = "comment_id", length = 36, nullable = false)
    private String id;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id")
    @JsonIgnore
    private Blog blog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    @JsonIgnore
    private Comment parentComment;

    @OneToMany(mappedBy = "parentComment")
    @JsonIgnore
    private List<Comment> replies = new ArrayList<>();

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;
}
