import React, { useEffect, useState } from 'react';
import './WatchListPage.css';
import api from '../../../api/axiosConfig';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useUser, useSession } from "@descope/react-sdk";
import Button from "react-bootstrap/Button";

// Displays a personalized list of movies saved by the logged-in user
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

    // On mount or when user info is available, fetch watchlist
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        if (isAuthenticated && user?.email) {
            fetchWatchlistMovies();
        }
    }, [isAuthenticated, user?.email]);

    // Function to fetch watchlist from backend
    const fetchWatchlistMovies = async () => {
        setIsLoading(true);
        setError('');
        try {
            const watchlistResponse = await api.get(`/watchlist/${user.email}`);
            const watchlist = watchlistResponse.data;

            if (watchlist && watchlist.movies && watchlist.movies.length > 0) {
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

    // Filter movies by search term
    useEffect(() => {
        const filtered = watchlistMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, watchlistMovies]);

    // Navigate to movie details page
    const goToDetails = (movieId) => {
        navigate(`/details/${movieId}`);
    };

    // If user is not authenticated, prompt them to login
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

    // Show loading spinner while fetching
    if (isLoading) {
        return (
            <div className="watchlist-page-section">
                <div className="watchlist-loading">
                    Loading your watchlist...
                </div>
            </div>
        );
    }

    // Show error with retry button
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

    // Render watchlist movies and search box
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

            {/* Render movie posters or fallback text */}
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
                        {watchlistMovies.length === 0 && !hasWatchlist ?
                            "Your watchlist is empty" :
                            "No movies found matching your search"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchListPage;
