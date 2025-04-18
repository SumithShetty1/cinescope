import Hero from '../hero/Hero';
import Genre from '../genre/Genre';

const Home = ({movies}) => {
  return (
    <>
      <Hero movies = {movies} />
      <Genre/>
    </>
  )
}

export default Home
