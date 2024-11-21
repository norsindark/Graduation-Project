package com.restaurant_management.services.impls;

import com.cloudinary.Cloudinary;
import com.restaurant_management.dtos.BlogDto;
import com.restaurant_management.entites.Blog;
import com.restaurant_management.entites.CategoryBlog;
import com.restaurant_management.entites.User;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.BlogResponse;
import com.restaurant_management.repositories.BlogRepository;
import com.restaurant_management.repositories.CategoryBlogRepository;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final CategoryBlogRepository categoryBlogRepository;
    private final Cloudinary cloudinary;
    private final PagedResourcesAssembler<BlogResponse> pagedResourcesAssembler;

    @Override
    public BlogResponse getBlogById(String blogId) throws DataExitsException {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataExitsException("Blog not found"));
        return new BlogResponse(blog);
    }

    @Override
    public BlogResponse getBlogBySlug(String slug) throws DataExitsException {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new DataExitsException("Blog not found"));
        return new BlogResponse(blog);
    }

    @Override
    public PagedModel<EntityModel<BlogResponse>> getAllBlogs(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<BlogResponse> pageResult = blogRepository.findAllBlogs(pageable);
//        pageResult.getContent().forEach(blogResponse -> {
//            blogResponse.setContent(blogResponse.getContent().substring(0, 100) + "...");
//        });
        if (pageResult.isEmpty()) {
            throw new DataExitsException("No blog found");
        }
        return pagedResourcesAssembler.toModel(pageResult);
    }

    @Override
    public ApiResponse createBlog(BlogDto blogDto) throws DataExitsException {
        User user = userRepository.findById(blogDto.getAuthor())
                .orElseThrow(() -> new DataExitsException("User not found"));

        CategoryBlog categoryBlog = categoryBlogRepository.findById(blogDto.getCategoryBlogId())
                .orElseThrow(() -> new DataExitsException("Category blog not found"));

        Blog blog = new Blog();

        blog.setAuthor(user);
        blog.setCategoryBlog(categoryBlog);
        blog.setTitle(blogDto.getTitle());
        blog.setSlug(generateSlug(blogDto.getTitle()));
        blog.setContent(blogDto.getContent());
        blog.setSeoTitle(blogDto.getSeoTitle());
        blog.setSeoDescription(blogDto.getSeoDescription());
        blog.setStatus(blogDto.getStatus().toUpperCase());
        blog.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        if (blogDto.getThumbnail() != null) {
            blog.setThumbnail(blogDto.getThumbnail());
        }

        if (blogDto.getTags() != null) {
            blog.setTags(blogDto.getTags());
        }
        blogRepository.save(blog);

        return new ApiResponse("Blog created successfully", HttpStatus.CREATED);
    }


    @Override
    public ApiResponse updateBlog(BlogDto blogDto) throws DataExitsException {
        Blog blog = blogRepository.findById(blogDto.getId())
                .orElseThrow(() -> new DataExitsException("Blog not found"));

        if (blogDto.getCategoryBlogId() != null) {
            CategoryBlog categoryBlog = categoryBlogRepository.findById(blogDto.getCategoryBlogId())
                    .orElseThrow(() -> new DataExitsException("Category blog not found"));
            blog.setCategoryBlog(categoryBlog);
        }

        if (blogDto.getAuthor() != null) {
            User author = userRepository.findById(blogDto.getAuthor())
                    .orElseThrow(() -> new DataExitsException("User not found"));
            blog.setAuthor(author);
        }

        blog.setTitle(blogDto.getTitle());
        blog.setSlug(generateSlug(blogDto.getTitle()));
        blog.setContent(blogDto.getContent());
        blog.setSeoTitle(blogDto.getSeoTitle());
        blog.setSeoDescription(blogDto.getSeoDescription());
        blog.setStatus(blogDto.getStatus().toUpperCase());

        if (blogDto.getThumbnail() != null) {
            blog.setThumbnail(blogDto.getThumbnail());
        }

        if (blogDto.getTags() != null) {
            blog.setTags(blogDto.getTags());
        }

        blog.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        blogRepository.save(blog);

        return new ApiResponse("Blog updated successfully", HttpStatus.OK);
    }


    @Override
    public ApiResponse createBlogThumbnailUrl(MultipartFile file) throws DataExitsException, IOException {
        if (file.isEmpty()) {
            throw new DataExitsException("File is empty");
        }
        String url = cloudinary.uploader().upload(file.getBytes(), null).get("url").toString();
        return new ApiResponse(url, HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteBlog(String blogId) throws DataExitsException {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataExitsException("Blog not found"));
        blogRepository.delete(blog);
        return new ApiResponse("Blog deleted", HttpStatus.OK);
    }

    private String generateSlug(String title) {
        return title.toLowerCase().replace(" ", "-");
    }
}
