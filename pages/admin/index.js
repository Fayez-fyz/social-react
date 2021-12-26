import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import renderHTML from "react-render-html";

const Admin = () => {
  const [state, setState] = useContext(UserContext);

  const [posts, setPosts] = useState([]);

  const router = useRouter();



  useEffect(() => {
    if (state && state.token) {
      newsFeed();
     
    }
  }, [state && state.token ]);

 
  
  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/posts`);
      // console.log("user posts", data);
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/admin/delete-post/${post._id}`);
      console.log("check data", data);
      toast.error("Post Deleted");
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminRoute>
      <div className="container-fluid">
        <div className="row py-4 bg-secondary text-light">
          <div className="col text-center">
            <h2>News Feed</h2>
          </div>
        </div>
        <div className='row py-4'>
            <div className='col-md-8 offset-md-2'>
                {posts && posts.map((post)=>(
                    <div key={post._id} className='d-flex justify-content-between py-1'>
                        <div>
                        {renderHTML(post.content)}  
                        </div>
                    <button  onClick={()=> handleDelete(post)} className=' btn btn-sm btn-danger'>Delete</button>

                </div>
                ))}
                

            </div>

        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
