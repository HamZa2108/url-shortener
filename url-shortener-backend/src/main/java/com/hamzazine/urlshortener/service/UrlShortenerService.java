package com.hamzazine.urlshortener.service;

import com.hamzazine.urlshortener.entity.ShortenedUrl;
import com.hamzazine.urlshortener.exception.ShortCodeNotFoundException;
import com.hamzazine.urlshortener.repository.ShortenedUrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UrlShortenerService {

    private final ShortenedUrlRepository repository;
    private final Base62Encoder base62;

    @Transactional
    public ShortenedUrl shorten(String longUrl) {
        ShortenedUrl entity = new ShortenedUrl();
        entity.setLongUrl(longUrl);
        repository.save(entity);
        entity.setShortCode(base62.encode(entity.getId()));
        return repository.save(entity);
    }

    @Transactional
    public ShortenedUrl resolveAndIncrement(String shortCode) {
        ShortenedUrl entity = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new ShortCodeNotFoundException(shortCode));
        entity.setClickCount(entity.getClickCount() + 1);
        return entity;
    }

    @Transactional(readOnly = true)
    public ShortenedUrl getStats(String shortCode) {
        return repository.findByShortCode(shortCode)
                .orElseThrow(() -> new ShortCodeNotFoundException(shortCode));
    }
}