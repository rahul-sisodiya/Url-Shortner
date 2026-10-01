package com.coldcoffee.shortly.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity(name = "url")
@Getter
@Setter
@NoArgsConstructor
public class Url {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;
    private String shortUrl;
    private LocalDateTime createdOn;
    private LocalDateTime lastAccessed;
    private int clickCount;

    @PrePersist
    public void setCreatedOn() {

        createdOn = LocalDateTime.now();
        lastAccessed = LocalDateTime.now();
    }
}
