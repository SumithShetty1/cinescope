import "./MovieHeader.css";

// MovieHeader component displays the movie title, release year, and duration
const MovieHeader = ({ movie }) => {
    return (
        <div className="review-movie-header">
            <h1>{movie?.title}</h1>
            <div className="review-movie-meta">
                <span>{movie?.releaseDate?.split("-")[0]}</span>
                <span>•</span>
                <span>{movie?.duration}</span>
            </div>
        </div>
    );
};

export default MovieHeader;
