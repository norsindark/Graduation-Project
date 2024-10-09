package com.restaurant_management.services.impls;

import com.restaurant_management.entites.DishImage;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.repositories.DishImageRepository;
import com.restaurant_management.services.interfaces.DishImageService;
import com.restaurant_management.utils.ImgBBUploaderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class DishImageServiceImpl implements DishImageService {
    private final DishImageRepository dishImageRepository;
    private final ImgBBUploaderUtil imgBBUploaderUtil;

    @Override
    public ApiResponse deleteDishImage(String id) throws DataExitsException, IOException {
        DishImage dishImage = dishImageRepository.findById(id)
                .orElseThrow(() -> new DataExitsException("Dish image not found"));
        boolean isDeletedFromImgBB = imgBBUploaderUtil.deleteImage(dishImage.getDeleteUrl());
        if (isDeletedFromImgBB) {
            dishImageRepository.delete(dishImage);
            return new ApiResponse("Dish image deleted successfully", HttpStatus.OK);
        } else {
            throw new IOException("Failed to delete image from ImgBB");
        }
    }

}
