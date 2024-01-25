'use client';
import Link from "next/link";
import { useState } from 'react'
import axios from 'axios';
import './login.css'
import { useRouter } from 'next/navigation'
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

function SignUp()
{
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(event){
        event.preventDefault()
        axios.post('http://localhost:8080/signup/', {username, email, password})
        .then(res=>{
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
            alert('invalid')
            router.push('/')
    })

    }
    return(
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className="input-box">
              <input type="text" className="form-control" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)}/>
              <FaUser className="icon"/>
            </div>
            <div className="input-box">
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <IoIosMail className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="icon"/>
            </div>

            <button type="submit">
              SignUp
            </button>
            <div className="register-link">
              <p>Already have an account? <Link href="/login">Login</Link></p>
          </div>
          </form>
        </div>

    )
}

export default SignUp
