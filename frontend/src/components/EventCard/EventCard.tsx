import imageUrl from '../../assets/Event.png';

interface EventCardProps {
  title: string;
  date: string;
  type: string;
  location: string;
//   imageUrl: string;
  isFree?: boolean;
}

const EventCard = ({ title, date, type, location, isFree = true }: EventCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        {isFree && (
          <span className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
            Latest
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        <p className="text-purple-600 text-xs mt-1">{date}</p>
        <p className="text-gray-500 text-xs mt-1">{type} - {location}</p>
      </div>
    </div>
  );
};

export default EventCard;
