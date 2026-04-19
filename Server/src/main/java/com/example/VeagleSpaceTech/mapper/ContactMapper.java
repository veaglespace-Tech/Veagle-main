package com.example.VeagleSpaceTech.mapper;

import com.example.VeagleSpaceTech.DTO.request.ContactRequestDTO;
import com.example.VeagleSpaceTech.DTO.response.ContactResponseDTO;
import com.example.VeagleSpaceTech.entity.ContactMessage;

public class ContactMapper {

    // 🔹 RequestDTO → Entity
    public static ContactMessage toEntity(ContactRequestDTO request) {

        ContactMessage entity = new ContactMessage();

        entity.setName(request.name());
        entity.setEmail(request.email());
        entity.setPhone(request.phone());
        entity.setCompany(request.company());
        entity.setService(request.service());
        entity.setBudget(request.budget());
        entity.setTimeline(request.timeline());
        entity.setMessage(request.message());

        // optional
        entity.setSubject(request.service());

        return entity;
    }

    // 🔹 Entity → ResponseDTO
    public static ContactResponseDTO toDTO(ContactMessage msg) {

        return new ContactResponseDTO(
                msg.getId(),
                msg.getName(),
                msg.getEmail(),
                msg.getPhone(),
                msg.getCompany(),
                msg.getService(),
                msg.getBudget(),
                msg.getTimeline(),
                msg.getMessage(),
                msg.isRead(),
                msg.getCreatedAt()
        );
    }
}