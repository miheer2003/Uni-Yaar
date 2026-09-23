package com.uniyar.repository;

import com.uniyar.dto.search.SearchItemType;
import com.uniyar.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Bookmark> findByUserIdAndItemTypeAndItemId(Long userId, SearchItemType itemType, Long itemId);

    void deleteByUserIdAndItemTypeAndItemId(Long userId, SearchItemType itemType, Long itemId);
}
