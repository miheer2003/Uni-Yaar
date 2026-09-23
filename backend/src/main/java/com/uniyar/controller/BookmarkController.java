package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.search.BookmarkRequest;
import com.uniyar.dto.search.BookmarkResponse;
import com.uniyar.entity.User;
import com.uniyar.repository.UserRepository;
import com.uniyar.service.BookmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookmarkResponse>>> getBookmarks(Authentication authentication) {
        User user = getUser(authentication);
        List<BookmarkResponse> bookmarks = bookmarkService.getUserBookmarks(user.getId());
        return ResponseEntity.ok(ApiResponse.success(bookmarks, "Bookmarks retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookmarkResponse>> addBookmark(
            @Valid @RequestBody BookmarkRequest request,
            Authentication authentication
    ) {
        User user = getUser(authentication);
        BookmarkResponse bookmark = bookmarkService.addBookmark(request, user);
        return ResponseEntity.ok(ApiResponse.success(bookmark, "Bookmark added successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBookmark(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = getUser(authentication);
        bookmarkService.deleteBookmark(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Bookmark deleted successfully"));
    }

    private User getUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Authentication required for bookmark actions");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }
}
