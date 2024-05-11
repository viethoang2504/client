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

  // Hàm chuyển đổi ngày từ dạng "DD-MM-YYYY" sang "MM-DD-YYYY" để phù hợp với định dạng chuẩn của JavaScript Date Object
  const convertToDateObject = (dateString) => {
    const parts = dateString.split('-');
    return `${parts[1]}-${parts[0]}-${parts[2]}`;
  }

  // Chuyển đổi các ngày từ chuỗi sang đối tượng Date
  const fromDateObj = new Date(convertToDateObject(fromdate));
  const toDateObj = new Date(convertToDateObject(todate));

  // Tính số mili giây giữa hai ngày
  const timeDifference = toDateObj.getTime() - fromDateObj.getTime();

  // Chuyển đổi số mili giây thành số ngày
  const totaldays = timeDifference > 0 ? timeDifference / (1000 * 3600 * 24) + 1 : 0;

  const totalamount = totaldays * room.rentperday

  useEffect(() => {
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
        window.location.href='/bookings'
      })
    } catch (error) {
      setLoading(false)
      Swal.fire('Opps', 'Something went wrong', 'error')
    }
  }

  function onToken(token) {
    console.log(token);
  }

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
              <p>From Date: {fromdate}</p>
              <p>To Date: {todate}</p>
              <p>Max count: {room.maxcount}</p>
            </b>
          </div>

          <div style={{ textAlign: "right" }}>
            <b>
              <h1>Amount</h1>
              <hr />
              <p>Total days: {totaldays}</p>
              <p>Rent per day: {room.rentperday}</p>
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
