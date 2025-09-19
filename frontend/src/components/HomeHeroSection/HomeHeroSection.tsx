import event_img from '../../assets/Event.png';
import HeroSearchBar from '../HeroSearchBar/HeroSearchBar';

const HomeHeroSection = () => {
  const handleSearch = (query: string, location: string) => {
    console.log('Search triggered:', query, location);
    // Add redirect or API call here
  };

  return (
    <div className="w-full 2xl:w-[1220px] relative">
      {/* Hero Image */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <img 
          src={event_img} 
          alt="event pic" 
          className="w-full h-full object-cover"
        />

        {/* Semi-transparent black overlay */}
        <div className="absolute inset-0 bg-black/50"></div> 

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Welcome to TechSphere 2025
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Find and manage events effortlessly
          </p>
        </div>
      </div>

      {/* Hero search bar */}
      <div className="-mt-30 relative z-10 flex justify-center px-4">
        <HeroSearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default HomeHeroSection;
