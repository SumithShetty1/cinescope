package com.cinescope.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {
    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> allMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> singleMovie(String imdbId) {
        return movieRepository.findMovieByImdbId(imdbId);
    }

    public List<Movie> getTopRatedMovies(int limit) {
        if (limit <= 0) {
            return movieRepository.findAllByOrderByRatingDesc();
        }
        return movieRepository.findTop16ByOrderByRatingDesc();
    }

    public List<Movie> getNewReleases(int limit) {
        if (limit <= 0) {
            return movieRepository.findAllByOrderByReleaseDateDesc();
        }
        return movieRepository.findTop16ByOrderByReleaseDateDesc();
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreIgnoreCase(genre);
    }

    public List<Movie> getTopRatedMoviesByGenre(String genre, int limit) {
        List<Movie> movies = movieRepository.findByGenreIgnoreCaseOrderByRatingDesc(genre);
        return limit > 0 ? movies.stream().limit(limit).collect(Collectors.toList()) : movies;
    }
}
