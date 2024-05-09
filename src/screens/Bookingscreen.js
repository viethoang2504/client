import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';

function Bookingscreen() {
  const [room, setRoom] = useState({ name: "abc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { roomid } = useParams();

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

  return (
    <div className='m-5'>
      <div className='row justify-content-center mt-5 bs'>
        <div className='col-md-6'>
          <h1>{room.name}</h1>
          <img src={room.imageurls[0]} className='bigimg' alt='' />
        </div>
        <div className='col-md-6'>
          <div style={{textAlign: "right"}} >
            <h1>Booking Details</h1>
            <hr />

            <b>
              <p>Name: </p>
              <p>From Date: </p>
              <p>To Date: </p>
              <p>Max count: {room.maxcount}</p>
            </b>
          </div>

          <div style={{textAlign: "right"}}>
            <b>
              <h1>Amount</h1>
              <hr />
              <p>Total days: </p>
              <p>Rent per day: {room.rentperday}</p>
              <p>Total Amount: </p>
            </b>
          </div>

          <div style={{float: 'right'}}>
            <button className='btn btn-primary'>Pay now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
