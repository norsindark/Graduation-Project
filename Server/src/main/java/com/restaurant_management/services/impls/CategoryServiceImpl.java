package com.restaurant_management.services.impls;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.restaurant_management.dtos.CategoryDto;
import com.restaurant_management.entites.Category;
import com.restaurant_management.enums.StatusType;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.payloads.responses.CategoryResponse;
import com.restaurant_management.repositories.CategoryRepository;
import com.restaurant_management.services.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.Normalizer;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Component
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final PagedResourcesAssembler<CategoryResponse> pagedResourcesAssembler;

    private final Cloudinary cloudinary;

    @Override
    public CategoryResponse getCategoryById(String id) throws DataExitsException {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) {
            throw new DataExitsException("Category not found");
        }
        return new CategoryResponse(category.get());
    }

    @Override
    public PagedModel<EntityModel<CategoryResponse>> getAllCategories(int pageNo, int pageSize, String sortBy, String sortDir)
            throws DataExitsException {
        Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));

        Page<Category> pagedResult = categoryRepository.findAll(paging);
        if (pagedResult.hasContent()) {
            return pagedResourcesAssembler.toModel(pagedResult.map(CategoryResponse::new));
        } else {
            throw new DataExitsException("No Category found");
        }
    }

    @Override
    public ApiResponse addCategory(CategoryDto categoryDto) throws DataExitsException {
        Optional<Category> existingCategory = categoryRepository.findByName(categoryDto.getName());
        if (existingCategory.isPresent()) {
            throw new DataExitsException("Category already exists");
        }

        String slug = generateSlug(categoryDto.getName());

        Category parentCategory = null;
        if (categoryDto.getParentId() != null) {
            Optional<Category> parentCategoryOpt = categoryRepository.findById(categoryDto.getParentId());
            if (parentCategoryOpt.isPresent()) {
                parentCategory = parentCategoryOpt.get();
            } else {
                throw new DataExitsException("Parent category not found");
            }
        }

        Category newCategory = new Category();
        newCategory.setName(categoryDto.getName());
        newCategory.setStatus(StatusType.INACTIVE.toString());
        newCategory.setSlug(slug);
        newCategory.setParentCategory(parentCategory);
        newCategory.setDescription(categoryDto.getDescription());
        categoryRepository.save(newCategory);
        return new ApiResponse("Category added successfully", HttpStatus.CREATED);
    }


    @Override
    public ApiResponse updateCategory(CategoryDto categoryDto) throws DataExitsException {
        Optional<Category> category = categoryRepository.findById(categoryDto.getId());
        if (category.isEmpty()) {
            throw new DataExitsException("Category not found");
        }

        Optional<Category> categoryByName = categoryRepository.findByName(categoryDto.getName());
        if (categoryByName.isPresent() && !categoryByName.get().getId().equals(categoryDto.getId())) {
            throw new DataExitsException(categoryDto.getName() + " already exists");
        }

        StatusType status = StatusType.valueOf(categoryDto.getStatus());

        Category existingCategory = category.get();
        existingCategory.setName(categoryDto.getName());
        existingCategory.setStatus(status.toString());
        existingCategory.setSlug(categoryDto.getSlug());
        existingCategory.setDescription(categoryDto.getDescription());

        if (categoryDto.getParentId() != null) {
            Optional<Category> parentCategoryOpt = categoryRepository.findById(categoryDto.getParentId());
            if (parentCategoryOpt.isPresent()) {
                existingCategory.setParentCategory(parentCategoryOpt.get());
            } else {
                throw new DataExitsException("Parent category not found");
            }
        } else {
            existingCategory.setParentCategory(null);
        }

        categoryRepository.save(existingCategory);
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
