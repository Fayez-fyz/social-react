import React from "react";
import { SyncOutlined } from "@ant-design/icons";
const AuthForm = ({
  handleSubmit,
  name,
  setname,
  email,
  setemail,
  password,
  setpassword,
  secret,
  setsecret,
  loading,
  page,
  username,
  setUsername,
  about,
  setAbout,
  profileUpdate
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
      {profileUpdate && (<div className="form-group my-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Username"
        />
      </div>)}
    { profileUpdate && (  <div className="form-group my-2">
        <input
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          type="text"
          className="form-control"
          placeholder="About"
        />
      </div>)}

      {page !== 'login' && 
      <div className="form-group my-2">
        <input
          value={name}
          onChange={(e) => setname(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Enter name"
        />
      </div>}
        <div className="form-group my-2">
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="email"
            className="form-control"
            id="exampleInputmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            disabled={profileUpdate}
          />
        </div>
        <div className="form-group my-2">
          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>
       { page !== 'login' && (
       <>
       <div className="form-group my-2">
          <select className="form-control" aria-label="Default select example">
            <option>Pick a questions</option>
            <option>Where you born?</option>
            <option>What is your nick name?</option>
            <option>What is your favorite color?</option>
          </select>
        </div>
         <div className="form-group my-2">
          <input
            value={secret}
            onChange={(e) => setsecret(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Write your answer"
          />
        </div>
        </>)}

        <div className="text-center">
          <button
            disabled={ profileUpdate ? loading : page === 'login'? !email || !password ||loading : !name || !email || !password || !secret ||loading }
            type="submit"
            className="btn btn-primary col-12 my-2 "
          >
            {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AuthForm;
