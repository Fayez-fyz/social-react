import axios from "axios";
import React, { useState } from "react";
import ParallaxBG from "../../../components/cards/ParallaxBG";
import PostPublic from "../../../components/cards/PostPublic";
import Head from "next/head";

const SinglePost = ({ post }) => {
  

  const head = () => (
    <Head>
      <title>FYZ - A Social network by devs for devs </title>
      <meta
        name="description"
        content={post.content}
      />
      <meta
        property="og:description"
        content="A social network for other web developers"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="FYZ" />
      <meta property="og:url" content={`http://fyzbook.com/post/view/${post._id}`}/>
      <meta
        property="og:image:secure_url"
        content={imageSource(post)}
      />
    </Head>
  );
  const imageSource= (post) =>{
    if(post.image){
        return post.image.url;
    }else{
        return '/images/uk-tel.jpg'
    }
}

  return (
    <>
      {head()}
      <ParallaxBG url="/images/uk-tele.jpg"> SOCIAL NETWORK </ParallaxBG>
      <div className="container-fluid">
        <div className="row pt-3">
       
           
            <div className="col-md-8 offset-md-2">
              
              <PostPublic key={post._id} post={post}/>
            
            </div>
            
        
        </div>
      </div>
    </>
  );
};

// export async function getServerSideProps(ctx) {
//   const { data } = await axios.get(`/post/${ctx.params._id}`);
//   return {
//     props: {
//       post: data,
//     },
//   };
// }  
export async function getServerSideProps(ctx) {
  const data  = await fetch(`${process.env.NEXT_PUBLIC_API}/post/${ctx.params._id}`);
  const post = await data.json()
   // console.log(posts)
  return {
    props: {
      post
    },
  };
}

export default SinglePost;
