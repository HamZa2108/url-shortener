package com.hamzazine.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ShortenRequest(
        @NotBlank(message = "URL is required")
        @Size(max = 2048, message = "URL too long")
        @Pattern(regexp = "^https?://.+", message = "URL must start with http:// or https://")
        String url
) {}