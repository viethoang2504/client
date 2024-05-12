import React from 'react';
import { Link } from 'react-router-dom';

function Landingscreen() {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className='row landing justify-content-center align-items-center' style={{ height: "calc(100vh - 72px)" }}>
                <div className="text-center">
                    <h4 style={{color: 'white', fontSize: '75px', marginBottom: '50px'}}>Motel Management</h4>
                    <h1 style={{color: 'white', marginBottom: '30px'}}>Nguyen Viet Hoang - 20215384</h1>
                    <Link to='/home'>
                        <button className='abcd' style={{color: 'black', backgroundColor: 'white', borderRadius: '7px', height: '38px', width: '123px'}}>Get Started</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Landingscreen;
