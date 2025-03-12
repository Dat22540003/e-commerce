import React, { useState, useCallback, useEffect } from 'react';
import login_image from 'assets/login.svg';
import { InputField, Button, Loading } from 'components';
import {
    apiRegister,
    apiLogin,
    apiForgotPassword,
    apiCompleteRegister,
} from 'apis';
import Swal from 'sweetalert2';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import path from 'utils/path';
import { login } from 'store/user/userSlice';
import { showModal } from 'store/app/appSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { validate } from 'utils/helpers';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        mobile: '',
    });

    const [token, setToken] = useState('');

    const [email, setEmail] = useState('');

    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const [isRegister, setIsRegister] = useState(false);

    const [searchParams] = useSearchParams();

    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            mobile: '',
        });
    };

    const [isVerifiedEmail, setisVerifiedEmail] = useState(false);

    const [invalidFields, setInvalidFields] = useState([]);

    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email });

        if (response?.success) {
            toast.success(response?.message, { theme: 'colored' });
        } else {
            toast.warning(response?.message, { theme: 'colored' });
        }
    };

    useEffect(() => {
        resetPayload();
    }, [isRegister]);

    // Submit
    const handleSunbmit = useCallback(async () => {
        const { firstname, lastname, mobile, ...data } = payload;

        const invalids = isRegister
            ? validate(payload, setInvalidFields)
            : validate(data, setInvalidFields);
        if (invalids === 0) {
            if (isRegister) {
                dispatch(
                    showModal({
                        isShowModal: true,
                        modalChildren: <Loading />,
                    }),
                );
                const registerRes = await apiRegister(payload);
                dispatch(
                    showModal({ isShowModal: false, modalChildren: null }),
                );
                if (registerRes?.success) {
                    setisVerifiedEmail(true);
                } else {
                    Swal.fire('Oop!', registerRes?.message, 'error');
                }
            } else {
                const loginRes = await apiLogin(data);
                if (loginRes?.success) {
                    dispatch(
                        login({
                            isLoggedIn: true,
                            userData: loginRes.userData,
                            token: loginRes.accessToken,
                        }),
                    );
                    searchParams.get('redirect')
                        ? navigate(searchParams.get('redirect'))
                        : navigate(`/${path.HOME}`);
                } else {
                    Swal.fire('Oop!', loginRes?.message, 'error');
                }
            }
        }
    }, [payload, isRegister]);

    const completeRegister = async () => {
        const response = await apiCompleteRegister(token);
        if (response?.success) {
            Swal.fire('Congratulation', response?.message, 'success').then(
                () => {
                    setIsRegister(false);
                    resetPayload();
                },
            );
        } else {
            Swal.fire('Oop!', response?.message, 'error');
        }
        setisVerifiedEmail(false);
        setToken('');
    };

    return (
        <div className="w-screen h-screen relative">
            {isVerifiedEmail && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col items-center justify-center">
                    <div className="bg-white w-[500px] rounded-md p-8">
                        <h4>Enter your registration code</h4>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="p-2 border rounded-md outline-none"
                        />
                        <Button
                            handleOnClick={completeRegister}
                            style="ml-4 px-4 py-2 rounded-md text-white bg-blue-500 text-semibold"
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            )}
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
                            {/* <Button
                name="Submit"
                handleOnClick={handleForgotPassword}
                style="my-2 px-4 py-2 rounded-md text-white bg-blue-500 text-semibold"
              /> */}
                            <Button
                                handleOnClick={handleForgotPassword}
                                style="my-2 px-4 py-2 rounded-md text-white bg-blue-500 text-semibold"
                            >
                                Submit
                            </Button>
                            {/* <Button
                name="Back"
                handleOnClick={() => {
                  setIsForgotPassword(false);
                }}
              /> */}
                            <Button
                                handleOnClick={() => setIsForgotPassword(false)}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <img
                src={login_image}
                alt=""
                className="w-full h-full object-cover"
            />
            <div className="absolute flex items-center justify-center top-0 bottom-0 w-[62%]">
                <div className="flex items-center justify-center">
                    <div className="p-8 bg-white flex flex-col items-center min-w-[400px] rounded-md shadow-lg">
                        <h1 className="text-[28px] font-semibold text-main mb-8">
                            {isRegister ? 'Regiter' : 'Login'}
                        </h1>
                        {isRegister && (
                            <div className="flex items-center gap-2">
                                <InputField
                                    value={payload.firstname}
                                    setValue={setPayload}
                                    nameKey="firstname"
                                    invalidFields={invalidFields}
                                    setInvalidFields={setInvalidFields}
                                    fw
                                />
                                <InputField
                                    value={payload.lastname}
                                    setValue={setPayload}
                                    nameKey="lastname"
                                    invalidFields={invalidFields}
                                    setInvalidFields={setInvalidFields}
                                    fw
                                />
                            </div>
                        )}

                        <InputField
                            value={payload.email}
                            setValue={setPayload}
                            nameKey="email"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            fw
                        />

                        {isRegister && (
                            <InputField
                                value={payload.mobile}
                                setValue={setPayload}
                                nameKey="mobile"
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                fw
                            />
                        )}

                        <InputField
                            value={payload.password}
                            setValue={setPayload}
                            nameKey="password"
                            type="password"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            fw
                        />

                        <Button handleOnClick={handleSunbmit} fw>
                            {isRegister ? 'Register' : 'Login'}
                        </Button>

                        <div className="flex items-center justify-between my-2 w-full text-sm">
                            {!isRegister && (
                                <span
                                    className="text-blue-500 hover:underline cursor-pointer"
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                    }}
                                >
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
                        <Link
                            className="text-blue-500 hover:underline cursor-pointer text-sm"
                            to={`/${path.HOME}`}
                        >
                            Go home?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
