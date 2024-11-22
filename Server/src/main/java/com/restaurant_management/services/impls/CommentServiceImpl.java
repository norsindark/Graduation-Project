package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.CommentDto;
import com.restaurant_management.entites.Blog;
import com.restaurant_management.entites.Comment;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CommentResponse;
import com.restaurant_management.repositories.BlogRepository;
import com.restaurant_management.repositories.CommentRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final PagedResourcesAssembler<CommentResponse> pagedResourcesAssembler;

    @Override
    public CommentResponse getCommentById(String id) throws DataExitsException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new DataExitsException("Comment not found"));

        if (comment.getParentComment() != null) {
            return null;
        }

        return new CommentResponse(comment);
    }

    @Override
    public PagedModel<EntityModel<CommentResponse>> getAllComments(
            int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Comment> comments = commentRepository.findAll(pageable);

        if (comments.isEmpty()) {
            throw new DataExitsException("No comments found");
        }

        List<CommentResponse> commentResponses = comments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(CommentResponse::new)
                .collect(Collectors.toList());
        return pagedResourcesAssembler.toModel(new PageImpl<>(commentResponses, pageable, comments.getTotalElements()));
    }

    @Override
    public PagedModel<EntityModel<CommentResponse>> getAllCommentsByBlogId(
            String blogId, int pageNo, int pageSize, String sortBy, String sortDir) throws DataExitsException {

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        
        Page<Comment> comments = commentRepository.findAllByBlogId(blogId, pageable);

        if (comments.isEmpty()) {
            throw new DataExitsException("No comments found");
        }

        List<CommentResponse> commentResponses = comments.stream()
                .filter(comment -> comment.getParentComment() == null)
                .map(CommentResponse::new)
                .collect(Collectors.toList());

        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<CommentResponse> comparator;

            switch (sortBy) {
                case "createdAt":
                    comparator = Comparator.comparing(CommentResponse::getCreatedAt);
                    break;
                case "author":
                    comparator = Comparator.comparing(CommentResponse::getAuthor);
                    break;
                default:
                    comparator = Comparator.comparing(CommentResponse::getCreatedAt);
                    break;
            }

            if ("desc".equalsIgnoreCase(sortDir)) {
                comparator = comparator.reversed();
            }

            commentResponses.sort(comparator);
        }
        return pagedResourcesAssembler.toModel(new PageImpl<>(commentResponses, pageable, comments.getTotalElements()));
    }



    @Override
    public ApiResponse addComment(CommentDto request) throws DataExitsException {
        User user = userRepository.findById(request.getAuthor())
                .orElseThrow(() -> new DataExitsException("User not found"));

        Blog blog = null;
        Comment parentComment = null;

        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new DataExitsException("Parent comment not found"));
            blog = parentComment.getBlog();
        } else {
            blog = blogRepository.findById(request.getBlogId())
                    .orElseThrow(() -> new DataExitsException("Blog not found"));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .blog(blog)
                .author(user)
                .parentComment(parentComment)
                .build();

        commentRepository.save(comment);
        return new ApiResponse("Comment added successfully", HttpStatus.OK);
    }


    @Override
    public ApiResponse updateComment(CommentDto request) throws DataExitsException {
        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new DataExitsException("Comment not found"));

        comment.setContent(request.getContent());
        commentRepository.save(comment);
        return new ApiResponse("Comment updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteComment(String id) throws DataExitsException {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new DataExitsException("Comment not found"));
        commentRepository.delete(comment);
        return new ApiResponse("Comment deleted", HttpStatus.OK);
    }
}
