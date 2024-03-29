import React, { useState, useCallback } from "react";
import login from "../../assets/login.svg";
import { InputField, Button } from "../../components";
import { apiRegister, apiLogin, apiForgotPassword } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { register } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

  const [email, setEmail] = useState("");

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
    });
  };

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    console.log(response);
    if(response?.success){
      toast.success(response?.message, {theme: 'colored'});
    } else {
      toast.warning(response?.message, {theme: 'colored'});
    }
  };
  const handleSunbmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    if (isRegister) {
      const registerRes = await apiRegister(payload);

      if (registerRes?.success) {
        Swal.fire("Congratulation", registerRes?.message, "success").then(
          () => {
            setIsRegister(false);
            resetPayload();
          }
        );
      } else {
        Swal.fire("Oop!", registerRes?.message, "error");
      }
    } else {
      const loginRes = await apiLogin(data);
      if (loginRes?.success) {
        dispatch(
          register({
            isLoggedIn: true,
            userData: loginRes.userData,
            token: loginRes.accessToken,
          })
        );
        navigate(`/${path.HOME}`);
      } else {
        Swal.fire("Oop!", loginRes?.message, "error");
      }
    }
  }, [payload, isRegister]);
  return (
    <div className="w-screen h-screen relative">
      {isForgotPassword && (
        <div className="animate-slide-right absolute top-0 bottom-0 left-0 right-0 bg-white flex flex-col items-center py-8 z-50">
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Enter your email</label>
            <input
              type="email"
              id="email"
              className="w-[800px] border-b pb-2 outline-none placeholder:text-sm"
              placeholder="Exp: email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex items-center justify-end w-full gap-4">
              <Button 
              name="Submit" 
              handleOnClick={handleForgotPassword} 
              style='my-2 px-4 py-2 rounded-md text-white bg-blue-500 text-semibold'
              />
              <Button 
              name="Back" 
              handleOnClick={() => {setIsForgotPassword(false)}} 
              />
            </div>
          </div>
        </div>
      )}
      <img src={login} alt="" className="w-full h-full object-cover" />
      <div className="absolute flex items-center justify-center top-0 bottom-0 w-[62%]">
        <div className="flex items-center justify-center">
          <div className="p-8 bg-white flex flex-col items-center min-w-[400px] rounded-md shadow-lg">
            <h1 className="text-[28px] font-semibold text-main mb-8">
              {isRegister ? "Regiter" : "Login"}
            </h1>
            {isRegister && (
              <div className="flex items-center gap-2">
                <InputField
                  value={payload.firstname}
                  setValue={setPayload}
                  nameKey="firstname"
                />
                <InputField
                  value={payload.lastname}
                  setValue={setPayload}
                  nameKey="lastname"
                />
              </div>
            )}

            <InputField
              value={payload.email}
              setValue={setPayload}
              nameKey="email"
            />

            {isRegister && (
              <InputField
                value={payload.mobile}
                setValue={setPayload}
                nameKey="mobile"
              />
            )}

            <InputField
              value={payload.password}
              setValue={setPayload}
              nameKey="password"
              type="password"
            />

            <Button
              name={isRegister ? "Register" : "Login"}
              handleOnClick={handleSunbmit}
              fw
            />

            <div className="flex items-center justify-between my-2 w-full text-sm">
              {!isRegister && (
                <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => {setIsForgotPassword(true)}}>
                  Forgot your password?
                </span>
              )}
              {!isRegister && (
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => setIsRegister(true)}
                >
                  Create account
                </span>
              )}
              {isRegister && (
                <span
                  className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                  onClick={() => setIsRegister(false)}
                >
                  Go to Login
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
