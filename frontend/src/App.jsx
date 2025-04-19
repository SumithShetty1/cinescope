import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "./api/axiosConfig";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import GenrePage from "./components/genre/GenrePage";
import Trailer from "./components/trailer/Trailer";
import Reviews from "./components/reviews/Reviews";
import NotFound from "./components/notFound/NotFound";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import HighRatedMovies from "./components/highRated/HighRatedPage";
import WatchListPage from "./components/watchList/WatchListPage";
import NewlyAddedPage from "./components/newlyAdded/NewlyAddedPage";
import ManageMoviesPage from "./components/manageMovies/ManageMoviesPage";

function App() {
    const [movies, setMovies] = useState();
    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState([]);

    const getMovies = async () => {
        try {
            const response = await api.get("/api/v1/movies");

            setMovies(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getMovieData = async (movieId) => {
        try {
            const response = await api.get(`/api/v1/movies/${movieId}`);

            const singleMovie = response.data;

            setMovie(singleMovie);

            setReviews(singleMovie.reviewIds);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMovies();
    }, []);
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home movies={movies} />}></Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/manage" element={<ManageMoviesPage />} />
                    <Route path="/top-rated" element={<HighRatedMovies />} />
                    <Route path="/newly-added" element={<NewlyAddedPage />} />
                    <Route path="/watchlist" element={<WatchListPage />} />
                    <Route path="/genre/:genreName" element={<GenrePage />} />
                    <Route path="/trailer/:ytTrailerId" element={<Trailer />} />
                    <Route
                        path="/reviews/:movieId"
                        element={
                            <Reviews
                                getMovieData={getMovieData}
                                movie={movie}
                                reviews={reviews}
                                setReviews={setReviews}
                            />
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
