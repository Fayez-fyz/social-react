import React from "react";
import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../images/PostImage";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { UserContext } from "../../context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { imageSource } from "../../functions";

const PostPublic = ({
  post,
  handleDelete,
  handleLike,
  handleUnlike,
  handleComment,
  commentsCount = 10,
  removeComment,
}) => {
  const [state] = useContext(UserContext);
  const router = useRouter();
  return (
    <>
      {post && post.postedBy && (
        <div key={post._id} className="card my-3">
          <div className="card-header">
            {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar> */}
            <Avatar size={40} src={imageSource(post.postedBy)} />
            <span className="py-2 mx-1">{post.postedBy.name}</span>
            <span className="py-2 mx-1 text-muted">
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="card-body">{renderHTML(post.content)}</div>
          <div className="card-footer">
            {post.image && <PostImage url={post.image.url} />}
            <div className="d-flex">
              {state &&
              state.user &&
              post.likes &&
              post.likes.includes(state.user._id) ? (
                <HeartFilled className="text-danger pt-2 h5" />
              ) : (
                <HeartOutlined className="text-danger pt-2 h5" />
              )}
              <div className="py-2 px-2">{post.likes.length} Likes</div>
              <CommentOutlined className="text-danger pt-2 h5" />
              <div className="py-2 px-2">
                {post.comments.length} Comments
              </div>
            </div>
          </div>
          {/* 2comments */}
          {post.comments && post.comments.length > 0 && (
            <ol
              className="list-group"
              style={{ maxHeight: "125px", overflow: "scroll" }}
            >
              {post.comments.slice(0, commentsCount).map((c) => (
                <li
                  key={c._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div>
                      <Avatar
                        size={30}
                        className="mb-1 mr-3"
                        src={imageSource(c.postedBy)}
                      />
                      <b className="mx-2">{c.postedBy.name}</b>
                    </div>
                    <div className="mx-5">{c.text}</div>
                  </div>
                  <span className="badge rounded-pill text-muted">
                    {moment(c.created).fromNow()}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
};

export default PostPublic;
