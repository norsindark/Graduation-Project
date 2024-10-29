package com.restaurant_management.services.impls;

import com.restaurant_management.entites.LocationRestaurant;
import com.restaurant_management.payloads.responses.GeocodingResponse;
import com.restaurant_management.repositories.LocationRestaurantRepository;
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
    private final LocationRestaurantRepository locationRestaurantRepository;

    @Value("${openCage.api.key}")
    private String API_KEY;

    @Override
    public GeocodingResponse getCoordinates(String address) {
        LocationRestaurant locationRestaurant = locationRestaurantRepository.findAll().getFirst();
        if (locationRestaurant == null) {
            throw new RuntimeException("No restaurant location found");
        }

        double lat1 = locationRestaurant.getLatitude();
        double lon1 = locationRestaurant.getLongitude();

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
        double lat2 = geometry.getDouble("lat");
        double lon2 = geometry.getDouble("lng");

        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        double fee = calculateFee(distance, locationRestaurant.getFeePerKm());

        return GeocodingResponse.builder()
                .from(locationRestaurant.getStreet() + ", " +
                                locationRestaurant.getCommune() + ", " +
                                locationRestaurant.getDistrict() + ", " +
                                locationRestaurant.getCity() + ", " +
                                locationRestaurant.getCountry())
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

    private double calculateFee(double distance, double ratePerKm) {
        final double baseRate = 10000;
        return baseRate + (distance * ratePerKm);
    }
}