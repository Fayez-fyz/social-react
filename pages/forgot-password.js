import React, { useState,useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import ForgotPasswordForm from "../components/forms/ForgotPassForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setemail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secret, setsecret] = useState("");
  const [ok, setok] = useState(false);
  const [loading, setloading] = useState(false);

  const[state]=useContext(UserContext) 
  const router= useRouter(); 
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(name, email, password, secret);
      setloading(true);
      const { data } = await axios.post(`/forgot-password`, {
        email,
        newPassword,
        secret,
      });
  
      console.log("forgot password res => ", data);
  
      if (data.error) {
        toast.error(data.error);
        setloading(false);
      }
  
      if (data.success) {
        setemail("");
        setNewPassword("");
        setsecret("");
        setok(true);
        setloading(false);
      }
    } catch (err) {
      console.log(err);
      setloading(false);
    }
  };
  if(state && state.token  ) router.push('/')
  return (
    <div className="container-fluid">
      <div className="row py-4 bg-secondary text-light">
        <div className="col text-center">
          <h2>Forget Password</h2>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-lg-4 offset-lg-4">
          <ForgotPasswordForm
            handleSubmit={handleSubmit}
            email={email}
            setemail={setemail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            secret={secret}
            setsecret={setsecret}
            loading={loading}
          />
        </div>
      </div>
      <Modal
        title="Congratulations"
        visible={ok}
        onCancel={() => setok(false)}
        footer={null}
      >
        {" "}
        <p>Congrats!, Now you can login with new password</p>
        <Link href="/login">
          <a className="btn btn-sm btn-primary">Login</a>
        </Link>
      </Modal>
      <div className='row'>
        <div className='col'>
           <p className='text-center'>You already registered?{" "}
           <Link href="/login">
          <a >Login</a>
        </Link></p>
        </div>
      </div>     
    </div>
  );
};

export default ForgotPassword;
