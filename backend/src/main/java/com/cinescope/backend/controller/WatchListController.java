package com.cinescope.backend.controller;

import com.cinescope.backend.entity.WatchList;
import com.cinescope.backend.auth.AuthService;
import com.cinescope.backend.service.WatchListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/watchlist")
public class WatchListController {

    @Autowired
    private WatchListService watchListService;

    @Autowired
    private AuthService authService;

    @GetMapping("/{email}")
    public ResponseEntity<WatchList> getWatchListByEmail(@PathVariable String email) {
        Optional<WatchList> watchList = watchListService.getWatchListByEmail(email);
        return watchList.map(w -> new ResponseEntity<>(w, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/check/{imdbId}")
    public ResponseEntity<Map<String, Boolean>> checkMovieInWatchlist(
            @PathVariable String imdbId,
            @RequestParam String email) {
        boolean isInWatchlist = watchListService.isMovieInWatchlist(email, imdbId); // No try-catch
        return ResponseEntity.ok(Map.of("isInWatchlist", isInWatchlist));
    }

    @PostMapping("/add")
    public ResponseEntity<WatchList> addToWatchlist(
            @RequestParam String email,
            @RequestParam String imdbId,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader("x-refresh-token") String refreshToken) {
        try {
            String sessionToken = authorizationHeader.replace("Bearer ", "");

            if (!authService.isSessionValid(sessionToken, refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            WatchList updatedWatchlist = watchListService.addToWatchlist(email, imdbId);
            return new ResponseEntity<>(updatedWatchlist, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<WatchList> removeFromWatchlist(
            @RequestParam String email,
            @RequestParam String imdbId,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader("x-refresh-token") String refreshToken) {
        try {

            String sessionToken = authorizationHeader.replace("Bearer ", "");

            if (!authService.isSessionValid(sessionToken, refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            WatchList updatedWatchlist = watchListService.removeFromWatchlist(email, imdbId);
            return new ResponseEntity<>(updatedWatchlist, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
