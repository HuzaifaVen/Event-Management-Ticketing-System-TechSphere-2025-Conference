import EventCard from '../EventCard/EventCard';
import { useNavigate } from 'react-router-dom';

const events = [
  {
    title: 'BestSeller Book Bootcamp - write, Market & Publish Your Book - Lucknow',
    date: 'Saturday, March 18, 9:30PM',
    type: 'ONLINE EVENT',
    location: 'Attend anywhere',
  },
  {
    title: 'BestSeller Book Bootcamp - write, Market & Publish Your Book - Lucknow',
    date: 'Saturday, March 18, 9:30PM',
    type: 'ONLINE EVENT',
    location: 'Attend anywhere',
  },
  {
    title: 'BestSeller Book Bootcamp - write, Market & Publish Your Book - Lucknow',
    date: 'Saturday, March 18, 9:30PM',
    type: 'ONLINE EVENT',
    location: 'Attend anywhere',
  },
  {
    title: 'BestSeller Book Bootcamp - write, Market & Publish Your Book - Lucknow',
    date: 'Saturday, March 18, 9:30PM',
    type: 'ONLINE EVENT',
    location: 'Attend anywhere',
  },
  {
    title: 'BestSeller Book Bootcamp - write, Market & Publish Your Book - Lucknow',
    date: 'Saturday, March 18, 9:30PM',
    type: 'ONLINE EVENT',
    location: 'Attend anywhere',
  },
  {
    title: 'BestSeller Book Bootcamp - write, Market & Publish Your Book - Lucknow',
    date: 'Saturday, March 18, 9:30PM',
    type: 'ONLINE EVENT',
    location: 'Attend anywhere',
  },
];

const UpcomingEvents = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          Upcoming <span className="text-purple-600">Events</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.map((event, idx) => (
          <EventCard key={idx} {...event} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/events')}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
