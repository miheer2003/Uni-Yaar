package com.uniyar.repository;

import com.uniyar.entity.FacilityStatus;
import com.uniyar.entity.MaintenanceNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceNoticeRepository extends JpaRepository<MaintenanceNotice, Long> {

    List<MaintenanceNotice> findByIsActiveTrueOrderByCreatedAtDesc();

    List<MaintenanceNotice> findByBuildingIdAndIsActiveTrue(Long buildingId);

    List<MaintenanceNotice> findByStatusAndIsActiveTrue(FacilityStatus status);
}
