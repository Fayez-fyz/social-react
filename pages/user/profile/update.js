import React, { useState,useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import { Avatar } from "antd";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import { CameraOutlined,LoadingOutlined } from "@ant-design/icons";

const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [secret, setsecret] = useState("");
  const [ok, setok] = useState(false);
  const [loading, setloading] = useState(false);

  const[state,setState]=useContext(UserContext)  
  const router= useRouter(); 

  //profile image
  const[image,setImage] = useState({})
  const[uploading,setUploading] = useState(false)

  useEffect(() => {
     if(state && state.user){
        setUsername(state.user.username)
        setAbout(state.user.about)
        setname(state.user.name)
        setemail(state.user.email)
        setImage(state.user.image)
     }
  }, [state && state.user])
 
  let handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name,email,password,secret)
    setloading(true)
    try {
      const {data} = await axios.put(`/profile-update`, {
        username,
        about,
        name,
        email,
        password,
        secret,
        image
      });
       console.log('update response',data)
      if(data.error){
        toast.error(data.error)
        setloading(false)
      }else{
       //update local storage,update user, keep token
      let auth = JSON.parse(localStorage.getItem('auth'))
      auth.user = data;
      localStorage.setItem('auth',JSON.stringify(auth))
      //update context
      setState({...state,user:data})
      setok(true);
      setloading(false);  
      }
    } catch(error) {
      toast.error(error.response.data);
      setloading(false);
    }
  };
  const handleImage = async(e) =>{
    const file = e.target.files[0]
    let formData = new FormData()
    formData.append('image',file)
    // console.log([...formData])
    setUploading(true)
    
   try {
     const {data} =await axios.post('/upload-image', formData)
     console.log('uploader image =>',data)
     setImage({
       url:data.url,
       public_id:data.public_id,
     })
     setUploading(false)
   } catch (error) {
     console.log(error)
     setUploading(false)
   }
  }
  
  return (
    <div className="container-fluid">
      <div className="row py-4 bg-secondary text-light">
        <div className="col text-center">
          <h2>Profile</h2>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-lg-4 offset-lg-4">
        <label className='d-flex justify-content-center h1'>
        {
          image&& image.url?(<Avatar size={120} src={image.url} className='mt-1'/>):
          uploading?(<LoadingOutlined className='h1 mt-2'/>):(<CameraOutlined className=' h1 mt-2'/>)
        }
            <input onChange={handleImage} type='file' accept='images/*' hidden />
      
        </label >
          <AuthForm
            profileUpdate={true}
            username={username}
            setUsername={setUsername}
            about={about}
            setAbout={setAbout}
            handleSubmit={handleSubmit}
            name={name}
            setname={setname}
            email={email}
            setemail={setemail}
            password={password}
            setpassword={setpassword}
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
        <p>You have successfully updated the profile</p>
      </Modal>
      {/* <div className='row'>
        <div className='col'>
           <p className='text-center'>You already registered?{" "}
           <Link href="/login">
          <a >Login</a>
        </Link></p>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileUpdate;
