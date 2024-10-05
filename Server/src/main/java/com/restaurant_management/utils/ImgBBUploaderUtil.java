package com.restaurant_management.utils;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.*;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class ImgBBUploaderUtil {

    private static final String URL = "https://api.imgbb.com/1/upload";
    private final OkHttpClient client;

    public ImgBBUploaderUtil() {
        this.client = new OkHttpClient();
    }

    public String uploadImage(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();
        String API_KEY = "dbafecb8223549d55c292838ce7c5fad";

        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("key", API_KEY)
                .addFormDataPart("image", file.getOriginalFilename(),
                        RequestBody.create(fileBytes, MediaType.parse("image/jpeg")))
                .build();

        Request request = new Request.Builder()
                .url(URL)
                .post(requestBody)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String jsonResponse = response.body() != null ? response.body().string() : null;
            JsonObject jsonObject = JsonParser.parseString(jsonResponse).getAsJsonObject();
            return jsonObject.getAsJsonObject("data").get("url").getAsString();
        }
    }
}
