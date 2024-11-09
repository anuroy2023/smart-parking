import Car from '../Icon/Car'
const ParkingSpace = ({onClick, parkingDetail}) => {
    return (
        <> 
            <button onClick={onClick} className={`border-yellow-300 last:border-0 border-r-4 h-full w-full`}>
                {parkingDetail.isBooked &&  <div className='m-auto flex justify-center'><Car /></div>}
                {!parkingDetail.isBooked && <div className={`w-10 h-10 rounded-3xl text-sm font-bold flex items-center justify-center m-auto ${parkingDetail.reserved ? 'bg-red-600' : 'bg-green-600'}`}>{parkingDetail.slot}
                   
                </div>}
                {parkingDetail.reserved && <span className='text-xs block'>Reserved</span>}
            </button>
        </>
    )
}
export default ParkingSpace;