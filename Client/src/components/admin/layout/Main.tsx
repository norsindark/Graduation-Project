import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, Drawer } from 'antd';
import Sidenav from './Sidenav';
import Header from './Header';
import Footer from './Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import './Table.css';

const { Header: AntHeader, Content, Sider } = Layout;

function Main() {
  const [visible, setVisible] = useState(false);
  const [sidenavColor, setSidenavColor] = useState('#66bb6a');
  const [sidenavType, setSidenavType] = useState('transparent');
  const [fixed, setFixed] = useState(false);

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type: string) => setSidenavType(type);
  const handleSidenavColor = (color: string) => setSidenavColor(color);
  const handleFixedNavbar = (type: boolean) => setFixed(type);

  let { pathname } = useLocation();
  pathname = pathname.replace('/', '');
  const user = useSelector((state: RootState) => state.account.user);
  const userRole = user?.role?.name;

  const getScrollbarClass = () => {
    switch (sidenavColor) {
      case '#66bb6a':
        return 'scrollbar-green';
      case '#1890ff':
        return 'scrollbar-blue';
      case '#d9363e':
        return 'scrollbar-red';
      case '#fadb14':
        return 'scrollbar-yellow';
      case '#111':
        return 'scrollbar-black';
      default:
        return 'scrollbar-green';
    }
  };

  return (
    <>
      {/* {userRole === 'ADMIN' && ( */}
      <Layout
        className={`layout-dashboard custom-scrollbar ${getScrollbarClass()}`}
      >
        <Drawer
          title={false}
          placement="left"
          closable={false}
          onClose={() => setVisible(false)}
          open={visible}
          key="left"
          width={250}
          className="drawer-sidebar"
        >
          <Layout className="layout-dashboard">
            <Sider
              trigger={null}
              width={250}
              theme="light"
              className={`sider-primary ant-layout-sider-primary ${
                sidenavType === '#fff' ? 'active-route' : ''
              }`}
              style={{ background: sidenavType }}
            >
              <Sidenav color={sidenavColor} />
            </Sider>
          </Layout>
        </Drawer>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => {}}
          trigger={null}
          width={250}
          theme="light"
          className={`sider-primary ant-layout-sider-primary ${
            sidenavType === '#fff' ? 'active-route' : ''
          }`}
          style={{ background: sidenavType }}
        >
          <Sidenav color={sidenavColor} />
        </Sider>

        <Layout>
          <AntHeader className={`${fixed ? 'ant-header-fixed' : ''}`}>
            <Header
              placement="right"
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
              sidenavColor={sidenavColor}
            />
          </AntHeader>
          <Content className="content-ant">
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      </Layout>
      {/* )} */}
    </>
  );
}

export default Main;
