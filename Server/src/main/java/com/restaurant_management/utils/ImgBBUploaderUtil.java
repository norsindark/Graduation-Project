package com.restaurant_management.utils;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.*;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ImgBBUploaderUtil {

    private static final String URL = "https://api.imgbb.com/1/upload";
    private final OkHttpClient client;

    public ImgBBUploaderUtil() {
        this.client = new OkHttpClient();
    }

    public Map<String, String> uploadImage(MultipartFile file) throws IOException {
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
            JsonObject data = jsonObject.getAsJsonObject("data");

            String imageUrl = data.get("url").getAsString();
            String deleteUrl = data.get("delete_url").getAsString();

            Map<String, String> result = new HashMap<>();
            result.put("imageUrl", imageUrl);
            result.put("deleteUrl", deleteUrl);

            return result;
        }
    }


    public boolean deleteImage(String deleteUrl) throws IOException {
        Request request = new Request.Builder()
                .url(deleteUrl)
                .delete()
                .build();

        try (Response response = client.newCall(request).execute()) {
            return response.isSuccessful();
        } catch (IOException e) {
            throw new IOException("Error occurred while deleting image from ImgBB", e);
        }
    }
}
