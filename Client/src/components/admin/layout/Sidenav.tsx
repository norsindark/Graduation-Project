import React from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
// import logo from "../../../../public/images/logo.png";
import { BiSolidDashboard } from 'react-icons/bi';
import { CgMenuLeftAlt } from 'react-icons/cg';
import { AiOutlineHome } from 'react-icons/ai';
import {
  FaCalendarAlt,
  FaCog,
  FaReplyAll,
  FaShoppingCart,
  FaWarehouse,
} from 'react-icons/fa';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { FaCalendarCheck } from 'react-icons/fa';
import { FaTags } from 'react-icons/fa';
import logo from '../../../assets/images/imagelogosyndev.png';
import { FaBlog } from 'react-icons/fa6';
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
        <NavLink to="/employee-shift">
          <span
            className="icon"
            style={{
              background: page === 'employee-shift' ? color : '',
            }}
          >
            <FaCalendarAlt />
          </span>
          <span className="label">Employee Shift</span>
        </NavLink>
      ),
    },
    {
      key: '5',
      label: (
        <NavLink to="/attendance">
          <span
            className="icon"
            style={{
              background: page === 'attendance' ? color : '',
            }}
          >
            <FaCalendarCheck />
          </span>
          <span className="label">Attendance</span>
        </NavLink>
      ),
    },
    {
      key: '6',
      label: <div className="text-sm font-bold text-navy-200 ">DISH PAGES</div>,
    },
    {
      key: '7',
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
      key: '8',
      label: (
        <NavLink to="/product-option">
          <span
            className="icon"
            style={{ background: page === 'product-option' ? color : '' }}
          >
            {' '}
            <BiSolidDashboard />
          </span>
          <span className="label">Dish Option</span>
        </NavLink>
      ),
    },
    {
      key: '9',
      label: (
        <NavLink to="/product-daily-offer">
          <span
            className="icon"
            style={{ background: page === 'product-daily-offer' ? color : '' }}
          >
            {' '}
            <FaTags />
          </span>
          <span className="label">Daily Offer</span>
        </NavLink>
      ),
    },
    {
      key: '10',
      label: (
        <NavLink to="/product">
          <span
            className="icon"
            style={{ background: page === 'product' ? color : '' }}
          >
            {' '}
            <BiSolidDashboard />
          </span>
          <span className="label">Dish</span>
        </NavLink>
      ),
    },
    {
      key: '11',
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
      key: '12',
      label: (
        <NavLink to="/Coupon">
          <span
            className="icon"
            style={{ background: page === 'Coupon' ? color : '' }}
          >
            <FaTags />
          </span>
          <span className="label">Coupon</span>
        </NavLink>
      ),
    },
    {
      key: '13',
      label: (
        <NavLink to="/order">
          <span
            className="icon"
            style={{ background: page === 'order' ? color : '' }}
          >
            <FaShoppingCart />
          </span>
          <span className="label">Order</span>
        </NavLink>
      ),
    },
    {
      key: '14',
      label: (
        <NavLink to="/review">
          <span
            className="icon"
            style={{ background: page === 'review' ? color : '' }}
          >
            <FaReplyAll />
          </span>
          <span className="label">Review</span>
        </NavLink>
      ),
    },
    {
      key: '15',
      label: <div className="text-sm font-bold text-navy-200 ">BLOG PAGES</div>,
    },
    {
      key: '16',
      label: (
        <NavLink to="/category-blog-admin">
          <span
            className="icon"
            style={{ background: page === 'category-blog-admin' ? color : '' }}
          >
            <CgMenuLeftAlt />
          </span>
          <span className="label">Category Blog</span>
        </NavLink>
      ),
    },
    {
      key: '17',
      label: (
        <NavLink to="/blog-admin">
          <span
            className="icon"
            style={{ background: page === 'blog-admin' ? color : '' }}
          >
            <FaBlog />
          </span>
          <span className="label">All Blogs</span>
        </NavLink>
      ),
    },
    {
      key: '18',
      label: (
        <NavLink to="/comments-blog-admin">
          <span
            className="icon"
            style={{ background: page === 'comments-blog-admin' ? color : '' }}
          >
            <FaReplyAll />
          </span>
          <span className="label">Comments</span>
        </NavLink>
      ),
    },
    {
      key: '19',
      label: (
        <div className="text-sm font-bold text-navy-200 ">SETTING PAGES</div>
      ),
    },
    {
      key: '20',
      label: (
        <NavLink to="/setting">
          <span
            className="icon"
            style={{ background: page === 'setting' ? color : '' }}
          >
            <FaCog />
          </span>
          <span className="label">Setting</span>
        </NavLink>
      ),
    },
  ];

  return (
    <>
      <div className="brand">
        <img src={logo} alt="Sync Food" className="max-w-32 mx-auto" />
      </div>
      <hr />
      <Menu theme="light" mode="inline" items={menuItems} />
    </>
  );
}

export default Sidenav;
