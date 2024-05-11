import axios from 'axios'
import React, { useState } from 'react'
import Loader from '../components/Loader';
import Error from '../components/Error';

function Loginscreen() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function login() {
      const user = {
        email,
        password
      };
      try {
        setLoading(true)
        const response = await axios.post('/api/users/login', user);
        const result = response.data; // Lấy dữ liệu từ phản hồi
        console.log(result); // In ra dữ liệu từ server nếu cần
        setLoading(false)
        localStorage.setItem('currentUser', JSON.stringify(result))
        window.location.href='/home'
      } catch (error) {
        console.error(error);
        setLoading(false)
        setError(true)
      }
    }

  return (
    <div>
      {loading && (<Loader/>)}
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5'>
          {error && (<Error message='Invalid Credentionals' />)}
          <div className='bs'> 
            <h2>Login</h2>
            <input type='text' className='form-control' placeholder='Email'
            value={email} onChange={(e) => {setemail(e.target.value)}} />
            <input type='text' className='form-control' placeholder='Password'
            value={password} onChange={(e) => {setpassword(e.target.value)}} />
            <button className='btn btn-primary mt-3' onClick={login}>Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loginscreen
