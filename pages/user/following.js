import React, { useState,useEffect } from "react";
import { useContext } from "react";
import { Avatar, List } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";
const Following = () => {
  const [state,setState] = useContext(UserContext);
  const router = useRouter();
  const [people,setPeople] = useState([])


  useEffect(() => {
    if (state && state.token) {
     fetchFollowing()
    }
  }, [state && state.token]);

const fetchFollowing = async() =>{
    try {
        const {data}= await axios.get('/user-following')
        console.log('follow response',data)
        setPeople(data)
    } catch (error) {
        console.log(error)
    }
}

  const imageSource= (user) =>{
      if(user.image){
          return user.image.url;
      }else{
          return '/images/no-profile-logo.png'
      }
  }
  const handleUnFollow = async(user)=>{
    try {
        const {data}= await axios.put('/user-unfollow',{_id:user._id});
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        //update context
        setState({ ...state, user: data });
        //update people state
        let filtered = people.filter((p) => p._id !== user._id);
        setPeople(filtered);
        //rerender the post in newsfeed
        toast.error(`Unfollowed ${user.name}`);
    } catch (error) {
        console.log(error)
    }
  } 
  return (
    <div className='container'>
    {/* <pre>{JSON.stringify(people,null,4)}</pre> */}
    <h4 className='text-center py-3'>You following</h4>
    
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)}/>}
              title={
                <div className="d-flex justify-content-between">
                  {user.username}
                  <a onClick={()=> handleUnFollow(user)} className="btn btn-sm btn-primary">Unfollow</a>
                </div>
              }
            />
          </List.Item>
        )}
      />
        <div className='py-4 d-flex justify-content-center'>
        <Link href="/user/dashboard">
          <a className="btn btn-outline-secondary text-dark h4 ">
            <RollbackOutlined size={100} className='mb-1' />
          </a>
        </Link>
        </div>
    </div>
  );
};

export default Following;
