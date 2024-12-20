package com.restaurant_management.payloads.responses;

import com.restaurant_management.entites.Blog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
public class BlogResponse {
    private String id;
    private String title;
    private String slug;
    private String content;
    private String status;
    private String author;
    private String thumbnail;
    private String tags;
    private String seoTitle;
    private String seoDescription;
    private Integer totalComments;
    private String categoryBlogName;
    private String categoryBlogId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public BlogResponse(Blog blog) {
        this.id = blog.getId();
        this.title = blog.getTitle();
        this.slug = blog.getSlug();
        this.content = blog.getContent();
        this.status = blog.getStatus();
        this.author = blog.getAuthor().getFullName();
        this.thumbnail = blog.getThumbnail();
        this.tags = blog.getTags();
        this.seoTitle = blog.getSeoTitle();
        this.seoDescription = blog.getSeoDescription();
        this.totalComments = blog.getComments().size();
        this.categoryBlogName = blog.getCategoryBlog().getName();
        this.categoryBlogId = blog.getCategoryBlog().getId();
        this.createdAt = blog.getCreatedAt();
        this.updatedAt = blog.getUpdatedAt();
    }

    public BlogResponse(String id, String title, String slug , String content,
                        String status, String author, String thumbnail, String tags,
                        String seoTitle, String seoDescription, Integer totalComments,
                        String categoryBlogName, String categoryBlogId, Timestamp createdAt, Timestamp updatedAt) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.content = content;
        this.status = status;
        this.author = author;
        this.thumbnail = thumbnail;
        this.tags = tags;
        this.seoTitle = seoTitle;
        this.seoDescription = seoDescription;
        this.totalComments = totalComments;
        this.categoryBlogName = categoryBlogName;
        this.categoryBlogId = categoryBlogId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static List<BlogResponse> toListBlogResponse(List<Blog> blogs) {
        return blogs.stream().map(BlogResponse::new).toList();
    }
}
