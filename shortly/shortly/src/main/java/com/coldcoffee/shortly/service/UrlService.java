package com.coldcoffee.shortly.service;

import com.coldcoffee.shortly.dto.ShortUrlRequestDto;
import com.coldcoffee.shortly.entity.Url;
import com.coldcoffee.shortly.repository.UrlRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.service.invoker.UrlArgumentResolver;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UrlService {
    private final String BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    UrlRepository urlRepository;

    public UrlService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public Url shortenUrl(ShortUrlRequestDto shortUrlRequestDto) {

        Optional<ArrayList<Url>> savedUrl = urlRepository.findAllByUrl(shortUrlRequestDto.getUrl());
        System.out.println(savedUrl.isPresent());
        if(savedUrl.isPresent()) {
            if(savedUrl.get().size() >= 1) return savedUrl.get().get(0);
        }

        Url url = new Url();
        url.setUrl(shortUrlRequestDto.getUrl());
        url = urlRepository.save(url);
        String shortUrl = encode(url.getId());
        url.setShortUrl(shortUrl);
        return urlRepository.save(url);
    }


    private Long decode(String shortUrl) {
        Long id = 0L;
        for(int i = 0; i < shortUrl.length(); i++){
            int idx = BASE62.indexOf(shortUrl.charAt(i));
            id += idx * (long) Math.pow(62, shortUrl.length() - i - 1);
        }
        return id;

    }

    private String encode(Long id) {
        StringBuilder sb = new StringBuilder();
        while(id > 61) {
            int remainder = (int) (id % 62);
            sb.append(BASE62.charAt(remainder));
            id = id / 62;

        }
        sb.append(BASE62.charAt(id.intValue()));
        return sb.reverse().toString();
    }


    public Url redirectToUrl(String shortUrl) {
        Long id = decode(shortUrl);
        Optional<Url> url = urlRepository.findById(id);
        if(url.isPresent()) {
            url.get().setLastAccessed(java.time.LocalDateTime.now());
            url.get().setClickCount(url.get().getClickCount() + 1);
            urlRepository.save(url.get());
            return url.get();
        }
        return null;
    }
}
