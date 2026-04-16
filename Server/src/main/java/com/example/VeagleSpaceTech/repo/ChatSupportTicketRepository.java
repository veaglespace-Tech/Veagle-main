package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.ChatSupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatSupportTicketRepository extends JpaRepository<ChatSupportTicket, Long> {
}
