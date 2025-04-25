import React, { useEffect, useState } from 'react';
import './WatchListPage.css';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useUser, useSession } from "@descope/react-sdk";
import Button from "react-bootstrap/Button";

const WatchListPage = () => {
    const { user } = useUser();
    const { isAuthenticated } = useSession();
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasWatchlist, setHasWatchlist] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        if (isAuthenticated && user?.email) {
            fetchWatchlistMovies();
        }
    }, [isAuthenticated, user?.email]);

    const fetchWatchlistMovies = async () => {
        setIsLoading(true);
        setError('');
        try {
            // 1. Get the user's watchlist with movie references
            const watchlistResponse = await api.get(`/api/v1/watchlists/${user.email}`);
            const watchlist = watchlistResponse.data;
            
            if (watchlist && watchlist.movies && watchlist.movies.length > 0) {
                // 2. The @DocumentReference should have already resolved the movie documents
                // So we can directly use the movie objects
                setWatchlistMovies(watchlist.movies);
                setFilteredMovies(watchlist.movies);
                setHasWatchlist(true);
            } else {
                setWatchlistMovies([]);
                setFilteredMovies([]);
                setHasWatchlist(false);
            }
        } catch (error) {
            console.error("Error fetching watchlist movies:", error);
            setError('Failed to load watchlist');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const filtered = watchlistMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, watchlistMovies]);

    const goToDetails = (movieId) => {
        navigate(`/details/${movieId}`);
    };

    if (!isAuthenticated) {
        return (
            <div className="watchlist-page-section">
                <div className="watchlist-login-prompt">
                    <h3>Please login to view your watchlist</h3>
                    <Button 
                        variant="outline-info" 
                        onClick={() => navigate('/login')}
                        className="watchlist-login-button"
                    >
                        Login
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="watchlist-page-section">
                <div className="watchlist-loading">
                    Loading your watchlist...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="watchlist-page-section">
                <div className="watchlist-error">
                    {error}
                    <Button 
                        variant="outline-info" 
                        onClick={fetchWatchlistMovies}
                        className="watchlist-retry-button"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

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
                            onClick={() => goToDetails(movie.imdbId)}
                        >
                            <div className="poster-container">
                                <img src={movie.poster} alt={movie.title} />
                                <div className="movie-rating">
                                    {movie.imdbRating || movie.rating || 'N/A'}
                                </div>
                            </div>
                            <p className="watchlist-page-movie-title">{movie.title}</p>
                        </div>
                    ))
                ) : (
                    <div className="watchlist-page-no-results">
                        {watchlistMovies.length === 0 && !hasWatchlist? 
                            "Your watchlist is empty" : 
                            "No movies found matching your search"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchListPage;
