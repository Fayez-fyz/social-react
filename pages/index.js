import axios from "axios";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import ParallaxBG from "../components/cards/ParallaxBG";
import { UserContext } from "../context";
import PostPublic from "../components/cards/PostPublic";
import Head from "next/head";
import Link from "next/link";
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);

const index = ({ posts }) => {
  const [state] = useContext(UserContext);
  const [newsFeed, setNewsFeed] = useState([]);

  // useEffect(() => {
  //   console.log("SOCKET ON JOIN", socket);
  //   socket.on('receive-message',(newMessage)=>{
  //     alert(newMessage)
  //   })
  // }, []);

  useEffect(() => {
    socket.on("new-post", (newPost) => {
      setNewsFeed([newPost, ...posts]);
    });
  }, []);

  const head = () => (
    <Head>
      <title>FYZ - A Social network by devs for devs </title>
      <meta
        name="description"
        content="A social network for other web developers"
      />
      <meta
        property="og:description"
        content="A social network for other web developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="FYZ" />
      <meta property="og:url" content="http://fyzbook.com" />
      <meta
        property="og:image:secure_url"
        content="http://fyzbook.com/images/default.jpg"
      />
    </Head>
  );
  const collection = newsFeed.length > 0 ? newsFeed : posts;

  return (
    <>
      {head()}
      <ParallaxBG url="/images/uk-tele.jpg"> SOCIAL NETWORK </ParallaxBG>
      <div className="container">
        {/* <button
          onClick={() => {
            socket.emit("send-message", "This is fayez");
          }}
        >SEND</button> */}
        <div className="row pt-3">
          {collection.map((post) => (
            <div key={post._id} className="col-md-4">
              <Link href={`/post/view/${post._id}`}>
                <a>
                  <PostPublic key={post._id} post={post} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// export async function getServerSideProps() {
//   const { data } = await axios.get("/posts");
//   return {
//     props: {
//       posts: data,
//     },
//   };
// }
export async function getServerSideProps() {
  const  data  = await fetch(`${process.env.NEXT_PUBLIC_API}/posts`)
  const posts = await data.json()
  // console.log(posts)
 return {
    props: {
      posts
    },
  };
}

export default index;
