package com.cinescope.backend.controller;

import com.cinescope.backend.entity.Movie;
import com.cinescope.backend.entity.WatchList;
import com.cinescope.backend.auth.AuthService;
import com.cinescope.backend.service.WatchListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for managing user's watchlist operations.
 */
@RestController
@RequestMapping("/api/v1/watchlist")
public class WatchListController {

    @Autowired
    private WatchListService watchListService;

    @Autowired
    private AuthService authService;

    // Get the complete watchlist for a user by email
    @GetMapping("/{email}/{limit}")
    public ResponseEntity<WatchList> getWatchListByEmail(
            @PathVariable String email,
            @PathVariable Integer limit) {

        int actualLimit = (limit != null) ? limit : 16;
        Optional<WatchList> watchList = watchListService.getWatchListByEmail(email, actualLimit);

        return watchList.map(w -> new ResponseEntity<>(w, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Check if a specific movie is in the user's watchlist
    @GetMapping("/check/{imdbId}")
    public ResponseEntity<Map<String, Boolean>> checkMovieInWatchlist(
            @PathVariable String imdbId,
            @RequestParam String email) {
        boolean isInWatchlist = watchListService.isMovieInWatchlist(email, imdbId); // No try-catch
        return ResponseEntity.ok(Map.of("isInWatchlist", isInWatchlist));
    }

    // Add a movie to the user's watchlist (auth required)
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

    // Remove a movie from the user's watchlist (auth required)
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
