package com.restaurant_management.services.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface UploadFileService {

    Map<String, String> uploadFile(MultipartFile file) throws IOException;
}
