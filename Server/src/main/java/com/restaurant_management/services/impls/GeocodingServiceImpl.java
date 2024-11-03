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

    @Value("${distancematrix.api.key}")
    private String distanceMatrixApiKey;

    @Value("${geocoding.api.key}")
    private String geocodingApiKey;

    @Override
    public GeocodingResponse getCoordinates(String address) {
        LocationRestaurant locationRestaurant = locationRestaurantRepository.findAll().getFirst();
        if (locationRestaurant == null) {
            throw new RuntimeException("No restaurant location found");
        }

        String geocodeUrl = String.format("https://api.distancematrix.ai/maps/api/geocode/json?address=%s&key=%s",
                address.replace(" ", "+"), geocodingApiKey);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> geocodeResponse = restTemplate.getForEntity(geocodeUrl, String.class);

        if (!geocodeResponse.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Geocoding failed: " + geocodeResponse.getStatusCode());
        }

        String geocodeResponseBody = geocodeResponse.getBody();
        JSONObject geocodeJsonResponse = new JSONObject(geocodeResponseBody);

        if (!geocodeJsonResponse.getString("status").equals("OK")) {
            throw new RuntimeException("Geocoding failed: " + geocodeJsonResponse.getString("status"));
        }

        JSONArray geocodeResults = geocodeJsonResponse.getJSONArray("result");

        if (geocodeResults.isEmpty()) {
            throw new RuntimeException("No results found for address");
        }

        JSONObject geometry = geocodeResults.getJSONObject(0).getJSONObject("geometry");
        double lat2 = geometry.getJSONObject("location").getDouble("lat");
        double lon2 = geometry.getJSONObject("location").getDouble("lng");

        String distanceUrl = String.format("https://api.distancematrix.ai/maps/api/distancematrix/json?origins=%f,%f&destinations=%f,%f&key=%s",
                locationRestaurant.getLatitude(), locationRestaurant.getLongitude(), lat2, lon2, distanceMatrixApiKey);

        ResponseEntity<String> distanceResponse = restTemplate.getForEntity(distanceUrl, String.class);

        if (!distanceResponse.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Distance Matrix API call failed: " + distanceResponse.getStatusCode());
        }

        String distanceResponseBody = distanceResponse.getBody();
        JSONObject distanceJsonResponse = new JSONObject(distanceResponseBody);
        JSONArray distanceResults = distanceJsonResponse.getJSONArray("rows");

        if (distanceResults.isEmpty()) {
            throw new RuntimeException("No distance results found");
        }

        JSONObject elements = distanceResults.getJSONObject(0).getJSONArray("elements").getJSONObject(0);
        if (!elements.getString("status").equals("OK")) {
            throw new RuntimeException("Distance Matrix API returned an error: " + elements.getString("status"));
        }

        String distanceText = elements.getJSONObject("distance").getString("text");
        double distanceValue = elements.getJSONObject("distance").getDouble("value");
        String durationText = elements.getJSONObject("duration").getString("text");

        double fee = calculateFee(distanceValue / 1000, locationRestaurant.getFeePerKm());

        return GeocodingResponse.builder()
                .from(locationRestaurant.getStreet() + ", " +
                        locationRestaurant.getCommune() + ", " +
                        locationRestaurant.getDistrict() + ", " +
                        locationRestaurant.getCity() + ", " +
                        locationRestaurant.getCountry())
                .to(address)
                .distance(distanceText)
                .fee(String.format("%.2f VND", fee))
                .duration(durationText)
                .build();
    }

    private double calculateFee(double distance, double ratePerKm) {
        final double baseRate = 10000;
        return baseRate + (distance * ratePerKm);
    }
}
