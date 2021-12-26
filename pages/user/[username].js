import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Avatar, Card } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import axios from "axios";
import Link from "next/link";
import { RollbackOutlined } from "@ant-design/icons";

const { Meta } = Card; //card.meta
const Username = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (router.query.username) {
      fetchUser();
    }
  }, [router.query.username]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user/${router.query.username}`);
      console.log("follow response", data);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const imageSource = (user) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/no-profile-logo.png";
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
      {/* <pre>{JSON.stringify(user,null,4)}</pre> */}
      <div className="px-5 py-3">
       
        <Card hoverable cover={<img src={imageSource(user)} alt={user.name} width='' height='250' />}>
          <Meta title={user.name} description={user.about} />
          <p className="pt-2 text-muted">
            Joined {moment(user.createdAt).fromNow()}
          </p>
          <div className="d-flex justify-content-between">
            <span className="btn btn-sm">
              {user.followers && user.followers.length} Followers
            </span>
            <span className="btn btn-sm">
              {user.following && user.following.length} Following 
            </span>
          </div>
        </Card>
        <div className='py-4 d-flex justify-content-center'>
        <Link href="/user/dashboard">
          <a className="btn btn-outline-secondary text-dark h4 ">
            <RollbackOutlined size={100} className='mb-1' />
          </a>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Username;
