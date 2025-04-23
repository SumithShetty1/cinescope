package com.cinescope.backend;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {
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

    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        Movie savedMovie = movieService.saveMovie(movie);
        return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    }

}
