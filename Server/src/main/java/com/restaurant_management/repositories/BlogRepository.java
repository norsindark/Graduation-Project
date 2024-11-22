package com.restaurant_management.repositories;

import com.restaurant_management.entites.Blog;
import com.restaurant_management.payloads.responses.BlogResponse;
import com.restaurant_management.payloads.responses.SearchBlogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, String> {

    @Query("SELECT new com.restaurant_management.payloads.responses.BlogResponse(" +
            "b.id, b.title, " +
//            "SUBSTRING(b.content, 1, 100), " +
            "b.slug, b.content, " +
            "b.status, b.author.fullName, " +
            "b.thumbnail, b.tags, b.seoTitle, b.seoDescription, " +
            "SIZE(b.comments), " +
            "b.categoryBlog.name, b.categoryBlog.id, " +
            "b.createdAt, b.updatedAt) " +
            "FROM Blog b")
    Page<BlogResponse> findAllBlogs(Pageable pageable);

    Optional<Blog> findBySlug(String slug);

    @Query("SELECT b FROM Blog b " +
            "WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Blog> searchByTitle(String title);

    @Query("SELECT new com.restaurant_management.payloads.responses.SearchBlogResponse(" +
            "b.id, b.title, " +
            "b.slug, b.thumbnail) " +
            "FROM Blog b")
    List<SearchBlogResponse> getAllBlogToSearch();

    @Query("SELECT b.tags FROM Blog b")
    List<String> findAllTags();

    @Query("SELECT new com.restaurant_management.payloads.responses.BlogResponse(" +
            "b.id, b.title, " +
            "b.slug, " +
            "SUBSTRING(b.content, 1, 100), " +
//            "b.content, " +
            "b.status, b.author.fullName, " +
            "b.thumbnail, b.tags, b.seoTitle, b.seoDescription, " +
            "SIZE(b.comments), " +
            "b.categoryBlog.name, b.categoryBlog.id, " +
            "b.createdAt, b.updatedAt) " +
            "FROM Blog b " +
            "WHERE b.tags IN :tags")
    Page<BlogResponse> findByTags(List<String> tags, Pageable pageable);
}
