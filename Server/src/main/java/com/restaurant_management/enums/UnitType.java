package com.restaurant_management.enums;

import lombok.Getter;

@Getter
public enum UnitType {
    GRAM("g", 1.0),
    KILOGRAM("kg", 1000.0),
    LITER("l", 1.0),
    MILLILITER("ml", 0.001),
    PIECE("piece", 1.0);

    private final String unit;
    private final Double conversionFactorToGram;

    UnitType(String unit, Double conversionFactorToGram) {
        this.unit = unit;
        this.conversionFactorToGram = conversionFactorToGram;
    }

    public static double convert(double quantity, UnitType fromUnit, UnitType toUnit) {
        double quantityInGrams = quantity * fromUnit.getConversionFactorToGram();
        return quantityInGrams / toUnit.getConversionFactorToGram();
    }

    public static UnitType fromString(String unit) {
        for (UnitType unitType : UnitType.values()) {
            if (unitType.getUnit().equalsIgnoreCase(unit)) {
                return unitType;
            }
        }
        throw new IllegalArgumentException("Unknown unit: " + unit);
    }
}