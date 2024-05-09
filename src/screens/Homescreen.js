import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Room from '../components/Room'
import Loader from '../components/Loader'
import Error from '../components/Error'

function Homescreen() {

    const [rooms, setrooms] = useState([])
    const [loading, setloading] = useState()
    const [error, seterror] = useState()

    useEffect(() => {
        const fetchData = async () => {
          try {
            setloading(true)
            const response = await fetch('/api/rooms/getallrooms');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setrooms(data) // In ra dữ liệu lấy được từ API
            setloading(false)
          } catch (error) {
            seterror(true)
            console.error('Error fetching data:', error);
            seterror(false)
          }
        };
    
        fetchData();
    
      }, []);


    return (
        <div className='container'>
            <div className='row justify-content-center mt-5'>
                {loading ? (<Loader/>) : error ? (<Error/>) : (rooms.map(room => {
                    return <div className='col-md-9'>
                        <Room room={room}/>
                    </div>
                }))}
            </div>
        </div>
    )
}

export default Homescreen