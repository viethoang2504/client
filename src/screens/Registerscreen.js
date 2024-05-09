import axios from 'axios'
import React, { useState } from 'react'

function Registerscreen() {

  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [confirmpassword, setconfirmpassword] = useState('')

  async function register() {
    if (password === confirmpassword) {
      const user = {
        name,
        email,
        password,
        confirmpassword,
      }
      
      try {
        const response = await axios.post('/api/users/register', user);
        const result = response.data; // Lấy dữ liệu từ phản hồi
        console.log(result); // In ra dữ liệu từ server nếu cần
      } catch (error) {
        console.error(error);
      }
    }
    else {
      alert('Passwords not matched')
    }
  }

  return (
    <div>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5'>
          <div className='bs'> 
            <h2>Register</h2>
            <input type='text' className='form-control' placeholder='Name'
            value={name} onChange={(e) => {setname(e.target.value)}} />
            <input type='text' className='form-control' placeholder='Email'
            value={email} onChange={(e) => {setemail(e.target.value)}} />
            <input type='text' className='form-control' placeholder='Password'
            value={password} onChange={(e) => {setpassword(e.target.value)}} />
            <input type='text' className='form-control' placeholder='Confirm password'
            value={confirmpassword} onChange={(e) => {setconfirmpassword(e.target.value)}} />

            <button className='btn btn-primary mt-3' onClick={register}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registerscreen
