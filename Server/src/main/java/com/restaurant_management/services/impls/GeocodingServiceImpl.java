package com.restaurant_management.services.impls;

import com.restaurant_management.payloads.responses.GeocodingResponse;
import com.restaurant_management.repositories.UserRepository;
import com.restaurant_management.services.interfaces.GeocodingService;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GeocodingServiceImpl implements GeocodingService {
    private final UserRepository userRepository;

    @Value("${openCage.api.key}")
    private String API_KEY;

    @Value("${fixedLat}")
    private double fixedLat;

    @Value("${fixedLng}")
    private double fixedLng;

    @Override
    public GeocodingResponse getCoordinates(String address) {
        String url = String.format("https://api.opencagedata.com/geocode/v1/json?q=%s&key=%s", address, API_KEY);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Geocoding failed");
        }

        String responseBody = response.getBody();
        JSONObject jsonResponse = new JSONObject(responseBody);
        JSONArray results = jsonResponse.getJSONArray("results");

        if (results.isEmpty()) {
            throw new RuntimeException("No results found");
        }

        JSONObject geometry = results.getJSONObject(0).getJSONObject("geometry");
        double lat = geometry.getDouble("lat");
        double lng = geometry.getDouble("lng");

        double distance = calculateDistance(lat, lng, fixedLat, fixedLng);
        double fee = calculateFee(distance);

        return GeocodingResponse.builder()
                .from("227/97 Hà Huy Tập, Buôn Ma Thuôt, Đắk Lắk, Việt Nam")
                .to(address)
                .distance(String.format("%.2f km", distance))
                .fee(String.format("%.2f VND", fee))
                .build();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double calculateFee(double distance) {
        final double baseRate = 10000;
        final double ratePerKm = 3000;
        return baseRate + (distance * ratePerKm);
    }
}
