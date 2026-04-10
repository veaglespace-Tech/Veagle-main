package com.example.VeagleSpaceTech.service;

import com.example.VeagleSpaceTech.DTO.request.ContactRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ContactResponseDTO;
import com.example.VeagleSpaceTech.entity.ContactMessage;
import com.example.VeagleSpaceTech.repo.ContactMessageRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepo repo;

 // Get All Messages
    public  List<ContactResponseDTO> getContactMessages() {
            return repo.findAll().stream()
                    .map(mess-> new ContactResponseDTO(
                            mess.getId(),
                            mess.getName(),
                            mess.getEmail(),
                            mess.getContact(),
                            mess.getSubject(),
                            mess.getMessage(),
                            mess.isRead(),
                            mess.getCreatedAt()
                            ))
                    .toList();
    }

    // Fetch Only UnRead Msgess
    public List<ContactResponseDTO> getUnreadContactMessages() {

        return repo.findByIsReadFalse()
                .stream()
                .map(msg -> new ContactResponseDTO(
                        msg.getId(),
                        msg.getName(),
                        msg.getEmail(),
                        msg.getContact(),
                        msg.getSubject(),
                        msg.getMessage(),
                        msg.isRead(),
                        msg.getCreatedAt()
                ))
                .toList();
    }

    public void addContactMessage(ContactRequestDTO request) {

        ContactMessage contactMessage = new ContactMessage();

        contactMessage.setName(request.name());
        contactMessage.setEmail(request.email());
        contactMessage.setContact(request.contact());
        contactMessage.setSubject(request.subject()); // don't miss this
        contactMessage.setMessage(request.message());

        repo.save(contactMessage);

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
