import axios from 'axios'
import React, { useState } from 'react'

function Loginscreen() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
  
    async function login() {
      const user = {
        email,
        password
      };
      try {
        const response = await axios.post('/api/users/login', user);
        const result = response.data; // Lấy dữ liệu từ phản hồi
        console.log(result); // In ra dữ liệu từ server nếu cần
      } catch (error) {
        console.error(error);
      }
      console.log(user);
    }

  return (
    <div>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5'>
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
