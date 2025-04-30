import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./MovieList.css";

// This component displays a list of movies with options to edit or delete
const MovieList = ({
    filteredMovies,
    searchTerm,
    setSearchTerm,
    handleEdit,
    handleDelete
}) => {
    return (
        <div className="manage-movies-list">

            {/* Header with title and search bar */}
            <div className="manage-list-header">
                <h2 className="manage-list-title">Movies List</h2>
                <div className="manage-search-container">
                    <FontAwesomeIcon icon={faSearch} className="manage-search-icon" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        className="manage-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Display movies in a grid layout */}
            <div className="manage-movies-grid">
                {filteredMovies.length > 0 ? (

                    // Iterate over filtered movies and display each movie's card
                    filteredMovies.map((movie) => (
                        <div key={movie.imdbId} className="manage-movie-card">
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="manage-poster"
                            />
                            <div className="manage-movie-info">

                                {/* Movie title */}
                                <h4 className="manage-movie-title">{movie.title}</h4>

                                {/* Movie release date and duration */}
                                <p className="manage-movie-meta">
                                    {movie.releaseDate?.split("-")[0]} • {movie.duration}
                                </p>
                                <div className="manage-movie-actions">

                                    {/* Edit button */}
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => handleEdit(movie)}
                                        className="manage-action-button"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="manage-icon" />
                                        Edit
                                    </Button>

                                    {/* Delete button */}
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(movie.imdbId)}
                                        className="manage-action-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="manage-icon" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Message to show when no results match the search
                    <div className="manage-no-results">
                        No movies found matching your search
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieList;
