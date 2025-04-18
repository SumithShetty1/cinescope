import React, { useEffect, useState } from 'react';
import './WatchListPage.css';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const WatchListPage = () => {
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlistMovies = async () => {
            try {
                const response = await api.get("/api/v1/movies");
                const filtered = response.data;
                setWatchlistMovies(filtered);
                setFilteredMovies(filtered);
            } catch (error) {
                console.error("Error fetching watchlist movies:", error);
            }
        };

        fetchWatchlistMovies();
    }, []);

    useEffect(() => {
        const filtered = watchlistMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, watchlistMovies]);

    const goToReviews = (movieId) => {
        navigate(`/reviews/${movieId}`);
    };

    return (
        <div className="watchlist-page-section">
            <div className="watchlist-page-header">
                <h2 className="watchlist-page-title">Your Watchlist</h2>
                <div className="watchlist-page-search-container">
                    <FontAwesomeIcon icon={faSearch} className="watchlist-page-search-icon" />
                    <input
                        type="text"
                        placeholder="Search your watchlist..."
                        className="watchlist-page-search-input"
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
                            className="watchlist-page-movie-poster"
                            onClick={() => goToReviews(movie.imdbId)}
                        >
                            <img src={movie.poster} alt={movie.title} />
                            <p className="watchlist-page-movie-title">{movie.title}</p>
                        </div>
                    ))
                ) : (
                    <div className="watchlist-page-no-results">
                        No movies found matching your search
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchListPage;
