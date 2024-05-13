import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import StripeCheckout from 'react-stripe-checkout';
import CustomStripeCheckout from '../components/CustomStripeCheckout';
import Swal from 'sweetalert2'

function Bookingscreen() {
  const [room, setRoom] = useState({ name: "abc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { roomid, fromdate, todate } = useParams();

  function calculateDaysDifference(fromDate, toDate) {
    const oneDay = 24 * 60 * 60 * 1000; // Số mili giây trong một ngày

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const differenceInDays = Math.round(Math.abs((from - to) / oneDay));

    return differenceInDays;
  }

  const fromDate = fromdate;
  const toDate = todate;

  const daysDifference = calculateDaysDifference(fromDate, toDate);
  console.log(daysDifference);

  const totaldays = daysDifference + 1

  function calculateMonthsDifference(fromDate, toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const fromYear = from.getFullYear();
    const fromMonth = from.getMonth();

    const toYear = to.getFullYear();
    const toMonth = to.getMonth();

    const differenceInYears = toYear - fromYear;
    const differenceInMonths = (differenceInYears * 12) + (toMonth - fromMonth);

    return differenceInMonths;
  }

  const monthsDifference = calculateMonthsDifference(fromDate, toDate);
  console.log(monthsDifference);


  const totalamount = monthsDifference > 0 ? monthsDifference * room.rentperday : (daysDifference + 1) * 200
  useEffect(() => {

    if (!localStorage.getItem('currentUser')) {
      window.location.replace('/login')
    }

    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/rooms/getroombyid", { roomid: roomid });
        if (isMounted) {
          setRoom(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
          setError(true);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [roomid]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error />
  }

  // Kiểm tra nếu dữ liệu room đã được tải, nếu chưa, trả về null để tránh lỗi
  if (!room.name || !room.imageurls) {
    return null;
  }

  async function bookRoom() {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalamount,
      totaldays

    }

    try {
      setLoading(true)
      const result = await axios.post('/api/bookings/bookroom', bookingDetails)
      setLoading(false)
      Swal.fire('Congratulation', 'Your Room Booked Successfully', 'success').then(result => {
        window.location.href = '/home'
      })
    } catch (error) {
      setLoading(false)
      Swal.fire('Opps', 'Something went wrong', 'error')
    }
  }

  function onToken(token) {
    console.log(token);
  }

  function convertToShortDate(longDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dateObj = new Date(longDate);
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const dayOfWeek = days[dateObj.getDay()];

    return `${dayOfWeek}, ${day} ${month} ${year}`;
  }


  const shortDate = convertToShortDate(fromdate);
  const shortDate2 = convertToShortDate(todate);

  
  return (
    <div className='m-5'>
      <div className='row justify-content-center mt-5 bs'>
        <div className='col-md-6'>
          <h1>{room.name}</h1>
          <img src={room.imageurls[0]} className='bigimg' alt='' />
        </div>
        <div className='col-md-6'>
          <div style={{ textAlign: "right" }} >
            <h1>Booking Details</h1>
            <hr />

            <b>
              <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
              <p>From Date: {shortDate}</p>
              <p>To Date: {shortDate2}</p>
              <p>Max count: {room.maxcount}</p>
            </b>
          </div>

          <div style={{ textAlign: "right" }}>
            <b>
              <h1>Amount</h1>
              <hr />
              {monthsDifference > 0 ? <p>Total Month: {monthsDifference}</p> : <p>Total Day: {totaldays}</p>}
              {monthsDifference > 0 ? <p>Rent Per Month: {room.rentperday}</p> : <p>Rent Per Day: 200</p>}
              <p>Total Amount: {totalamount}</p>
            </b>
          </div>

          <div style={{ float: 'right' }}>
            <button className='btn btn-primary' onClick={bookRoom}>Pay now</button>
            {/* <StripeCheckout
              amount={totalamount * 100}
              token={onToken}
              currency='USD'
              stripeKey="pk_test_51PFE2LRuzRgXA0nkKBUnDkqrUbf7Se8LThbkNRMAsd28P7Gi5YAlAYTiN84OfHuDJdY9ISmFb482JdhG7BkRaVoH007PjCxCI6"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
