import React, { memo, Fragment, useState } from 'react';
import logo from 'assets/logo.png';
import { adminSidebar } from 'utils/contants';
import { NavLink, Link} from 'react-router-dom';
import clsx from 'clsx';
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';

const activeStyle =
  'px-4 py-2 flex items-center gap-2  bg-gray-300';
const notActiveStyle =
  'px-4 py-2 flex items-center gap-2  hover:bg-gray-200';

const AdminSidebar = () => {
  const [active, setActive] = useState([]);
  const handleShowTabs = (id) => {
    if(active.some(el => el === id)){
      setActive(prev => prev.filter(el => el !== id))
    } else{
      setActive(prev => [...prev, id])
    }
  };
  return (
    <div className='py-4 bg-white h-full'>
      <Link to={'/'} className='flex flex-col items-center justify-center p-4 gap-2'>
        <img
          src={logo}
          alt='logo'
          className='w-[200px] object-contain'
        />
        <small>Admin Workspace</small>
      </Link>
      <div>
        {adminSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === 'SINGLE' && (
              <NavLink
                className={({ isActive }) =>
                  clsx(isActive ? activeStyle : notActiveStyle)
                }
                to={el.path}
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === 'PARENT' && (
              <div onClick={()=>handleShowTabs(+el.id)} className='flex flex-col'>
                <div className='flex items-center justify-between gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                  <div className='flex items-center gap-2'>
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </div>
                  {active.some(id => +id === +el.id) ? <AiFillCaretRight /> : <AiFillCaretDown />}
                </div>
                {active.some(id => +id === +el.id) && (
                  <div className='flex flex-col'>
                    {el.subMenu.map((item) => (
                      <NavLink
                        key={item.text}
                        to={item.path}
                        onClick={e => e.stopPropagation()}
                        className={({ isActive }) =>
                          clsx(isActive ? activeStyle : notActiveStyle, 'pl-10')
                        }
                      >
                        {item.text}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
