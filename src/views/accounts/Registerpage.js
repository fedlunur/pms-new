import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Input } from "antd";

const Registerpage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }
    registerUser(email, username, password, password2);
  };

  return (
    <section className="vh-100 bg-blue-50 flex items-center justify-center">
      <div className="border w-max h-max flex bg-white rounded overflow-hidden shadow-lg">
        <div className="px-10 py-12 w-full space-y-6">
          <h1 className="font-bold text-3xl">Create an Account</h1>
          <span className="text-sm w-full text-center">Welcome to your new account</span>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm">Username:</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-[400px]"
                style={{ height: "40px" }}
              />
            </div>
            <div>
              <label className="block text-sm">Email:</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full"
                style={{ height: "40px" }}
              />
            </div>
            <div>
              <label className="block text-sm">Password:</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full"
                style={{ height: "40px" }}
              />
            </div>
            <div>
              <label className="block text-sm">Confirm Password:</label>
              <Input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirm Password"
                className="w-full"
                style={{ height: "40px" }}
              />
            </div>
            <button
              type="submit"
              className="py-2 px-5 mt-2 w-full bg-blue-500 text-white font-semibold rounded-md"
            >
              Register
            </button>
          </form>
          <p className="text-xs text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Registerpage;
