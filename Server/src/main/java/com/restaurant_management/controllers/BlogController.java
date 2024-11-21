package com.restaurant_management.controllers;

import com.restaurant_management.dtos.BlogDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.services.interfaces.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Blog", description = "Blog API")
@RequestMapping("/api/v1/dashboard/blog")
public class BlogController {
    private final BlogService blogService;

    @GetMapping("/get-blog-by-id")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get blog by ID", tags = {"Blog"})
    public ResponseEntity<?> getBlogById(@RequestParam String blogId) throws DataExitsException {
        return ResponseEntity.ok(blogService.getBlogById(blogId));
    }

    @GetMapping("/get-blog-by-slug")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get blog by slug", tags = {"Blog"})
    public ResponseEntity<?> getBlogBySlug(@RequestParam String slug) throws DataExitsException {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }

    @GetMapping("/get-all-blogs")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all blogs", tags = {"Blog"})
    public ResponseEntity<?> getAllBlogs(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) throws DataExitsException {
        return ResponseEntity.ok(blogService.getAllBlogs(pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/create-new-blog")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new blog", tags = {"Blog"})
    public ResponseEntity<?> createBlog(@RequestBody BlogDto blogDto) throws DataExitsException {
        return ResponseEntity.ok(blogService.createBlog(blogDto));
    }

    @PostMapping("/create-blog-thumbnail-url")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create blog thumbnail URL", tags = {"Blog"})
    public ResponseEntity<?> createBlogThumbnailUrl(@RequestBody MultipartFile thumbnailUrl)
            throws DataExitsException, IOException {
        return ResponseEntity.ok(blogService.createBlogThumbnailUrl(thumbnailUrl));
    }

    @PutMapping("/update-blog")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update blog", tags = {"Blog"})
    public ResponseEntity<?> updateBlog(@RequestBody BlogDto blogDto) throws DataExitsException {
        return ResponseEntity.ok(blogService.updateBlog(blogDto));
    }

    @DeleteMapping("/delete-blog")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete blog", tags = {"Blog"})
    public ResponseEntity<?> deleteBlog(@RequestParam String blogId) throws DataExitsException {
        return ResponseEntity.ok(blogService.deleteBlog(blogId));
    }
}
