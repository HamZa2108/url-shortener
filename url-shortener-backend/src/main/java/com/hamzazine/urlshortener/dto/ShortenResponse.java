package com.hamzazine.urlshortener.dto;

public record ShortenResponse(
        String shortCode,
        String shortUrl,
        String longUrl
) {}