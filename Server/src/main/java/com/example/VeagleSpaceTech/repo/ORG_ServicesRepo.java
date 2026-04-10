package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Repository
public interface ORG_ServicesRepo extends JpaRepository<Services,Long> {

//    @Query("""
//    SELECT DISTINCT s FROM Services s
//    LEFT JOIN s.features f
//    WHERE
//        LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
//        LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
//        LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
//    ORDER BY
//        CASE
//            WHEN LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 1
//            WHEN LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 2
//            ELSE 3
//        END
//""")
    List<Services> findByTitleContainingIgnoreCase(String title);
}
