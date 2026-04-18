package com.example.VeagleSpaceTech.config;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "veagle.mail")
public class MailProperties {

    private List<Account> otp;
    private List<Account> careers;

    public static class Account {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public List<Account> getOtp() { return otp; }
    public void setOtp(List<Account> otp) { this.otp = otp; }

    public List<Account> getCareers() { return careers; }
    public void setCareers(List<Account> careers) { this.careers = careers; }


    // Support Mails To Send Hr and Support Team
    private List<Account> support;

    public List<Account> getSupport() { return support; }
    public void setSupport(List<Account> support) { this.support = support; }
}