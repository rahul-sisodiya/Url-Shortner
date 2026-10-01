package com.coldcoffee.shortly.controller;

import com.coldcoffee.shortly.dto.ShortUrlRequestDto;
import com.coldcoffee.shortly.entity.Url;
import com.coldcoffee.shortly.service.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class UrlController {
    UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping("/shorten")
    public ResponseEntity<Url> createShortUrl(@RequestBody ShortUrlRequestDto shortUrlRequestDto) {
        Url url = urlService.shortenUrl(shortUrlRequestDto);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/{shortUrl}")
    public RedirectView redirectToUrl(@PathVariable String shortUrl) {
        Url url =  urlService.redirectToUrl(shortUrl);
        if(url != null) return new RedirectView(url.getUrl());
        return new RedirectView(HttpStatus.NOT_FOUND.name());
    }

}
