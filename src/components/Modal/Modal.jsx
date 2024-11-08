import React, { useState } from "react";
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';
import 'react-clock/dist/Clock.css';

const Modal = ({isModalOpen, setIsModalOpen, parkingNumber, isBooked}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [value, onChange] = useState(['10:00', '11:00']);

    const setModalOpenHandler =  () => {
        setIsModalOpen(false)
    }
    return (
        <div className={`relative z-10 ${isModalOpen ? 'block' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isBooked ? 'bg-red-100' : 'bg-green-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                                <h6 className={`font-bold ${isBooked ? 'text-red-800' : 'text-green-800'}`}>{parkingNumber}</h6>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-base font-semibold text-gray-900" id="modal-title">{isBooked ? 'Parking Unavailable' : 'Parking Available'}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Skip the hassle and guarantee your spot! Book your parking in advance for a stress-free experience.</p>
                                    <p className="text-sm text-gray-500 mt-2">Parking available for <strong>30 minutes</strong>; reservations will be automatically canceled after this time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
        
                        <div className="bg-white px-4 rounded-lg shadow mx-auto">
                            <form action="">
                                {isBooked ? 
                                <>
                                    <p for="name" className="block mb-2 text-sm text-gray-600">Booked By : Name</p>
                                    <p for="name" className="block mb-2 text-sm text-gray-600">Car Number : Number</p>
                                </>
                                : 
                                 <>
                                    <input type="text" id="parkingNumber" name="parkingNumber" value={{parkingNumber}} hidden/>
                                    <div className="mb-5">
                                        <label for="name" className="block mb-2 font-bold text-gray-600">Name</label>
                                        <input type="text" id="name" name="name" placeholder="Enter your fullname." className="border border-gray-300 shadow p-3 w-full rounded mb-"></input>
                                    </div>

                                    <div className="mb-5">
                                        <label for="carNumber" className="block mb-2 font-bold text-gray-600">Car Number *</label>
                                        <input type="text" id="carNumber" required name="carNumber" placeholder="Enter your car number" className="border border-gray-300 shadow p-3 w-full rounded mb-"></input>

                                    </div>

                                    <div className="mb-5">
                                        <label for="name" className="block mb-2 font-bold text-gray-600">Choose Date</label>
                                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="border border-gray-300 shadow p-3 w-full rounded" />
                                    </div>

                                    <div className="mb-5">
                                        <label for="name" className="block mb-2 font-bold text-gray-600">Choose Date</label>
                                        <TimeRangePicker onChange={onChange} value={value} />
                                    </div>
                                </>
                                }
                               
                               
                                <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    {isBooked ? <button type="submit" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Cencel your parking</button> : <button type="submit" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Book your parking</button>} 
                                    <button onClick={setModalOpenHandler} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                </div>
                        
                            </form>
                        </div>

                    </div>
                </div>
            </div>
           
        </div>
    )
}

export default Modal;