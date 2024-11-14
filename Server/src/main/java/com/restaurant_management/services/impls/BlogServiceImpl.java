package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.BlogDto;
import com.restaurant_management.entites.Blog;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.BlogResponse;
import com.restaurant_management.repositories.BlogRepository;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final PagedResourcesAssembler<BlogResponse> pagedResourcesAssembler;

    @Override
    public BlogResponse getBlogById(String blogId) throws DataExitsException {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataExitsException("Blog not found"));
        return new BlogResponse(blog);
    }

    @Override
    public PagedModel<EntityModel<BlogResponse>> getAllBlogs(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<BlogResponse> pageResult = blogRepository.findAllBlogs(pageable);
        if (pageResult.isEmpty()) {
            throw new DataExitsException("No blog found");
        }
        return pagedResourcesAssembler.toModel(pageResult);
    }

    @Override
    public ApiResponse createBlog(BlogDto blogDto) throws DataExitsException {
        User user = userRepository.findById(blogDto.getAuthor())
                .orElseThrow(() -> new DataExitsException("User not found"));
        Blog blog = Blog.builder()
                .author(user)
                .title(blogDto.getTitle())
                .content(blogDto.getContent())
                .status(blogDto.getStatus().toUpperCase())
                .createdAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();
        blogRepository.save(blog);
        return new ApiResponse("Blog created", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateBlog(BlogDto blogDto) throws DataExitsException {
        Blog blog = blogRepository.findById(blogDto.getId())
                .orElseThrow(() -> new DataExitsException("Blog not found"));
        blog.setTitle(blogDto.getTitle());
        blog.setContent(blogDto.getContent());
        blog.setStatus(blogDto.getStatus().toUpperCase());
        blogRepository.save(blog);
        return new ApiResponse("Blog updated", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteBlog(String blogId) throws DataExitsException {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataExitsException("Blog not found"));
        blogRepository.delete(blog);
        return new ApiResponse("Blog deleted", HttpStatus.OK);
    }
}
