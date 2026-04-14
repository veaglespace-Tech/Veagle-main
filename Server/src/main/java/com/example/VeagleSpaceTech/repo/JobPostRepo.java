package com.example.VeagleSpaceTech.repo;

import com.example.VeagleSpaceTech.entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepo extends JpaRepository<JobPost, Long> {
    @Query("""
            SELECT j FROM JobPost j
            WHERE
                LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(j.skills) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
            ORDER BY
                CASE
                    WHEN LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 1
                    WHEN LOWER(j.skills) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 2
                    WHEN LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 3
                    ELSE 4
                END
            """)
    List<JobPost> searchWithPriority(@Param("keyword") String keyword);
}
