import { Button } from 'antd';
import image from '../../assets/image 3.png';

const AdvertisementBanner = () => {
  return (
    <div className="w-full h-auto md:h-[300px] flex items-end justify-center bg-[#10107B]">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-2/3 pt-4 md:pt-0 gap-6  lg:w-[1000px] h-full">
            <img src={image} alt="image" />
            <div className='h-full text-white space-y-2 flex flex-col justify-center items-center text-center md:text-left md:items-start'>
                <h3 className='text-2xl md:text-4xl font-semibold'>Create an Event</h3>
                <p className='text-lg md:text-xl'>Create your own event by joining the organizer program.</p>
                <Button type='default' className='px-4 py-2 max-w-fit'>Create Events</Button>
            </div>
        </div>

    </div>
  )
}

export default AdvertisementBanner