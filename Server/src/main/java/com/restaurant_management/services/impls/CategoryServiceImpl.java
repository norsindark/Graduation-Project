package com.restaurant_management.services.impls;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.restaurant_management.dtos.CategoryDto;
import com.restaurant_management.dtos.SubCategoryDto;
import com.restaurant_management.entites.Category;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.requests.CategoryRequest;
import com.restaurant_management.payloads.requests.SubCategoryRequest;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryResponse;
import com.restaurant_management.repositories.CategoryRepository;
import com.restaurant_management.services.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.Normalizer;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Component
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final PagedResourcesAssembler<CategoryResponse> pagedResourcesAssembler;

    private final Cloudinary cloudinary;

    @Override
    public CategoryResponse getCategoryById(String id) throws DataExitsException {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            throw new DataExitsException("Category not found");
        }

        Category category = categoryOptional.get();

        List<Category> subCategories = categoryRepository.findByParentCategory(category);

        CategoryResponse categoryResponse = new CategoryResponse(category);
        categoryResponse.setSubCategories(subCategories.stream()
                .map(CategoryResponse::new)
                .collect(Collectors.toList()));

        return categoryResponse;
    }


    @Override
    public PagedModel<EntityModel<CategoryResponse>> getAllCategories(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<Category> parentCategories = categoryRepository.findAllParentCategories(paging);

        if (parentCategories.hasContent()) {
            List<CategoryResponse> categoryResponses = parentCategories.stream()
                    .map(parent -> {
                        List<Category> subCategories = categoryRepository.findSubCategoriesByParentId(parent.getId());
                        CategoryResponse categoryResponse = new CategoryResponse(parent);
                        categoryResponse.setSubCategories(subCategories.stream()
                                .map(CategoryResponse::new)
                                .collect(Collectors.toList()));

                        return categoryResponse;
                    })
                    .collect(Collectors.toList());
            Page<CategoryResponse> responsePage = new PageImpl<>(categoryResponses, paging, parentCategories.getTotalElements());
            return pagedResourcesAssembler.toModel(responsePage);
        } else {
            throw new DataExitsException("No Category found");
        }
    }

    @Override
    @Transactional
    public ApiResponse addCategory(CategoryDto categoryDto) throws DataExitsException {
        Optional<Category> existingCategory = categoryRepository.findByName(categoryDto.getName());
        if (existingCategory.isPresent()) {
            throw new DataExitsException("Category already exists");
        }

        String slug = generateSlug(categoryDto.getName());
        StatusType status = StatusType.valueOf(categoryDto.getStatus());

        Category newCategory = new Category();
        newCategory.setName(categoryDto.getName());
        newCategory.setStatus(status.toString());
        newCategory.setSlug(slug);
        newCategory.setDescription(categoryDto.getDescription());

        categoryRepository.save(newCategory);

        if (categoryDto.getSubCategories() != null && !categoryDto.getSubCategories().isEmpty()) {
            addSubCategories(newCategory, categoryDto.getSubCategories());
        }

        return new ApiResponse("Category added successfully", HttpStatus.CREATED);
    }

    @Transactional
    private void addSubCategories(Category parentCategory, List<SubCategoryDto> subCategoriesDto) {
        for (SubCategoryDto subCategoryDto : subCategoriesDto) {
            String subCategorySlug = generateSlug(subCategoryDto.getName());
            StatusType subCategoryStatus = StatusType.valueOf(subCategoryDto.getStatus());

            Category subCategory = new Category();
            subCategory.setName(subCategoryDto.getName());
            subCategory.setStatus(subCategoryStatus.toString());
            subCategory.setSlug(subCategorySlug);
            subCategory.setDescription(subCategoryDto.getDescription());
            subCategory.setParentCategory(parentCategory);

            categoryRepository.save(subCategory);
        }
    }

    @Override
    @Transactional
    public ApiResponse updateCategory(CategoryRequest request) throws DataExitsException {
        Optional<Category> categoryOpt = categoryRepository.findById(request.getId());
        if (categoryOpt.isEmpty()) {
            throw new DataExitsException("Category not found");
        }

        Optional<Category> categoryByName = categoryRepository.findByName(request.getName());
        if (categoryByName.isPresent() && !categoryByName.get().getId().equals(request.getId())) {
            throw new DataExitsException("Category " + request.getName() + " already exists");
        }

        StatusType status;
        try {
            status = StatusType.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new DataExitsException("Invalid status: " + request.getStatus());
        }

        Category existingCategory = categoryOpt.get();
        existingCategory.setName(request.getName());
        existingCategory.setStatus(status.toString());
        existingCategory.setSlug(request.getSlug());
        existingCategory.setDescription(request.getDescription());
        categoryRepository.save(existingCategory);

        if (request.getSubCategories() != null) {
            for (SubCategoryRequest subCategoryRequest : request.getSubCategories()) {
                if (subCategoryRequest.getId() != null) {
                    Optional<Category> subCategoryOpt = categoryRepository.findById(subCategoryRequest.getId());
                    if (subCategoryOpt.isPresent()) {
                        Category subCategory = subCategoryOpt.get();
                        subCategory.setName(subCategoryRequest.getName());
                        subCategory.setStatus(subCategoryRequest.getStatus());
                        subCategory.setSlug(subCategoryRequest.getSlug());
                        subCategory.setDescription(subCategoryRequest.getDescription());
                        categoryRepository.save(subCategory);
                    }
                } else {

                    Optional<Category> newSubCategoryOpt = categoryRepository.findByName(subCategoryRequest.getName());
                    if (newSubCategoryOpt.isPresent()) {
                        throw new DataExitsException("Subcategory " + subCategoryRequest.getName() + " already exists");
                    }

                    Timestamp timestamp = new Timestamp(System.currentTimeMillis());

                    Category newSubCategory = new Category();
                    newSubCategory.setName(subCategoryRequest.getName());
                    newSubCategory.setStatus(subCategoryRequest.getStatus());
                    newSubCategory.setSlug(subCategoryRequest.getSlug());
                    newSubCategory.setDescription(subCategoryRequest.getDescription());
                    newSubCategory.setCreatedAt(timestamp);

                    categoryRepository.save(newSubCategory);

                    newSubCategory.setParentCategory(existingCategory);
                    categoryRepository.save(newSubCategory);
                }
            }
        }
        return new ApiResponse("Category updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse updateThumbnail(MultipartFile file, String id) throws DataExitsException, IOException {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) {
            throw new DataExitsException("Category not found");
        }
        var uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("url");

        Category _category = category.get();
        _category.setThumbnail(imageUrl);
        this.categoryRepository.save(_category);
        return new ApiResponse("Image updated successfully!", HttpStatus.OK);
    }

    @Override
    @Modifying
    public ApiResponse deleteCategory(String id) throws DataExitsException {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) {
            throw new DataExitsException("Category not found");
        }
        categoryRepository.deleteById(id);
        return new ApiResponse("Category deleted successfully", HttpStatus.OK);
    }

    private String generateSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "")
                .replaceAll("[^\\w\\s-]", "")
                .replaceAll("\\s+", "-")
                .toLowerCase();
    }
}
