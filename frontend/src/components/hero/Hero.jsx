import './Hero.css';
import Slider from "react-slick";
import { Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

const Hero = ({ movies }) => {

    const navigate = useNavigate();

    function details(movieId) {
        navigate(`/details/${movieId}`);
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };

    return (
        <div className='movie-carousel-container'>
            <Slider {...settings}>
                {movies?.map((movie) => (
                    <Paper key={movie.imdbId}>
                        <div className='movie-card-container'>
                            <div className="movie-card" style={{ "--img": `url(${movie.backdrops[0]})` }}>
                                <div className="movie-detail">
                                    <div
                                        className="movie-poster"
                                        onClick={() => details(movie.imdbId)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={movie.poster} alt="" />
                                    </div>
                                    <div
                                        className="movie-title"
                                        onClick={() => details(movie.imdbId)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h4>{movie.title}</h4>
                                    </div>
                                    <div className="movie-buttons-container">
                                        <Link to={`/trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}>
                                            <div className="play-button-icon-container">
                                                <FontAwesomeIcon className="play-button-icon"
                                                    icon={faCirclePlay}
                                                />
                                            </div>
                                        </Link>
                                        <div className="movie-review-button-container">
                                            <Button variant="info" onClick={() => details(movie.imdbId)} >Details</Button>
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

export default Hero
