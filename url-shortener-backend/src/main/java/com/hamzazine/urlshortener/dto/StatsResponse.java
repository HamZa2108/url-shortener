package com.hamzazine.urlshortener.dto;

import java.time.Instant;

public record StatsResponse(
        String shortCode,
        String longUrl,
        Long clickCount,
        Instant createdAt
) {}