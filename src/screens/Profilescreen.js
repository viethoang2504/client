import React, { useEffect, useMemo, useState } from 'react';
import { Button, Tabs } from 'antd';
import axios from 'axios'
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'
import { Divider, Flex, Tag } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
  } from '@ant-design/icons';

const { TabPane } = Tabs
const operations = <Button>Extra Action</Button>;

const items = new Array(3).fill(null).map((_, i) => {
    const id = String(i + 1);
    if (id === '1') {
        return {
            label: `Profile`,
            key: id,
            children:
                <Profiles />
            ,
        };
    }
    if (id === '2') {
        return {
            label: `Bookings`,
            key: id,
            children:
                <MyBookings />
            ,
        };
    }
});
const Profilescreen = () => {

    const user = JSON.parse(localStorage.getItem('currentUser'))

    useEffect(() => {
        if (!user) {
            window.location.href('/login')
        }
    }, [])

    return (

        <div className='ml-3 mt-3 profile-tabs-container'>
            <Tabs tabBarExtraContent={operations} items={items} />
        </div>

    );
};
export default Profilescreen;

export function MyBookings() {

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [bookings, setbookings] = useState([])
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState()


    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user._id) {
                console.error('User ID is missing');
                return;
            }

            try {
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
                console.log(response.data);
                setbookings(response.data)
                setloading(false)
            } catch (error) {
                console.error(error);
                setloading(false)
                seterror(error)
            }
        };

        fetchData();
    }, []);

    async function cancelBooking(bookingid, roomid) {

        try {
            setloading(true)
            const result = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid }).data
            console.log(result);
            setloading(false)
            Swal.fire('Congrats', 'Your Booking has been cancelled', 'success').then(result => {
                window.location.reload()
            })
        } catch (error) {
            console.log(error);
            setloading(false)
            Swal.fire('Oops', 'Something went wrong', 'error')

        }

    }

    return (
        <div>
            <div className='row'>
                <div className='col-md-6'>
                    {loading && (<Loader />)}
                    {bookings && (bookings.map(booking => {
                        return <div className='bs' style={{ position: 'relative' }}>
                            <h1>{booking.room}</h1>
                            <p><b>Booking ID:</b> {booking._id}</p>
                            <p><b>Check In:</b> {booking.fromdate}</p>
                            <p><b>Check Out:</b> {booking.todate}</p>
                            <p><b>Amount:</b> {booking.totalamount}</p>
                            <p>
                                <b>Status:</b> 
                                <span style={{ marginRight: '8px' }}></span>
                                {booking.status === 'cancelled' ? (<Tag icon={<CloseCircleOutlined />} color="red">Cancelled</Tag>) : <Tag icon={<CheckCircleOutlined />} color="green">Confirmed</Tag>}
                            </p>

                            {booking.status !== 'cancelled' &&
                                <div className='text-right' style={{ position: 'absolute', bottom: 8, right: 8 }}>
                                    <button className='btn btn-primary' onClick={() => { cancelBooking(booking._id, booking.roomid) }}>CANCEL BOOKING</button>
                                </div>
                            }
                        </div>
                    }))}
                </div>
            </div>
        </div>
    )
}

export function Profiles() {

    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user._id) {
                console.error('User ID is missing');
                return;
            }

            try {
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <br />
            <h1>Name: {user.name}</h1>
            <h1>Email: {user.email}</h1>
            <h1>Is Admin: {user.isAdmin ? 'Yes' : 'No'}</h1>
        </div>
    )
}
