package com.restaurant_management.services.interfaces;

import com.restaurant_management.payloads.responses.GeocodingResponse;

public interface GeocodingService {
    GeocodingResponse getCoordinates(String address);
}
