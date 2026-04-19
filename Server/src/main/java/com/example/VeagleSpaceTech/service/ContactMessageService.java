package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ContactRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ContactResponseDTO;
import com.example.VeagleSpaceTech.config.AppProperties;
import com.example.VeagleSpaceTech.entity.ContactMessage;
import com.example.VeagleSpaceTech.mapper.ContactMapper;
import com.example.VeagleSpaceTech.repo.ContactMessageRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ContactMessageService {

	@Autowired
    private ContactMessageRepo repo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AppProperties appProperties;

 // Get All Messages
 public List<ContactResponseDTO> getContactMessages() {

     return repo.findAll()
             .stream()
             .map(ContactMapper::toDTO)
             .toList();
 }
    // Fetch Only UnRead Msgess
    public List<ContactResponseDTO> getUnreadContactMessages() {

        return repo.findByIsReadFalse()
                .stream()
                .map(ContactMapper::toDTO)
                .toList();
    }

    // Message From Users Clients
    public void addContactMessage(ContactRequestDTO request) {

        ContactMessage contactMessage = ContactMapper.toEntity(request);

        repo.save(contactMessage);

        // 📧 Email
        String subject = "📩 New Contact - " + request.service();

        String body =
                "Name: " + request.name() + "\n" +
                        "Email: " + request.email() + "\n" +
                        "Phone: " + request.phone() + "\n" +
                        "Company: " + request.company() + "\n" +
                        "Service: " + request.service() + "\n" +
                        "Budget: " + request.budget() + "\n" +
                        "Timeline: " + request.timeline() + "\n\n" +
                        "Message:\n" + request.message();

        sendToAdmins(subject, body);
    }

    // method to send mails to admin
    private void sendToAdmins(String subject, String body) {

        for (String admin : appProperties.getAdminEmails()) {
            emailService.sendEmailToHrAndAdmin(admin, subject, body);
        }

    }

    public void deleteContactMessage(Long id) {
        repo.deleteById(id);
    }

    // MarkAs a Read
    public void markAsRead(Long id) {

        ContactMessage msg = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));

        msg.setRead(true);   // IMPORTANT (not setIsRead)

        repo.save(msg);
    }

}
