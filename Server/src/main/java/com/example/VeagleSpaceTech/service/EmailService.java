package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.config.MailProperties;
import com.example.VeagleSpaceTech.model.MailAccount;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Properties;

@Service
public class EmailService {

    private List<MailAccount> otpAccounts;
    private List<MailAccount> careerAccounts;
    private List<MailAccount> supportAccounts;

    private final int LIMIT = 2;

    // ================= INIT =================
    @Autowired
    private MailProperties mailProperties;

    @PostConstruct
    public void init() {

        otpAccounts = mailProperties.getOtp().stream()
                .map(acc -> new MailAccount(acc.getEmail(), acc.getPassword()))
                .toList();

        careerAccounts = mailProperties.getCareers().stream()
                .map(acc -> new MailAccount(acc.getEmail(), acc.getPassword()))
                .toList();

        supportAccounts = mailProperties.getSupport().stream()
                .map(acc -> new MailAccount(acc.getEmail(), acc.getPassword()))
                .toList();
    }

    // ================= COMMON METHODS =================

    private MailAccount getAvailableAccount(List<MailAccount> accounts) {
        for (MailAccount acc : accounts) {
            if (acc.isAvailable(LIMIT)) {
                return acc;
            }
        }
        throw new RuntimeException("All email limits reached");
    }

    private JavaMailSender createSender(MailAccount acc) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        sender.setHost("smtp.hostinger.com");
        sender.setPort(465);
        sender.setUsername(acc.getEmail());
        sender.setPassword(acc.getPassword());

        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", true);
        props.put("mail.smtp.ssl.enable", true);

        return sender;
    }

    // ================= OTP =================

    public void sendOtp(String toEmail, String otp) {

        MailAccount acc = getAvailableAccount(otpAccounts);
        JavaMailSender sender = createSender(acc);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Veagle Security <" + acc.getEmail() + ">");
        message.setTo(toEmail);
        message.setSubject("🔐 Secure Login OTP - Veagle Space");

        message.setText(
                "Dear User,\n\n" +
                        "Your OTP is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request this, please ignore.\n\n" +
                        "Regards,\n" +
                        "Veagle Space Team"
        );

        sender.send(message);
        acc.incrementCount();
    }

    // ================= JOB EMAILS =================

    public void sendApplicationEmail(String to, String name, String jobTitle) {

        MailAccount acc = getAvailableAccount(careerAccounts);
        JavaMailSender sender = createSender(acc);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Veagle Hiring Team <" + acc.getEmail() + ">");
        message.setTo(to);
        message.setSubject("Application Received - " + jobTitle);

        message.setText(
                "Dear " + name + ",\n\n" +
                        "Thank you for applying for the position of " + jobTitle + ".\n\n" +
                        "We have received your application and our team will review it shortly.\n\n" +
                        "We will contact you if shortlisted.\n\n" +
                        "Best regards,\n" +
                        "Hiring Team\n" +
                        "Veagle Space"
        );

        sender.send(message);
        acc.incrementCount();
    }

    public void sendSelectedEmail(String to, String name, String jobTitle) {

        MailAccount acc = getAvailableAccount(careerAccounts);
        JavaMailSender sender = createSender(acc);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Veagle Hiring Team <" + acc.getEmail() + ">");
        message.setTo(to);
        message.setSubject("Congratulations! You’re Selected 🎉");

        message.setText(
                "Dear " + name + ",\n\n" +
                        "Congratulations! You have been shortlisted for the position of " + jobTitle + ".\n\n" +
                        "Our team will contact you soon for the next steps.\n\n" +
                        "We look forward to speaking with you.\n\n" +
                        "Best regards,\n" +
                        "Hiring Team\n" +
                        "Veagle Space"
        );

        sender.send(message);
        acc.incrementCount();
    }

    public void sendRejectedEmail(String to, String name, String jobTitle) {

        MailAccount acc = getAvailableAccount(careerAccounts);
        JavaMailSender sender = createSender(acc);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Veagle Hiring Team <" + acc.getEmail() + ">");
        message.setTo(to);
        message.setSubject("Application Update - " + jobTitle);

        message.setText(
                "Dear " + name + ",\n\n" +
                        "Thank you for applying for the position of " + jobTitle + ".\n\n" +
                        "After careful review, we regret to inform you that we will not proceed with your application.\n\n" +
                        "We encourage you to apply again in the future.\n\n" +
                        "Best wishes,\n" +
                        "Hiring Team\n" +
                        "Veagle Space"
        );

        sender.send(message);
        acc.incrementCount();
    }

    // Send Mail To support Team

    public void sendEmailToHrAndAdmin(String to, String subject, String text) {

        MailAccount acc = getAvailableAccount(supportAccounts); // ✅ use support emails
        JavaMailSender sender = createSender(acc);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("Veagle Support <" + acc.getEmail() + ">");
        message.setTo(to); // HR / admin email
        message.setSubject(subject);
        message.setText(text);

        sender.send(message);
        acc.incrementCount();

        System.out.println("📩 Support email sent to HR/Admin using: " + acc.getEmail());
    }


    public void sendSupportConfirmation(String to, String subject, String text) {

        MailAccount acc = getAvailableAccount(supportAccounts); // ✅ same support pool
        JavaMailSender sender = createSender(acc);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("Veagle Support <" + acc.getEmail() + ">");
        message.setTo(to); // user email
        message.setSubject(subject);
        message.setText(text);

        sender.send(message);
        acc.incrementCount();

        System.out.println("📧 Confirmation email sent to user using: " + acc.getEmail());
    }



}