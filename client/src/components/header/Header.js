import React, { Fragment, memo, useEffect, useState } from "react";
import logo from "assets/logo.png";
import icons from "utils/icons";
import { Link } from "react-router-dom";
import path from "utils/path";
import { useSelector } from "react-redux";
import { logout } from "store/user/userSlice";
import withBase from "hocs/withBase";
import { showCart } from "store/app/appSlice";

const { RiPhoneFill, MdEmail, BsFillHandbagFill, BiSolidUserCircle } = icons;
const Header = ({dispatch}) => {
  const { current } = useSelector((state) => state.user);
  const [isShowOption, setIsShowOption] = useState(false);
  useEffect(() => {
    const handleClickoutOption = (e) => {
      const profile = document.getElementById("profile");
      if(!profile?.contains(e.target)){
        setIsShowOption(false);
      }
    }
    document.addEventListener("click", handleClickoutOption);

    return () => {
      document.removeEventListener("click", handleClickoutOption);
    }
  }, []);

  return (
    <div className="w-main flex justify-between h-[110px] py-[35px]">
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className="w-[234px] object-contain"></img>
      </Link>
      <div className="flex text-[13px]">
        <div className="flex flex-col items-center px-6 border-r">
          <span className="flex gap-4 items-center">
            <RiPhoneFill color="red" />
            <span className="font-semibold">(+1800) 000 8808</span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>
        <div className="flex flex-col items-center px-6 border-r">
          <span className="flex gap-4 items-center">
            <MdEmail color="red" />
            <span className="font-semibold">SUPPORT@TADATHEMES.COM</span>
          </span>
          <span>Online Support 24/7</span>
        </div>
        {current && (
          <Fragment>
            <div onClick={() => dispatch(showCart())} className="cursor-pointer flex items-center justify-center gap-2 px-6 border-r">
              <BsFillHandbagFill color="red" />
              <span>{`${current?.cart?.length || 0} item(s)`}</span>
            </div>
            <div
              className="cursor-pointer flex items-center justify-center px-6 gap-2 relative"
              onClick={() => setIsShowOption(!isShowOption)}
              id="profile"
            >
              <BiSolidUserCircle color="red" />
              <span>Profile</span>
              {isShowOption && (
                <div className="absolute top-full right-0 flex flex-col bg-gray-100 min-w-[140px] border py-2">
                  <Link
                    className="p-2 hover:bg-gray-300 w-full"
                    to={`/${path.MEMBER}/${path.PERSONAL}`}
                  >
                    Personal
                  </Link>
                  {+current.role === 1999 && (
                    <Link
                      className="p-2 hover:bg-gray-300 w-full"
                      to={`/${path.ADMIN}/${path.DASHBOARD}`}
                    >
                      Admin workspace
                    </Link>
                  )}
                  <span
                    onClick={() => dispatch(logout())}
                    className="p-2 hover:bg-gray-300 w-full"
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default withBase(memo(Header));
