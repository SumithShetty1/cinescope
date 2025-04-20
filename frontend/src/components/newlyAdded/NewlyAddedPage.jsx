import React, { useEffect, useState } from 'react';
import './NewlyAddedPage.css';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const NewlyAddedPage = () => {
    const [newlyAddedMovies, setNewlyAddedMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        const fetchNewlyAddedMovies = async () => {
            try {
                const response = await api.get("/api/v1/movies");
                const sorted = response.data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setNewlyAddedMovies(sorted);
                setFilteredMovies(sorted);
            } catch (error) {
                console.error("Error fetching newly added movies:", error);
            }
        };

        fetchNewlyAddedMovies();
    }, []);

    useEffect(() => {
        const filtered = newlyAddedMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, newlyAddedMovies]);

    function goToDetails(movieId) {
        navigate(`/details/${movieId}`);
    }

    return (
        <div className="newly-added-page-section">
            <div className="newly-added-page-header">
                <h2 className="newly-added-page-title">Newly Added Movies</h2>
                <div className="newly-added-page-search-container">
                    <FontAwesomeIcon icon={faSearch} className="newly-added-page-search-icon" />
                    <input
                        type="text"
                        placeholder="Search newly added movies..."
                        className="newly-added-page-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="movie-grid">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <div
                            key={movie.imdbId}
                            className="newly-added-page-movie-poster"
                            onClick={() => goToDetails(movie.imdbId)}
                        >
                            <div className="poster-container">
                                <img src={movie.poster} alt={movie.title} />
                                <div className="movie-rating">
                                    {movie.rating || 'N/A'}
                                </div>
                            </div>
                            <p className="newly-added-page-movie-title">{movie.title}</p>
                        </div>
                    ))
                ) : (
                    <div className="newly-added-page-no-results">
                        No movies found matching your search
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewlyAddedPage;
