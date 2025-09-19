
import AdvertisementBanner from '../../components/AdvertisementBanner/AdvertisementBanner'
import HomeHeroSection from '../../components/HomeHeroSection/HomeHeroSection'
import Navbar from '../../components/Navbar/Navbar'
import UpcomingEvents from '../../components/UpComingEventSection/UpComingEventSection'

const Home = () => {
  return (
    <div className='w-full min-h-screen '>
        <Navbar/>
        <HomeHeroSection/>
        <UpcomingEvents/>
        <AdvertisementBanner/>
    </div>
  )
}

export default Home