package com.restaurant_management.services.impls;

import com.restaurant_management.services.interfaces.UploadFileService;
import com.restaurant_management.utils.ImgBBUploaderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Component
@RequiredArgsConstructor
public class UploadFileImplService implements UploadFileService {

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        ImgBBUploaderUtil imgBBUploaderUtil = new ImgBBUploaderUtil();
        return imgBBUploaderUtil.uploadImage(file);
    }

}
