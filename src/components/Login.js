import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Login = (props) => {
      const [credentials, setCredentials] = useState({ email: "", password: "" })
      let history = useHistory();

      const handleSubmit = async (e) => {
            const { name, email, password } = credentials;
            e.preventDefault();

            const response = await fetch(`http://localhost:5000/api/auth/login`, {
                  method: 'POST',
                  headers: {
                        'content-type': 'application/json',

                  },
                  body: JSON.stringify({ name, email, password })
            });
            const json = await response.json();
            console.log(json)
            if (json.success) {
                  //save the auth token & redirecting
                  localStorage.setItem('token', json.authtoken)
                  history.push('/')
                  props.showAlert('Successfully Logged in.', 'success')
            } else {
                  props.showAlert('Invalid Credentials', 'danger')
            }
      }

      const onChange = (e) => {
            setCredentials({ ...credentials, [e.target.name]: e.target.value })
      }

      return (
            <div className='container my-2'>
                  <h2>Login to continue to iNotebook - your personal online notebook</h2>
                  <form onSubmit={handleSubmit}>
                        <div className="form-group">
                              <label htmlFor="email">Email address</label>
                              <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name='email' aria-describedby="emailHelp" placeholder="Enter your email" />
                              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                              <label htmlFor="password">Password</label>
                              <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name='password' placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary my-2">Submit</button>
                  </form>
            </div>
      )
}

export default Login
