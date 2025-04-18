import React, { useEffect, useState } from 'react';
import './HighRatedMovies.css';
import api from '../../api/axiosConfig';
import { useNavigate } from "react-router-dom";

const HighRatedMovies = () => {
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopRatedMovies = async () => {
            try {
                const response = await api.get("/api/v1/movies");
                // const filtered = response.data.filter((movie) => movie.rating >= 8.0); // Adjust threshold as needed
                const filtered = response.data
                setTopRatedMovies(filtered);
            } catch (error) {
                console.error("Error fetching top-rated movies:", error);
            }
        };

        fetchTopRatedMovies();
    }, []);

    function goToReviews(movieId) {
        navigate(`/Reviews/${movieId}`);
    }

    return (
        <div>
            <h2 style={{ color: 'white', margin: '2rem 1rem' }}>
                Top Rated Movies
            </h2>
            <div className="movie-grid">
                {topRatedMovies.map((movie) => (
                    <div
                        key={movie.imdbId}
                        className="high-rated-movie-poster"
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

export default HighRatedMovies;
