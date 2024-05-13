import axios from 'axios'
import React, { useState } from 'react'
import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

function Registerscreen() {

  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [confirmpassword, setconfirmpassword] = useState('')

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setsuccess] = useState()

  async function register() {
    if (password === confirmpassword) {
      const user = {
        name,
        email,
        password,
        confirmpassword,
      }

      try {
        setLoading(true)
        const response = await axios.post('/api/users/register', user);
        const result = response.data; // Lấy dữ liệu từ phản hồi
        console.log(result); // In ra dữ liệu từ server nếu cần
        setLoading(false)
        setsuccess(true)

        setname('')
        setemail('')
        setpassword('')
        setconfirmpassword('')

      } catch (error) {
        console.error(error);
        setLoading(false)
        setError(true)
      }
    }
    else {
      alert('Passwords not matched')
    }
  }

  return (
    <div>
      {loading && (<Loader />)}
      {error && (<Error />)}
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5'>
          {success && (<Success message='Registration success' />)}

          <div className='bs'>
            <h2>Register</h2>
            <input type='text' className='form-control' placeholder='Name'
              value={name} onChange={(e) => { setname(e.target.value) }} />
            <input type='text' className='form-control' placeholder='Email'
              value={email} onChange={(e) => { setemail(e.target.value) }} />
            <input type='password' className='form-control' placeholder='Password'
              value={password} onChange={(e) => { setpassword(e.target.value) }} />
            <input type='password' className='form-control' placeholder='Confirm password'
              value={confirmpassword} onChange={(e) => { setconfirmpassword(e.target.value) }} />

            <button className='btn btn-primary mt-3' onClick={register}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registerscreen
