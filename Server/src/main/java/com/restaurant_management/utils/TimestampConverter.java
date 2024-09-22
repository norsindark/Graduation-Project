package com.restaurant_management.utils;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class TimestampConverter {

    private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public static Timestamp convertStringToTimestamp(String dateStr) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        return new Timestamp(sdf.parse(dateStr).getTime());
    }
}
