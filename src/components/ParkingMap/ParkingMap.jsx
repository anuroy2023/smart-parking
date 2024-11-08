import Modal from '../Modal/Modal'
import ParkingSpace from '../ParkingSpace/ParkingSpace';
import { useState } from 'react'

const ParkingMap = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parkingNumber, setParkingNumber] = useState('');
    const [parkingIsBooked, setParkingIsBooked] = useState(false);
    const ParkingClickHandler = (parking) => {
        setParkingNumber(parking.parkingNumber)
        setParkingIsBooked(parking.isBooked)
        setIsModalOpen(true)
    }
    console.log('isModalOpen', isModalOpen)
    const parkingDetail = [
        {
            parkingNumber : 'P1',
            isBooked: false
        },
        {
            parkingNumber : 'P2',
            isBooked: false
        },
        {
            parkingNumber : 'P3',
            isBooked: true,
        },
        {
            parkingNumber : 'P4',
            isBooked: false
        },
        {
            parkingNumber : 'P5',
            isBooked: false
        },
    ]
    return (
      <div className="App">
      <h1 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight pt-10">Smart Parking</h1>
      <p className='mt-4 text-lg text-gray-500 pb-10'>Secure your parking spot in advance and skip the stress! Book now to guarantee your space.</p>
        <div className="bg-slate-600 h-96 w-full m-auto flex justify-between relative border-8 border-dashed border-yellow-300 lg:max-w-screen-lg">
            <div className="absolute bottom-0 right-0 left-0 ">
                <p className="border-b-8 border-b-black w-24 m-auto -mb-2 text-white">Entry Gate</p>
            </div>
            <div className="h-1/3 w-full flex text-white">
                {parkingDetail.map((parking, index) => {
                    return (
                        index <= 4 && <ParkingSpace onClick={() => {
                            ParkingClickHandler(parking)
                        }} parkingDetail={parking} />
                    )
                })}
            </div>
        </div>
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} parkingNumber={parkingNumber} isBooked={parkingIsBooked} />
      </div>
    );
    
  }
  
  export default ParkingMap;