package com.coldcoffee.shortly.repository;

import com.coldcoffee.shortly.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    void findByShortUrl(String shortUrl);

    Optional<Url> findByUrl(String url);

    Optional<ArrayList<Url>> findAllByUrl(String url);
}
