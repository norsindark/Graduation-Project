package com.restaurant_management.controllers;

import com.restaurant_management.services.interfaces.UploadFileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "UploadFile", description = "Upload File API")
@RequestMapping("/api/v1/dashboard/upload-file")
public class UploadFileController {

    private final UploadFileService uploadFileService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return new ResponseEntity<>(uploadFileService.uploadFile(file), HttpStatus.OK);
    }
}
