import React, { useEffect, useState } from 'react';
import { Button, Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2'

const { TabPane } = Tabs
const operations = <Button>Extra Action</Button>;

const items = new Array(4).fill(null).map((_, i) => {
    const id = String(i + 1);
    if (id === '1') {
        return {
            label: `Bookings`,
            key: id,
            children:
                <Bookings />
            ,
        };
    }
    if (id === '2') {
        return {
            label: `Rooms`,
            key: id,
            children:
                <Rooms />
            ,
        };
    }
    if (id === '3') {
        return {
            label: `Add Room`,
            key: id,
            children:
                <AddRoom />
            ,
        };
    }
    if (id === '4') {
        return {
            label: `Users`,
            key: id,
            children:
                <Users />
            ,
        };
    }
});

function Adminscreen() {

    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (!user.isAdmin) {
        // window.location.href = '/home'
        return <div>
            <div className="not-found">
                <img
                    src="https://www.vizion.com/wp-content/smush-webp/2018/09/shutterstock_479042983.jpg.webp"
                    alt="not-found"
                    style={{ width: "20%", height: "auto" }}
                />
                <Link to="/home" className="link-home">
                    Go Home
                </Link>
            </div>
        </div>
    }

    return (
        <div className='mt-3 ml-3 bs' style={{ marginLeft: '15px', marginRight: '15px' }}>
            <h2 className='text-center' style={{ fontSize: '30px' }}>Admin Panel</h2>
            <Tabs tabBarExtraContent={operations} items={items} />
        </div>
    )
}

export default Adminscreen

export function Bookings() {

    const [bookings, setbookings] = useState([])
    const [loading, setloading] = useState(true)
    const [error, seterror] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setloading(true);
                const response = await axios.get("/api/bookings/getallbookings");
                setbookings(response.data);
            } catch (error) {
                console.log(error);
                seterror(error);
            } finally {
                setloading(false);
            }
        };

        fetchData();
    }, []);

    function DateConverter({ dateString }) {
        const [formattedDate, setFormattedDate] = useState('');

        useEffect(() => {
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                const formattedDay = day < 10 ? '0' + day : day;
                const formattedMonth = month < 10 ? '0' + month : month;

                return `${formattedDay}-${formattedMonth}-${year}`;
            };

            setFormattedDate(formatDate(dateString));
        }, [dateString]);

        return <span>{formattedDate}</span>;
    }


    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Bookings</h1>
                {loading && (<Loader />)}

                <table className='table table-bordered table-dark'>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>User ID</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length && (bookings.map(booking => {
                            return (
                                <tr>
                                    <td>{booking._id}</td>
                                    <td>{booking.userid}</td>
                                    <td>{booking.room}</td>
                                    <td><DateConverter dateString={booking.fromdate} /> </td>
                                    <td><DateConverter dateString={booking.todate} /></td>
                                    <td>{booking.status}</td>
                                </tr>
                            )
                        }))}
                    </tbody>

                </table>

            </div>
        </div>
    )
}

export function Rooms() {

    const [rooms, setrooms] = useState([])
    const [loading, setloading] = useState(true)
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
        <div className='row'>
            <div className='col-md-12'>
                <h1>Rooms</h1>

                <table className='table table-bordered table-dark'>
                    <thead>
                        <tr>
                            <th>Room ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent Per Day</th>
                            <th>Max Count</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rooms.length && (rooms.map(room => {
                            return (
                                <tr>
                                    <td>{room._id}</td>
                                    <td>{room.name}</td>
                                    <td>{room.type}</td>
                                    <td>{room.rentperday}</td>
                                    <td>{room.maxcount}</td>
                                    <td>{room.phonenumber}</td>
                                </tr>
                            )
                        }))}
                    </tbody>

                </table>

            </div>
        </div>
    )
}

export function Users() {

    const [users, setusers] = useState([])
    const [loading, setloading] = useState(true)
    const [error, seterror] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setloading(true)
                const response = await fetch('/api/users/getallusers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setusers(data) // In ra dữ liệu lấy được từ API
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
        <div className='row'>
            <div className='col-md-12'>
                <h1>Users</h1>

                <table className='table table-bordered table-dark'>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length && (users.map(user => {
                            return (
                                <tr>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                                </tr>
                            )
                        }))}
                    </tbody>

                </table>

            </div>
        </div>
    )
}

export function AddRoom() {

    const [name, setname] = useState('')
    const [rentperday, setrentperday] = useState()
    const [maxcount, setmaxcount] = useState()
    const [phonenumber, setphonenumber] = useState()
    const [description, setdescription] = useState()    

    const [type, settype] = useState()
    const [imageurl1, setimageurl1] = useState()
    const [imageurl2, setimageurl2] = useState()
    const [imageurl3, setimageurl3] = useState()

    async function addRooms() {
        const newroom = {
            name,
            rentperday,
            maxcount,
            phonenumber,
            description,
            type,
            imageurls: [imageurl1, imageurl2, imageurl3]
        }

        try {
            const response = await axios.post('/api/rooms/addroom', newroom);
            const result = response.data; // Lấy dữ liệu từ phản hồi
            console.log(result); // In ra dữ liệu từ server nếu cần
            Swal.fire('Congratulation', "Your New Room Added Successfully", 'success')
          } catch (error) {
            console.error(error);
            Swal.fire('Oops', 'Something went wrong', 'error')
          } 

    }

    return (
        <div className='row'>
            <div className='col-md-5'>

                <input type='text' className='form-control' placeholder='Room Name' 
                value={name} onChange={(e) => {setname(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='Rent Per Day' 
                value={rentperday} onChange={(e) => {setrentperday(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='Max Count' 
                value={maxcount} onChange={(e) => {setmaxcount(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='Phone Number' 
                value={phonenumber} onChange={(e) => {setphonenumber(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='Description' 
                value={description} onChange={(e) => {setdescription(e.target.value)}}
                />

            </div>

            <div className='col-md-5'>

                <input type='text' className='form-control' placeholder='Type'  
                value={type} onChange={(e) => {settype(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='Image URL 1'  
                value={imageurl1} onChange={(e) => {setimageurl1(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='Image URL 2'  
                value={imageurl2} onChange={(e) => {setimageurl2(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='Image URL 3'  
                value={imageurl3} onChange={(e) => {setimageurl3(e.target.value)}}
                />
                
                <div className='text-right'>

                    <button className='btn btn-primary mt-2' onClick={addRooms}>Add Room</button>

                </div>

            </div>
        </div>
    )
}


