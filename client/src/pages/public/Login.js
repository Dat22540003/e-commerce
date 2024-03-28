import React, { useState, useCallback } from "react";
import login from "../../assets/login.svg";
import { InputField, Button } from "../../components";
import { apiRegister, apiLogin } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import path from "../../utils/path";
import {register} from '../../store/user/userSlice'
import {useDispatch} from 'react-redux'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

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
        dispatch(register({isLoggedIn: true, userData: loginRes.userData, token: loginRes.accessToken}))
        navigate(`/${path.HOME}`);
      } else {
        Swal.fire("Oop!", loginRes?.message, "error");
      }
    }
  }, [payload, isRegister]);
  return (
    <div className="w-screen h-screen relative">
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
                <span className="text-blue-500 hover:underline cursor-pointer">
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
