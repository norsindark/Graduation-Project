import React from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
// import logo from "../../../../public/images/logo.png";
import { BiSolidDashboard } from 'react-icons/bi';
import { CgMenuLeftAlt } from 'react-icons/cg';
import { AiOutlineHome } from 'react-icons/ai';
import { FaWarehouse } from 'react-icons/fa';
import { UsergroupAddOutlined } from '@ant-design/icons';

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
            <AiOutlineHome />
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
        <NavLink to="/user">
          <span
            className="icon"
            style={{ background: page === 'user' ? color : '' }}
          >
            <UsergroupAddOutlined />
          </span>
          <span className="label">User</span>
        </NavLink>
      ),
    },
    {
      key: '4',
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
      key: '5',
      label: (
        <NavLink to="/product">
          <span
            className="icon"
            style={{ background: page === 'product' ? color : '' }}
          >
            {' '}
            <BiSolidDashboard />
          </span>
          <span className="label">Product</span>
        </NavLink>
      ),
    },
    {
      key: '6',
      label: (
        <NavLink to="/warehouse">
          <span
            className="icon"
            style={{ background: page === 'warehouse' ? color : '' }}
          >
            <FaWarehouse />
          </span>
          <span className="label">Warehouse</span>
        </NavLink>
      ),
    },
    {
      key: '7',
      label: (
        <NavLink to="/order">
          <span
            className="icon"
            style={{ background: page === 'order' ? color : '' }}
          >
            <FaWarehouse />
          </span>
          <span className="label">Order</span>
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
