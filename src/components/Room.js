import React, { useState } from 'react'
import { Modal, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom'

function Room({ room, fromdate, todate }) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className='row bs'>
            <div className='col-md-4'>
                <img src={room.imageurls[0]} className='smallimg' alt='' />
            </div>
            <div className='col-md-7'>
                <h1>{room.name}</h1>
                <b>
                    <p>Max Count: {room.maxcount}</p>
                    <p>Phone Number: {room.phonenumber}</p>
                    <p>Type: {room.type}</p>
                </b>
                <div style={{ float: 'right', display: 'flex', gap: '5px' }}>
                    {((fromdate !== 'Choose a date') && (todate !== 'Choose a date')) && (
                        <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
                            <button className='btn btn-primary ml-5'>Book Now</button>
                        </Link>
                    )}

                    <button className='btn btn-primary' onClick={handleShow}>View Details</button>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{room.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        {room.imageurls.map((url, index) => {
                            return <Carousel.Item key={index}>
                                <img
                                    className='d-block w-100 bigimg'
                                    src={url}
                                    alt='first slide'
                                />
                            </Carousel.Item>
                        })}
                    </Carousel>
                    <p>{room.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Room