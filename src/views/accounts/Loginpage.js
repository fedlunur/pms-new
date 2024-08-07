import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Button, Input } from "antd";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    
    email.length > 0 && loginUser(email, password);
    console.log(email);
    console.log(password);
  };

  return (
    <div>
      <>
     
        <section className="vh-100 bg-blue-50 flex items-center justify-center ">
          <div className="border w-max h-max flex bg-white rounded- overflow-hidden shadow-lg">
            <div className="px-10 py-12 w-full space-y-6">
              <h1 className="font-bold text-3xl ">Welcome Back</h1>
              <span className="text-sm w-full text-center">Welcome to your account</span>{" "}
              <div>
                <label>Email:</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full"
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                />
              </div>
              <div>
                <label>Password:</label>
                <Input
                  placeholder="Password"
                  className="w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                />
              </div>
              <button className="py-2 px-5 w-full bg-blue-500 text-white font-semibold rounded-md" onClick={handleSubmit}>
                Login
              </button>
              <p className="text-xs text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500">
                  Register
                </Link>
              </p>{" "}
            </div>
            
          </div>
        </section>
      </>
    </div>
  );
};

export default Loginpage;
