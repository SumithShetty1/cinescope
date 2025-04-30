import Hero from './sections/hero/Hero';
import HighRated from './sections/highRated/HighRated'
import NewlyAdded from './sections/newlyAdded/NewlyAdded';
import Genre from './sections/genre/Genre';
import WatchList from './sections/watchList/WatchList';
import { useSession } from "@descope/react-sdk";

// Serves as the main page, displaying different sections based on the user's session state
const Home = () => {
  const { isAuthenticated } = useSession();

  return (
    <>
      <Hero />
      <HighRated />
      <NewlyAdded />
      {isAuthenticated && <WatchList />}
      <Genre />
    </>
  )
}

export default Home
