import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import GenrePage from "./components/genre/GenrePage";
import Trailer from "./components/trailer/Trailer";
import MovieDetails from "./components/details/MovieDetails";
import NotFound from "./components/notFound/NotFound";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import HighRatedPage from "./components/highRated/HighRatedPage";
import WatchListPage from "./components/watchList/WatchListPage";
import NewlyAddedPage from "./components/newlyAdded/NewlyAddedPage";
import ManageMoviesPage from "./components/manageMovies/ManageMoviesPage";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/manage"
                        element={
                            <PrivateRoute requiredRole="admin">
                                <ManageMoviesPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/top-rated" element={<HighRatedPage />} />
                    <Route path="/newly-added" element={<NewlyAddedPage />} />
                    <Route path="/watchlist" element={<WatchListPage />} />
                    <Route path="/genre/:genreName" element={<GenrePage />} />
                    <Route path="/trailer/:ytTrailerId" element={<Trailer />} />
                    <Route path="/details/:movieId" element={<MovieDetails />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
