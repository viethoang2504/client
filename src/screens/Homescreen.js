import React, { useEffect, useState } from 'react'
import Room from '../components/Room'
import Loader from '../components/Loader'
import Error from '../components/Error'
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function Homescreen() {

  const [rooms, setrooms] = useState([])
  const [loading, setloading] = useState()
  const [error, seterror] = useState()

  const [fromdate, setfromdate] = useState('Choose a date')
  const [todate, settodate] = useState('Choose a date')
  const [duplicaterooms, setduplicaterooms] = useState([])

  const [searchkey, setsearchkey] = useState()
  const [type, settype] = useState('all')

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
        setduplicaterooms(data)
        setloading(false)
      } catch (error) {
        seterror(true)
        console.error('Error fetching data:', error);
        seterror(false)
      }
    };

    fetchData();

  }, []);

  const dayjs = require('dayjs');

  function filterByDate(dates) {
    const formattedDate = dayjs(dates[0], 'DD-MM-YYYY');
    const formattedDate1 = dayjs(dates[1], 'DD-MM-YYYY');
    setfromdate(formattedDate);
    settodate(formattedDate1);

    var temprooms = [];
    var availability = true;

    // Chuyển đổi ngày nhập vào thành timestamp
    const timestampToCheck1 = formattedDate.valueOf();
    const timestampToCheck2 = formattedDate1.valueOf();

    for (const room of duplicaterooms) {
      if (room.currentbookings.length > 0) {
        availability = true;

        for (const booking of room.currentbookings) {
          // Chuyển đổi booking.fromdate và booking.todate thành đối tượng thời gian
          const fromDate1 = dayjs(booking.fromdate, 'ddd, DD MMM YYYY HH:mm:ss z').valueOf();
          const toDate1 = dayjs(booking.todate, 'ddd, DD MMM YYYY HH:mm:ss z').valueOf();

          // Kiểm tra xem có giao nhau giữa khoảng thời gian đặt phòng và khoảng thời gian người dùng không
          if (
            (timestampToCheck1 <= toDate1 && timestampToCheck1 >= fromDate1) ||
            (timestampToCheck2 >= fromDate1 && timestampToCheck2 <= toDate1) ||
            (timestampToCheck1 <= fromDate1 && timestampToCheck2 >= toDate1)
          ) {
            availability = false;
            break;
          }
        }
      }

      if (availability || room.currentbookings.length === 0) {
        temprooms.push(room);
      }

      setrooms(temprooms);
    }
  }

  function filterBySearch() {

    const temprooms = duplicaterooms.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()))

    setrooms(temprooms)

  }

  function filterByType(e) {

    settype(e)

    if (e !== 'all') {
      const temprooms = duplicaterooms.filter(room => room.type.toLowerCase() === e.toLowerCase())

      setrooms(temprooms)
    } else {
      setrooms(duplicaterooms)
    }

  }

  return (
    <div className='container'>

      <div className='row mt-5 bs'>
        <div className='col-md-3'>
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>

        <div className='col-md-6 d-flex justify-content-center'>
          <input
            type='text'
            className='form-control mx-auto'
            placeholder='Search rooms'
            value={searchkey}
            onChange={(e) => { setsearchkey(e.target.value) }}
            onKeyUp={filterBySearch}
            style={{marginTop: '0px'}}
          />
        </div>

        <div className='col-md-3'>
          <select className="custom-select" value={type} onChange={(e) => { filterByType(e.target.value) }}>
            <option value="all">All</option>
            <option value="Cheap">Cheap</option>
            <option value="Normal">Normal</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>
      </div>

      <div className='row justify-content-center mt-5'>
        {loading ? (<Loader />) : (rooms.map(room => {
          return <div className='col-md-9' key={room._id}>
            <Room room={room} fromdate={fromdate} todate={todate} />
          </div>
        }))}
      </div>
    </div>
  )
}

export default Homescreen