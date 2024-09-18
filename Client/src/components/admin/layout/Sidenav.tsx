import React from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
// import logo from "../../../../public/images/logo.png";
import { BiSolidDashboard } from 'react-icons/bi';
import { CgMenuLeftAlt } from 'react-icons/cg';
function Sidenav({ color }: { color: string }) {
  const { pathname } = useLocation();
  const page = pathname.replace('/', '');
  const menuItems = [
    {
      key: '1',
      label: (
        <NavLink to="/dashboard">
          <span
            className="icon"
            style={{ background: page === 'dashboard' ? color : '' }}
          >
            <BiSolidDashboard />
          </span>
          <span className="label">Dashboard</span>
        </NavLink>
      ),
    },
    {
      key: '2',
      label: (
        <div className="text-sm font-bold text-navy-200 ">ACCOUNT PAGES</div>
      ),
    },
    {
      key: '3',
      label: (
        <NavLink to="/category">
          <span
            className="icon"
            style={{ background: page === 'category' ? color : '' }}
          >
            <CgMenuLeftAlt />
          </span>
          <span className="label">Category</span>
        </NavLink>
      ),
    },
    {
      key: '4',
      label: (
        <NavLink to="/billing">
          <span
            className="icon"
            style={{ background: page === 'billing' ? color : '' }}
          ></span>
          <span className="label">Billing</span>
        </NavLink>
      ),
    },

    {
      key: '5',
      label: (
        <NavLink to="/profile">
          <span
            className="icon"
            style={{ background: page === 'profile' ? color : '' }}
          ></span>
          <span className="label">Profile</span>
        </NavLink>
      ),
    },
  ];

  return (
    <>
      <div className="brand">
        <img alt="" />
        <span className="">DuckFunny</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline" items={menuItems} />
    </>
  );
}

export default Sidenav;
