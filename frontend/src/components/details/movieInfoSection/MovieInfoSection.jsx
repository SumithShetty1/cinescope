import ReactPlayer from "react-player";
import "./MovieInfoSection.css";

// MovieInfoSection component displays the movie trailer, genres, description, and crew details (directors, writers, stars)
const MovieInfoSection = ({ movie }) => {
    return (
        <>
            {movie?.trailerLink && (
                <div className="review-trailer-section">
                    <ReactPlayer
                        controls
                        playing
                        url={movie.trailerLink}
                        width="100%"
                        height="450px"
                        className="review-react-player-container"
                    />
                </div>
            )}

            <div className="review-genres-section">
                {movie?.genres?.map((genre, index) => (
                    <span key={index} className="genre-tag">
                        {genre}
                    </span>
                ))}
            </div>

            <div className="description-section">
                <p>{movie?.description}</p>
            </div>

            <div className="crew-section">
                {movie?.directors?.length > 0 && (
                    <div className="crew-item">
                        <span className="crew-role">Directors</span>
                        <span className="crew-name">
                            {movie.directors.join(", ")}
                        </span>
                    </div>
                )}
                {movie?.writers?.length > 0 && (
                    <div className="crew-item">
                        <span className="crew-role">Writers</span>
                        <span className="crew-name">
                            {movie.writers.join(", ")}
                        </span>
                    </div>
                )}
                {movie?.stars?.length > 0 && (
                    <div className="crew-item">
                        <span className="crew-role">Stars</span>
                        <span className="crew-name">
                            {movie.stars.join(", ")}
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default MovieInfoSection;
