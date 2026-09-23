package com.uniyar.service;

import com.uniyar.dto.search.BookmarkRequest;
import com.uniyar.dto.search.BookmarkResponse;
import com.uniyar.entity.Bookmark;
import com.uniyar.entity.User;
import com.uniyar.exception.ResourceNotFoundException;
import com.uniyar.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    @Transactional(readOnly = true)
    public List<BookmarkResponse> getUserBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(BookmarkResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookmarkResponse addBookmark(BookmarkRequest request, User user) {
        var existing = bookmarkRepository.findByUserIdAndItemTypeAndItemId(
                user.getId(), request.getItemType(), request.getItemId()
        );

        if (existing.isPresent()) {
            return BookmarkResponse.fromEntity(existing.get());
        }

        Bookmark bookmark = Bookmark.builder()
                .user(user)
                .itemType(request.getItemType())
                .itemId(request.getItemId())
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .targetUrl(request.getTargetUrl())
                .build();

        Bookmark saved = bookmarkRepository.save(bookmark);
        log.info("Saved bookmark {} for user {}", saved.getTitle(), user.getEmail());
        return BookmarkResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteBookmark(Long id, Long userId) {
        Bookmark bookmark = bookmarkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark", "id", id));

        if (!bookmark.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot delete bookmark belonging to another user");
        }

        bookmarkRepository.delete(bookmark);
        log.info("Deleted bookmark {} for user {}", id, userId);
    }
}
