package com.cinescope.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/watchlists")
public class WatchListController {
    @Autowired
    private WatchListService watchListService;

    @GetMapping("/{email}")
    public ResponseEntity<WatchList> getWatchListByEmail(@PathVariable String email) {
        Optional<WatchList> watchList = watchListService.getWatchListByEmail(email);
        return watchList.map(w -> new ResponseEntity<>(w, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<WatchList> createWatchList(@RequestBody WatchList watchList) {
        return new ResponseEntity<>(watchListService.saveWatchList(watchList), HttpStatus.CREATED);
    }
}
