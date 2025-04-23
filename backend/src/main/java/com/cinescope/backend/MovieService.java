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

    public Movie addMovie(Movie movie) {
        movie.setRating(0.0);
        movie.setReviewIds(List.of());
        return movieRepository.save(movie);
    }

    public boolean deleteMovieByImdbId(String imdbId) {
        Optional<Movie> movieOpt = movieRepository.findMovieByImdbId(imdbId);
        if (movieOpt.isPresent()) {
            movieRepository.delete(movieOpt.get());
            return true;
        }
        return false;
    }

    public Optional<Movie> updateMovie(String imdbId, Movie updatedMovie) {
        Optional<Movie> existingOpt = movieRepository.findMovieByImdbId(imdbId);

        if (existingOpt.isPresent()) {
            Movie existing = existingOpt.get();

            existing.setTitle(updatedMovie.getTitle());
            existing.setDescription(updatedMovie.getDescription());
            existing.setDuration(updatedMovie.getDuration());
            existing.setDirectors(updatedMovie.getDirectors());
            existing.setWriters(updatedMovie.getWriters());
            existing.setStars(updatedMovie.getStars());
            existing.setReleaseDate(updatedMovie.getReleaseDate());
            existing.setTrailerLink(updatedMovie.getTrailerLink());
            existing.setPoster(updatedMovie.getPoster());
            existing.setGenres(updatedMovie.getGenres());
            existing.setBackdrops(updatedMovie.getBackdrops());

            return Optional.of(movieRepository.save(existing));
        }

        return Optional.empty();
    }
}
