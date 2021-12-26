import React, { useContext, useState } from "react";
import { UserContext } from "../context";
import { SearchOutlined } from "@ant-design/icons";
import People from "./cards/People";
import axios from "axios";
import { toast } from "react-toastify";

const Search = () => {
  const [state,setState] = useContext(UserContext);

  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const searchUser = async (e) => {
    e.preventDefault();
    // console.log(`Find"${query}"from db`);
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      console.log("serch response", data);
      setResult(data);
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
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      toast.success(`Following ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnfollow = async(user)=>{
    try {
        const {data}= await axios.put('/user-unfollow',{_id:user._id});
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        //update context
        setState({ ...state, user: data });
        //update people state
        let filtered = result.filter((p) => p._id !== user._id);
        setResult(filtered);
        toast.error(`Unfollowed ${user.name}`);
    } catch (error) {
        console.log(error)
    }
  } 


  return (
    <>
      <form onSubmit={searchUser}>
        <div className="input-group mb-3">
          <input
            onChange={(e) => {
                setQuery(e.target.value)
                setResult([])
            }}
            value={query}
            type="text"
            className="form-control"
            placeholder="Search user..."
            aria-label="Search-user"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit">
              <SearchOutlined className="my-1" />
            </button>
          </div>
        </div>
      </form>
      {result && result.map((r) => <People key={r._id} people={result} handleFollow={handleFollow} handleUnfollow={handleUnfollow} />)}
    </>
  );
};

export default Search;
