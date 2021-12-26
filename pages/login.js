import React, { useState,useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import {useRouter} from 'next/router'
import {UserContext} from '../context'
const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);

  const[state,setState] = useContext(UserContext)
  const router = useRouter();
  
  let handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name,email,password,secret)
    setloading(true)
    try {
      const {data} = await axios.post(`/login`, {
        email,
        password,
        });
        if(data.error){
          toast.error(data.error)
          setloading(false)
        }else{
              // console.log(data)
        //update context
     setState({
      user:data.user,
      token:data.token,
    }) 
    //save in local storage
    window.localStorage.setItem("auth",JSON.stringify(data)) 
     router.push('/user/dashboard')
        }  

      
    } catch (error) {
      toast.error(error.response.data);
      setloading(false);
    }
  };

  if(state && state.token  ) router.push('/user/dashboard')
  return (
    <div className="container-fluid">
      <div className="row py-4 bg-secondary text-light">
        <div className="col text-center">
          <h2>Login</h2>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-lg-4 offset-lg-4">
          <AuthForm
            handleSubmit={handleSubmit}
            email={email}
            setemail={setemail}
            password={password}
            setpassword={setpassword}
            loading={loading}
            page='login'
          />
        </div>
      </div>
      <div className='row'>
        <div className='col'>
           <p className='text-center'>Not yet registered?{" "}
           <Link href="/register">
          <a >Register</a>
        </Link></p>

        </div>
      </div>
      <div className='row'>
        <div className='col'>
           <p className='text-center '>
           <Link href="/forgot-password">
          <a  className='text-danger'>Forgot password</a>
        </Link></p>
        </div>
      </div> 
    </div>
  );
};

export default Login;

