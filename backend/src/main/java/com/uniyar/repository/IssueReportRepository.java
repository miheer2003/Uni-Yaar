package com.uniyar.repository;

import com.uniyar.entity.IssueCategory;
import com.uniyar.entity.IssueReport;
import com.uniyar.entity.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {

    List<IssueReport> findAllByOrderByCreatedAtDesc();

    List<IssueReport> findByStatusOrderByCreatedAtDesc(IssueStatus status);

    List<IssueReport> findByCategoryOrderByCreatedAtDesc(IssueCategory category);

    @Query("SELECT r FROM IssueReport r WHERE " +
           "(:category IS NULL OR r.category = :category) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:buildingId IS NULL OR (r.building IS NOT NULL AND r.building.id = :buildingId)) " +
           "ORDER BY r.upvoteCount DESC, r.createdAt DESC")
    List<IssueReport> searchReports(
            @Param("category") IssueCategory category,
            @Param("status") IssueStatus status,
            @Param("buildingId") Long buildingId
    );
}
