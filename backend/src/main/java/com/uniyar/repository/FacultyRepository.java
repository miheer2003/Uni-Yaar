package com.uniyar.repository;

import com.uniyar.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    @Query("SELECT f FROM Faculty f JOIN f.user u JOIN f.department d WHERE " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(f.subjects) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(f.designation) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:departmentId IS NULL OR d.id = :departmentId)")
    Page<Faculty> searchFaculty(@Param("search") String search,
                               @Param("departmentId") Long departmentId,
                               Pageable pageable);

    List<Faculty> findByDepartmentId(Long departmentId);
    Optional<Faculty> findByUserId(Long userId);
}
