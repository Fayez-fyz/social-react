import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import { Modal, Pagination } from "antd";
import CommentForm from "../../components/forms/CommentForm";
import Search from '../../components/Search'
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKETIO,
  { path: "/socket.io" },
  {
    reconnection: true,
  }
);
const dashboard = () => {
  const [state, setState] = useContext(UserContext);

  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);

  const router = useRouter();

  //people
  const [people, setPeople] = useState([]);
  //comment
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  //pagination
  const [totalPost, setTotalPost] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token, page]);

  useEffect(() => {
    try {
      axios.get("/total-posts").then(({ data }) => setTotalPost(data));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/news-feed/${page}`);
      // console.log("user posts", data);
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    // console.log('Post =>',content)
    try {
      const { data } = await axios.post("/create-post", { content, image });
      // console.log("created post", data);
      if (data.error) {
        toast.error(data.error);
      } else {
        setPage(1);
        newsFeed();
        toast.success("Post created");
        setContent("");
        setImage({});
        socket.emit('new-post',data)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    // console.log([...formData])
    setUploading(true);

    try {
      const { data } = await axios.post("/upload-image", formData);
      // console.log("uploader image =>", data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };
  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      console.log("check data", data);
      toast.error("Post Deleted");
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };
  const findPeople = async (req, res) => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      // console.log('Follow response',data)
      //update local storage,update user,keep token
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update context
      setState({ ...state, user: data });
      //update people state
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      //rerender the post in newsfeed
      newsFeed();
      toast.success(`Following ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (_id) => {
    // console.log('Like this post',_id)
    try {
      const { data } = await axios.put("/like-post", { _id });
      // console.log('Liked',data)
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnlike = async (_id) => {
    // console.log('unLike this post',_id)
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      // console.log('Unliked',data)
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };
  const handleComment = async (post) => {
    setCurrentPost(post);
    setVisible(true);
  };
  const addComment = async (e) => {
    e.preventDefault();
    // console.log('add comment to this post id',currentPost._id )
    // console.log('save comment to db',comment)
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      console.log("Add comment", data);
      setComment("");
      setVisible(false);
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };
  const removeComment = async (postId, comment) => {
    let answer = window.confirm("Are you sure to delete this comment?");
    if (!answer) return;
    try {
      const { data } = await axios.put("/remove-comment", { postId, comment });
      console.log("Comment removed", data);
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-4 bg-secondary text-light">
          <div className="col text-center">
            <h2>News Feed</h2>
          </div>
        </div>
        <div className="row py-3">
          <div className="col-md-8">
            <PostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />

            {/* <pre>{JSON.stringify(posts,null,4)}</pre> */}

            <PostList
              posts={posts}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
              removeComment={removeComment}
            />
            <Pagination className='d-flex justify-content-center my-4'
              current={page}
              total={(totalPost / 5) * 10}
              onChange={(value) => setPage(value)}
            />
          </div>
          <div className="col-md-4">
           <Search/>
            {state && state.user && state.user.following && (
              <Link href={`/user/following`}>
                <a className="h6">Following ({state.user.following.length})</a>
              </Link>
            )}
            <People people={people} handleFollow={handleFollow} />
          </div>
        </div>
        <Modal
          visible={visible}
          onCancel={() => setVisible(false)}
          title="comment"
          footer={false}
        >
          <CommentForm
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
        </Modal>
      </div>
    </UserRoute>
  );
};

export default dashboard;
