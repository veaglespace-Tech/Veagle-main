package com.example.VeagleSpaceTech.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    public void saveOtp(String email, String otp) {
        otpStorage.put(email, new OtpData(otp, System.currentTimeMillis() + 5 * 60 * 1000)); // 5 min
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpStorage.get(email);

        if (data == null) return false;

        // check expiry
        if (System.currentTimeMillis() > data.expiryTime) {
            otpStorage.remove(email);
            return false;
        }

        boolean isValid = data.otp.equals(otp);

        if (isValid) {
            otpStorage.remove(email); // one-time use
        }

        return isValid;
    }

    static class OtpData {
        String otp;
        long expiryTime;

        public OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}