import Hero from '../hero/Hero';
import HighRated from '../highRated/HighRated';
import Genre from '../genre/Genre';

const Home = ({movies}) => {
  return (
    <>
      <Hero movies = {movies} />
      <HighRated movies={movies} />
      <Genre/>
    </>
  )
}

export default Home
