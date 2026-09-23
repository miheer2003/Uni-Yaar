package com.uniyar.controller;

import com.uniyar.dto.ApiResponse;
import com.uniyar.dto.search.SearchResponse;
import com.uniyar.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResponse>> search(
            @RequestParam(required = false, defaultValue = "") String q
    ) {
        SearchResponse response = searchService.search(q);
        return ResponseEntity.ok(ApiResponse.success(response, "Search results retrieved"));
    }
}
