import React, { useState } from "react";
import { Input, Button } from "antd";
import useAxios from "../../utils/useAxios";
import { useHistory } from "react-router-dom";
const PasswordChangePage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const api = useAxios();

  const history = useHistory();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      changePassword(currentPassword, newPassword);
    } else {
      alert("New password and confirm password do not match");
    }
  };
 function gotodashboard () {
    history.push("/dashboard");
    }
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.patch("/change-password/", {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: newPassword,
      });
      history.push("/dashboard");
      alert(response.data.detail);
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response && error.response.data && error.response.data.detail
        ? error.response.data.detail
        : 'Error changing password';
      alert(errorMessage);
    }
  };

  return (
    <div>
      <section className="vh-100 bg-blue-50 flex items-center justify-center">
        <div className="border w-max h-max flex bg-white rounded overflow-hidden shadow-lg">
          <div className="px-10 py-12 w-full space-y-6">
            <h1 className="font-bold text-3xl">Change Password</h1>
            <div>
              <label>Current Password:</label>
              <Input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                type="password"
                className="w-full"
                style={{ width: "100%", height: "40px" }}
              />
            </div>
            <div>
              <label>New Password:</label>
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                type="password"
                className="w-full"
                style={{ width: "100%", height: "40px" }}
              />
            </div>
            <div>
              <label>Confirm New Password:</label>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                type="password"
                className="w-full"
                style={{ width: "100%", height: "40px" }}
              />
            </div>
            <Button
              type="primary"
              className="w-full"
              onClick={handleSubmit}
            >
              Change Password
            </Button>

            <Button
              type="primary"
              className="w-full"
              onClick={gotodashboard}
            >
              Back
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PasswordChangePage;
