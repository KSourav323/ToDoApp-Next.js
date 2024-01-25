'use client';
import Link from "next/link";
import { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import './login.css'
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

function Login()
{
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(event){
        event.preventDefault()
        
        axios.post('http://localhost:8080/login/', {email, password})
        .then(res=>{
          const usernotes = res.data.notes
            if(res.status==200) 
            {
              const queryString = `?email=${email}`; 
              const path = '/profile' + queryString;
              router.push(path);
            }
            else if(res.data=='notsuccess')
            {
                alert('invalid details')
                router.push('/')
            }
        })
        .catch(err=>{
            console.log(err)
            alert('exception')
            router.push('/')
    })


 }
  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <IoIosMail className="icon" />
          </div>
          <div className="input-box">
            <input type="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <FaLock className="icon"/>
          </div>
          <div className="remember-forgot">
              <label><input type="checkbox" />Remember me</label>
              <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
              <p>Don't have an account? <Link href="/signup">Register</Link></p>
          </div>
        </form>
    </div>
  );
}

export default Login