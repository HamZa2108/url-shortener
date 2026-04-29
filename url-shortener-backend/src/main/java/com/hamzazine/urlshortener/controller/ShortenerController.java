package com.hamzazine.urlshortener.controller;

import com.hamzazine.urlshortener.dto.ShortenRequest;
import com.hamzazine.urlshortener.dto.ShortenResponse;
import com.hamzazine.urlshortener.dto.StatsResponse;
import com.hamzazine.urlshortener.entity.ShortenedUrl;
import com.hamzazine.urlshortener.service.UrlShortenerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class ShortenerController {

    private final UrlShortenerService service;

    @PostMapping("/api/shorten")
    public ResponseEntity<ShortenResponse> shorten(@Valid @RequestBody ShortenRequest request) {
        ShortenedUrl saved = service.shorten(request.url());
        String shortUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/{code}")
                .buildAndExpand(saved.getShortCode())
                .toUriString();
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ShortenResponse(saved.getShortCode(), shortUrl, saved.getLongUrl())
        );
    }

    @GetMapping("/api/stats/{shortCode}")
    public StatsResponse stats(@PathVariable String shortCode) {
        ShortenedUrl entity = service.getStats(shortCode);
        return new StatsResponse(
                entity.getShortCode(),
                entity.getLongUrl(),
                entity.getClickCount(),
                entity.getCreatedAt()
        );
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        ShortenedUrl entity = service.resolveAndIncrement(shortCode);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(entity.getLongUrl()))
                .build();
    }
}