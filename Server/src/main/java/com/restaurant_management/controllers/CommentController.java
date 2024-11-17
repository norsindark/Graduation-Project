package com.restaurant_management.controllers;


import com.restaurant_management.dtos.CommentDto;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.services.interfaces.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@Tag(name = "Comment", description = "Comment API")
@RequestMapping("/api/v1/client/comment")
public class CommentController {
    private final CommentService commentService;

    // comment
    @GetMapping("/get-all-comments")
    @Operation(summary = "Get all comments", tags = {"Comment"})
    public ResponseEntity<?> getAllComments(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir)
            throws DataExitsException {
        return ResponseEntity.ok(commentService.getAllComments(pageNo, pageSize, sortBy, sortDir));
    }

    @GetMapping("/get-comment-by-id")
    @Operation(summary = "Get comment by ID", tags = {"Comment"})
    public ResponseEntity<?> getCommentById(@RequestParam String commentId) throws DataExitsException {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    @GetMapping("/get-all-comments-by-blog-id")
    @Operation(summary = "Get all comments by blog ID", tags = {"Comment"})
    public ResponseEntity<?> getAllCommentsByBlogId(
            @RequestParam String blogId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir)
            throws DataExitsException {
        return ResponseEntity.ok(commentService.getAllCommentsByBlogId(blogId, pageNo, pageSize, sortBy, sortDir));
    }

    @PostMapping("/create-new-comment")
    @Operation(summary = "Create new comment", tags = {"Comment"})
    public ResponseEntity<?> createComment(@RequestBody CommentDto commentDto) throws DataExitsException {
        return ResponseEntity.ok(commentService.addComment(commentDto));
    }

    @PutMapping("/update-comment")
    @Operation(summary = "Update comment", tags = {"Comment"})
    public ResponseEntity<?> updateComment(@RequestBody CommentDto commentDto) throws DataExitsException {
        return ResponseEntity.ok(commentService.updateComment(commentDto));
    }
}
