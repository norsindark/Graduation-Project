package com.restaurant_management.services.impls;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.restaurant_management.entites.CategoryBlog;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.CategoryBlogRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryBlogResponse;
import com.restaurant_management.payloads.responses.CountBlogByCategoryBlogResponse;
import com.restaurant_management.repositories.CategoryBlogRepository;
import com.restaurant_management.services.interfaces.CategoryBlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CategoryBlogServiceImpl implements CategoryBlogService {
    private final CategoryBlogRepository categoryBlogRepository;
    private final Cloudinary cloudinary;
    private final PagedResourcesAssembler<CategoryBlogResponse> pagedResourcesAssembler;

    @Override
    public List<Map<String, String>> getAllCategoryBlogName() throws DataExitsException {
        List<Object[]> results = categoryBlogRepository.findAllCategoryBlogName();

        List<Map<String, String>> categoryList = new ArrayList<>();
        for (Object[] result : results) {
            String categoryBlogId = (String) result[1];
            String categoryBlogName = (String) result[0];

            Map<String, String> categoryMap = new HashMap<>();
            categoryMap.put("categoryBlogId", categoryBlogId);
            categoryMap.put("categoryBlogName", categoryBlogName);

            categoryList.add(categoryMap);
        }

        if (categoryList.isEmpty()) {
            throw new DataExitsException("No categories found");
        }

        return categoryList;
    }


    @Override
    public CategoryBlogResponse getCategoryBlogById(String categoryBlogId) throws DataExitsException {
        CategoryBlog categoryBlog = categoryBlogRepository.findById(categoryBlogId)
                .orElseThrow(() -> new DataExitsException("Category Blog does not exist"));
        return new CategoryBlogResponse(categoryBlog);
    }

    @Override
    public PagedModel<EntityModel<CategoryBlogResponse>> getAllCategoryBlog(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<CategoryBlog> categoryBlogs = categoryBlogRepository.findAll(pageable);
        if (categoryBlogs.isEmpty()) {
            throw new DataExitsException("Category Blog does not exist");
        }
        Page<CategoryBlogResponse> categoryBlogResponses = categoryBlogs.map(CategoryBlogResponse::new);
        return pagedResourcesAssembler.toModel(categoryBlogResponses);
    }

    @Override
    public ApiResponse createCategoryBlog(CategoryBlogRequest request) throws DataExitsException {
        Optional<CategoryBlog> categoryBlog = categoryBlogRepository
                .findByName(request.getCategoryBlogName());
        if (categoryBlog.isPresent()) {
            throw new DataExitsException("Category Blog is already exits");
        }

        CategoryBlog _categoryBlog = CategoryBlog.builder()
                .name(request.getCategoryBlogName())
                .slug(generateSlug(request.getCategoryBlogName()))
                .status(request.getStatus().toUpperCase())
                .displayOrder(request.getDisplayOrder())
                .build();

        categoryBlogRepository.save(_categoryBlog);
        return new ApiResponse("Category Blog is created successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateCategoryBlog(CategoryBlogRequest request) throws DataExitsException {
        CategoryBlog categoryBlog = categoryBlogRepository.findById(request.getCategoryBlogId())
                .orElseThrow(() -> new DataExitsException("Category Blog does not exist"));

        if (!categoryBlog.getName().equals(request.getCategoryBlogName())) {
            Optional<CategoryBlog> existingCategory = categoryBlogRepository
                    .findByName(request.getCategoryBlogName());
            if (existingCategory.isPresent()) {
                throw new DataExitsException("Category Blog name already exists");
            }
            categoryBlog.setName(request.getCategoryBlogName());
            categoryBlog.setSlug(generateSlug(request.getCategoryBlogName()));
        }

        categoryBlog.setStatus(request.getStatus().toUpperCase());
        categoryBlog.setDisplayOrder(request.getDisplayOrder());

        categoryBlogRepository.save(categoryBlog);
        return new ApiResponse("Category Blog is updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse updateThumbnail(MultipartFile file, String CategoryBlogId) throws DataExitsException
            , IOException {
        CategoryBlog categoryBlog = categoryBlogRepository.findById(CategoryBlogId)
                .orElseThrow(() -> new DataExitsException("Category Blog does not exist"));

        var uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("url");

        categoryBlog.setThumbnail(uploadResult.get("url").toString());
        categoryBlogRepository.save(categoryBlog);

        return new ApiResponse(imageUrl, HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteCategoryBlog(String categoryBlogId) throws DataExitsException {
        CategoryBlog categoryBlog = categoryBlogRepository.findById(categoryBlogId)
                .orElseThrow(() -> new DataExitsException("Category Blog does not exist"));
        categoryBlogRepository.delete(categoryBlog);
        return new ApiResponse("Category Blog is deleted successfully", HttpStatus.OK);
    }

    @Override
    public List<CountBlogByCategoryBlogResponse> countBlogByCategoryBlog() throws DataExitsException {
        return categoryBlogRepository.countBlogByCategoryBlog();
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replace(" ", "-");
    }
}
