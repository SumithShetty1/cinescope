import React, { useState, useEffect } from 'react';
import './Hero.css';
import Slider from "react-slick";
import { Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import api from '../../../../api/axiosConfig';

// Hero component that displays a carousel of top-rated movies
const Hero = () => {
    const navigate = useNavigate();
    const [topMovies, setTopMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch top-rated movies on component mount
    useEffect(() => {
        const fetchTopMovies = async () => {
            try {
                const response = await api.get('/movies/top-rated/10');
                const moviesWithBackdrops = response.data.map(movie => ({
                    ...movie,
                    selectedBackdrop: movie.backdrops[Math.floor(Math.random() * movie.backdrops.length)]
                }));
                setTopMovies(moviesWithBackdrops);
            } catch (err) {
                console.error("Error fetching top movies:", err);
                setError('Failed to load featured movies');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopMovies();
    }, []);

    // Navigate to movie details page
    function details(movieId) {
        navigate(`/details/${movieId}`);
    }

    // Settings for react-slick carousel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="movie-carousel-container">
                <div className="loading-spinner">Loading featured movies...</div>
            </div>
        );
    }

    // Show error state with a retry button
    if (error) {
        return (
            <div className="movie-carousel-container">
                <div className="error-message">
                    {error}
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    // Render carousel of featured movies
    return (
        <div className='movie-carousel-container'>
            <Slider {...settings}>
                {topMovies.map((movie) => (
                    <Paper key={movie.imdbId}>
                        <div className='movie-card-container'>

                            {/* Custom background using inline CSS variable */}
                            <div className="movie-card" style={{
                                "--img": `url(${movie.selectedBackdrop})`
                            }}>
                                <div className="movie-detail">
                                    <div
                                        className="movie-poster"
                                        onClick={() => details(movie.imdbId)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={movie.poster} alt="" />
                                        <div className="movie-rating">
                                            {movie?.rating ? `★ ${movie.rating}` : 'N/A'}
                                        </div>
                                    </div>

                                    {/* Movie title (clickable) */}
                                    <div
                                        className="movie-title"
                                        onClick={() => details(movie.imdbId)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h4>{movie.title}</h4>
                                    </div>

                                    {/* Trailer and Details buttons */}
                                    <div className="movie-buttons-container">
                                        <Link to={`/trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                                            <div className="play-button-icon-container">
                                                <FontAwesomeIcon className="play-button-icon"
                                                    icon={faCirclePlay}
                                                />
                                            </div>
                                        </Link>
                                        <div className="movie-review-button-container">
                                            <Button variant="info" onClick={() => details(movie.imdbId)}>Details</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Paper>
                ))}
            </Slider>
        </div>
    );
}

export default Hero;
