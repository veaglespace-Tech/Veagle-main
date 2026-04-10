package com.example.VeagleSpaceTech.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {


    @Autowired
    private JavaMailSender mailSender;

// For Login
public void sendOtp(String toEmail, String otp) {

    SimpleMailMessage message = new SimpleMailMessage();

    message.setTo(toEmail);
    message.setSubject("🔐 Secure Login OTP - Veagle Space");

    message.setText(
            "Dear User,\n\n" +
                    "We received a request to log in to your account.\n\n" +
                    "Your One-Time Password (OTP) is: " + otp + "\n\n" +
                    "⏳ This OTP is valid for 5 minutes.\n\n" +
                    "If you did not request this, please ignore this email or contact support immediately.\n\n" +
                    "⚠️ Do not share this OTP with anyone for security reasons.\n\n" +
                    "Best regards,\n" +
                    "Veagle Space Team\n" +
                    "www.veaglespace.com"
    );

    mailSender.send(message);
}


    public void sendEmail(String to, String subject, String text) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }

    // JobApplication Email
    public void sendApplicationEmail(String to, String name, String jobTitle) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Job Application Submitted");

        message.setText(
                "Dear " + name + ",\n\n" +

                        "Thank you for applying for the position of " + jobTitle + " at Veagle Space Tech.\n\n" +

                        "We have successfully received your application. Our team will carefully review your profile, " +
                        "and if your qualifications match our requirements, we will contact you for the next steps.\n\n" +

                        "We appreciate your interest in joining our organization and wish you the best of luck.\n\n" +

                        "Warm regards,\n" +
                        "Hiring Team\n" +
                        "Veagle Space Tech\n" +
                        "Email: hr@veaglespacetech.com\n"
        );

        mailSender.send(message);
    }

    // When Selected
    public void sendSelectedEmail(String to, String name, String jobTitle) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Application Update - Selected");

        message.setText(
                "Dear " + name + ",\n\n" +
                        "We are pleased to inform you that your application for the position of " + jobTitle + " at Veagle Space Tech " +
                        "has been shortlisted for the next stage of our selection process.\n\n" +
                        "After reviewing your profile, our team found your qualifications and experience to be a strong match for this role.\n\n" +
                        "Our recruitment team will be contacting you shortly with further details regarding the next steps.\n\n" +
                        "We appreciate your interest in joining our organization and look forward to speaking with you soon.\n\n" +
                        "Warm regards,\n" +
                        "Hiring Team\n" +
                        "Veagle Space Tech"
        );

        mailSender.send(message);
    }

    // Wehn Deleted
    public void sendRejectedEmail(String to, String name, String jobTitle) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Application Update");

        message.setText(
                "Dear " + name + ",\n\n" +

                        "Thank you for taking the time to apply for the position of " + jobTitle + " at Veagle Space Tech.\n\n" +

                        "We truly appreciate your interest in joining our team. After careful review of your application, " +
                        "we regret to inform you that we will not be proceeding with your application for this role at this time.\n\n" +

                        "Please note that this decision was not easy, as we received applications from many qualified candidates. " +
                        "We encourage you to continue exploring opportunities with us and to apply again in the future if a suitable role arises.\n\n" +

                        "We sincerely wish you success in your career journey and thank you once again for considering Veagle Space Tech.\n\n" +

                        "Warm regards,\n" +
                        "Hiring Team\n" +
                        "Veagle Space Tech"
        );

        mailSender.send(message);
    }


}
