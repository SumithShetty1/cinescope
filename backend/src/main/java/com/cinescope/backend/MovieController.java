package com.cinescope.backend;

//import org.bson.types.ObjectId;
import com.descope.client.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

//Descope Imports
import com.descope.client.DescopeClient;
import com.descope.exception.DescopeException;
import com.descope.model.jwt.Token;
import com.descope.sdk.auth.AuthenticationService;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    @Value("${descope.project.id}")
    private String projectId;

    private final DescopeClient descopeClient = new DescopeClient(
            Config.builder()
                    .projectId(projectId) // replace with your actual ID
                    .build());

    private final AuthenticationService authService = descopeClient.getAuthenticationServices().getAuthService();
    Token verifiedToken;
    private boolean isSessionValid(String sessionToken, String refreshToken) {
        try {
            verifiedToken=authService.validateAndRefreshSessionWithTokens(sessionToken, refreshToken);
            return true;
        } catch (DescopeException e) {
            return false;
        }
    }

    public boolean isAdmin(Token sessionToken) {
        try {
            return authService.validateRoles(sessionToken, Collections.singletonList("admin"));
        } catch (DescopeException e) {
            // You can log the exception if you want
            System.err.println("Error validating admin role: " + e.getMessage());
            return false; // If error occurs, treat as not admin
        }
    }

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return new ResponseEntity<List<Movie>>(movieService.allMovies(), HttpStatus.OK);
    }

    @GetMapping("/{imdbId}")
    public ResponseEntity<Optional<Movie>> getSingleMovies(@PathVariable String imdbId) {
        return new ResponseEntity<Optional<Movie>>(movieService.singleMovie(imdbId), HttpStatus.OK);
    }

    @GetMapping("/top-rated/{limit}")
    public ResponseEntity<List<Movie>> getTopRatedMovies(@PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 16;
        return new ResponseEntity<List<Movie>>(movieService.getTopRatedMovies(actualLimit), HttpStatus.OK);
    }

    @GetMapping("/new-releases/{limit}")
    public ResponseEntity<List<Movie>> getNewReleases(@PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 16;
        return new ResponseEntity<List<Movie>>(movieService.getNewReleases(actualLimit), HttpStatus.OK);
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Movie>> getMoviesByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(movieService.getMoviesByGenre(genre));
    }

    @GetMapping("/genre/{genre}/top-rated/{limit}")
    public ResponseEntity<List<Movie>> getTopRatedMoviesByGenre(
            @PathVariable String genre,
            @PathVariable(required = false) Integer limit) {
        int actualLimit = (limit != null) ? limit : 0;
        return ResponseEntity.ok(movieService.getTopRatedMoviesByGenre(genre, actualLimit));
    }

    // @PostMapping
    // public ResponseEntity<Movie> addMovie(@RequestBody Movie movie) {
    // Movie savedMovie = movieService.addMovie(movie);
    // return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    // }

    @PostMapping
    public ResponseEntity<?> addMovie(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestHeader("x-refresh-token") String refreshToken,
            @RequestBody Movie movie) {

        String sessionToken = authorizationHeader.replace("Bearer ", "");

        if (!isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired session.");
        }
        if (!isAdmin(verifiedToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Movie savedMovie = movieService.addMovie(movie);
        return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    }

    @PutMapping("/{imdbId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable String imdbId,
                                             @RequestBody Movie updatedMovie,
                                             @RequestHeader("Authorization") String authorizationHeader,
                                             @RequestHeader("x-refresh-token") String refreshToken) {
        String sessionToken = authorizationHeader.replace("Bearer ", "");

        if (!isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!isAdmin(verifiedToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Movie> movieOpt = movieService.updateMovie(imdbId, updatedMovie);
        return movieOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{imdbId}")
    public ResponseEntity<String> deleteMovie(@PathVariable String imdbId,
                                              @RequestHeader("Authorization") String authorizationHeader,
                                              @RequestHeader("x-refresh-token") String refreshToken) {

        String sessionToken = authorizationHeader.replace("Bearer ", "");
        if (!isSessionValid(sessionToken, refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!isAdmin(verifiedToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean deleted = movieService.deleteMovieByImdbId(imdbId);
        if (deleted) {
            return ResponseEntity.ok("Movie deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
        }
    }
}
