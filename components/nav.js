import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../context";
import { useRouter } from "next/router";
const Nav = () => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-between">
      <Link href="/" className={`nav-link ${current === "/" && "active"}`}>
        <a className="navbar-brand" href="#">
          FYZ
        </a>
      </Link>
        <div className="navbar-nav">
          {state !== null ? (
            <>
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle text-light"
                  type="button"
                  id="navbarDarkDropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {state && state.user && state.user.name}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-dark dropdown-menu-lg-end"
                  aria-labelledby="navbarDarkDropdownMenuLink"
                >
                  <li>
                  <Link href="/user/dashboard">
                      <a
                        className={`nav-link dropdown-item  ${
                          current === "/user/dashboard" && "active"
                        }`}
                        href="#"
                      >
                        Dashboard
                      </a>
                    </Link>
                  </li>
                  <li>
                  <Link href="/user/profile/update">
                      <a
                        className={`nav-link dropdown-item  ${
                          current === "/user/profile/update" && "active"
                        }`}
                        href="#"
                      >
                       Profile
                      </a>
                    </Link>
                  </li>
                  {state.user.role === 'Admin' &&(
                     <li>
                     <Link href="/admin">
                         <a
                           className={`nav-link dropdown-item  ${
                             current === "/admin" && "active"
                           }`}
                           href="#"
                         >
                          Admin
                         </a>
                       </Link>
                     </li> 
                  )}
                  <li>
                    <a
                      onClick={logout}
                      className="nav-link dropdown-item "
                      href="#"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <form className="d-flex">
                <Link href="/login">
                  <a
                    className={`nav-link px-2 mx-2  ${
                      current === "/login" && "active px-2"
                    }`}
                    href="#"
                  >
                    Login{" "}
                  </a>
                </Link>

                <Link href="/register">
                  <a
                    className={`nav-link  px-2 ${
                      current === "/register" && "active px-2"
                    }`}
                    href="#"
                  >
                    Register
                  </a>
                </Link>
              </form>
            </>
          )}
        </div>
     
    </nav>
  );
};

export default Nav;
