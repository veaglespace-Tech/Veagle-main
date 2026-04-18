package com.example.VeagleSpaceTech.model;

import java.util.concurrent.atomic.AtomicInteger;

public class MailAccount {

    private String email;
    private String password;
    private AtomicInteger count; // ✅ thread-safe

    public MailAccount(String email, String password) {
        this.email = email;
        this.password = password;
        this.count = new AtomicInteger(0);
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public int getCount() {
        return count.get();
    }

    public void incrementCount() {
        count.incrementAndGet(); // ✅ safe increment
    }

    public void resetCount() {
        count.set(0);
    }

    // ✅ helper method (very useful)
    public boolean isAvailable(int limit) {
        return count.get() < limit;
    }
}