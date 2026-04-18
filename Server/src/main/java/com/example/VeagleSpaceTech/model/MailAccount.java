package com.example.VeagleSpaceTech.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MailAccount {

    private String email;
    private String password;

    // store timestamps of sent emails
    private List<Long> sentTimestamps = Collections.synchronizedList(new ArrayList<>());

    public MailAccount(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() { return email; }
    public String getPassword() { return password; }

    // ✅ check availability (last 24 hours)
    public synchronized boolean isAvailable(int limit) {

        long now = System.currentTimeMillis();
        long window = 24 * 60 * 60 * 1000;

        sentTimestamps.removeIf(t -> now - t > window);

        return sentTimestamps.size() < limit;
    }

    // ✅ add new send
    public void incrementCount() {
        sentTimestamps.add(System.currentTimeMillis());
    }
}