import React, { useEffect, useState } from 'react';
import './WatchListPage.css';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";

const WatchListPage = () => {
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlistMovies = async () => {
            try {
                const response = await api.get("/api/v1/movies");
                // const filtered = response.data.filter((movie) => movie.rating >= 8.0); // Adjust threshold as needed
                const filtered = response.data
                setWatchlistMovies(filtered);
            } catch (error) {
                console.error("Error fetching top-rated movies:", error);
            }
        };

        fetchWatchlistMovies();
    }, []);

    function goToReviews(movieId) {
        navigate(`/reviews/${movieId}`);
    }

    return (
        <div className="watchlist-section">
            <h2 style={{ color: 'white', margin: '2rem 1rem' }}>
                Your Watchlist
            </h2>
            <div className="movie-grid">
                {watchlistMovies.map((movie) => (
                    <div
                        key={movie.imdbId}
                        className="watchlist-movie-poster"
                        onClick={() => goToReviews(movie.imdbId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={movie.poster} alt={movie.title} />
                        <p style={{ color: 'white' }}>{movie.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchListPage;
