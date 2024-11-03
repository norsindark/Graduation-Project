package com.restaurant_management.services.impls;

import com.restaurant_management.dtos.LocationRestaurantDto;
import com.restaurant_management.entites.LocationRestaurant;
import com.restaurant_management.exceptions.DataExitsException;
import com.restaurant_management.payloads.responses.ApiResponse;
import com.restaurant_management.repositories.LocationRestaurantRepository;
import com.restaurant_management.services.interfaces.LocationRestaurantService;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LocationRestaurantServiceImpl implements LocationRestaurantService {

    private final LocationRestaurantRepository locationRestaurantRepository;

    @Value("${geocoding.api.key}")
    private String geocodingApiKey;

    @Override
    public LocationRestaurant getLocation() throws DataExitsException {
        return locationRestaurantRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new DataExitsException("Location not found"));
    }

    @Override
    public ApiResponse createLocation(LocationRestaurantDto locationRestaurantDto) {
        String address = String.format("%s, %s, %s, %s, %s, %s",
                locationRestaurantDto.getStreet(),
                locationRestaurantDto.getCommune(),
                locationRestaurantDto.getDistrict(),
                locationRestaurantDto.getCity(),
                locationRestaurantDto.getState(),
                locationRestaurantDto.getCountry()
        );

        Map<String, Double> coordinates = getCoordinatesFromAddress(address);
        LocationRestaurant location = LocationRestaurant.builder()
                .street(locationRestaurantDto.getStreet())
                .commune(locationRestaurantDto.getCommune())
                .district(locationRestaurantDto.getDistrict())
                .city(locationRestaurantDto.getCity())
                .state(locationRestaurantDto.getState())
                .country(locationRestaurantDto.getCountry())
                .latitude(coordinates.get("latitude"))
                .longitude(coordinates.get("longitude"))
                .feePerKm(locationRestaurantDto.getFeePerKm())
                .build();

        locationRestaurantRepository.save(location);

        return new ApiResponse("Location created successfully", HttpStatus.CREATED);
    }

    @Override
    public ApiResponse updateLocation(LocationRestaurantDto locationRestaurantDto) throws DataExitsException {
        LocationRestaurant location = locationRestaurantRepository.findById(locationRestaurantDto.getId())
                .orElseThrow(() -> new DataExitsException("Location not found"));

        location.setStreet(locationRestaurantDto.getStreet());
        location.setCommune(locationRestaurantDto.getCommune());
        location.setDistrict(locationRestaurantDto.getDistrict());
        location.setCity(locationRestaurantDto.getCity());
        location.setState(locationRestaurantDto.getState());
        location.setCountry(locationRestaurantDto.getCountry());
        location.setFeePerKm(locationRestaurantDto.getFeePerKm());

        String address = String.format("%s, %s, %s, %s, %s, %s",
                locationRestaurantDto.getStreet(),
                locationRestaurantDto.getCommune(),
                locationRestaurantDto.getDistrict(),
                locationRestaurantDto.getCity(),
                locationRestaurantDto.getState(),
                locationRestaurantDto.getCountry()
        );

        Map<String, Double> coordinates = getCoordinatesFromAddress(address);
        location.setLatitude(coordinates.get("latitude"));
        location.setLongitude(coordinates.get("longitude"));

        locationRestaurantRepository.save(location);

        return new ApiResponse("Location updated successfully", HttpStatus.OK);
    }

    @Override
    public ApiResponse deleteLocation(String id) throws DataExitsException {
        LocationRestaurant location = locationRestaurantRepository.findById(id)
                .orElseThrow(() -> new DataExitsException("Location not found"));
        locationRestaurantRepository.delete(location);
        return new ApiResponse("Location deleted successfully", HttpStatus.OK);
    }

    private Map<String, Double> getCoordinatesFromAddress(String address) {
        String url = String.format("https://api.distancematrix.ai/maps/api/geocode/json?address=%s&key=%s",
                address.replace(" ", "+"), geocodingApiKey);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Geocoding failed");
        }

        String responseBody = response.getBody();
        JSONObject jsonResponse = new JSONObject(responseBody);

        if (jsonResponse.getString("status").equals("OK")) {
            JSONArray results = jsonResponse.getJSONArray("result");

            if (results.isEmpty()) {
                throw new RuntimeException("No results found");
            }

            JSONObject geometry = results.getJSONObject(0).getJSONObject("geometry");
            double latitude = geometry.getJSONObject("location").getDouble("lat");
            double longitude = geometry.getJSONObject("location").getDouble("lng");

            Map<String, Double> coordinates = new HashMap<>();
            coordinates.put("latitude", latitude);
            coordinates.put("longitude", longitude);
            return coordinates;
        } else {
            throw new RuntimeException("Geocoding failed: " + jsonResponse.getString("status"));
        }
    }
}
