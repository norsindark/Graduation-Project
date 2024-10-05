package com.restaurant_management.services.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UploadFileService {

    String uploadFile(MultipartFile file) throws IOException;
}
