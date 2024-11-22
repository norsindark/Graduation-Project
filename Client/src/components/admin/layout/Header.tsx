import React from 'react';
import { useState, useEffect } from 'react';
import type { DrawerProps } from 'antd';
import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  Button,
  List,
  Avatar,
  Input,
  Drawer,
  Typography,
  Switch,
} from 'antd';

import {
  SearchOutlined,
  StarOutlined,
  TwitterOutlined,
  FacebookFilled,
} from '@ant-design/icons';

import { NavLink, Link, Form } from 'react-router-dom';
import styled from 'styled-components';
import avtar from '../../../assets/images/team-2.jpg';
import {
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { doLogoutAction } from '../../../redux/account/accountSlice';
import { callLogout } from '../../../services/clientApi';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import {
  callGetAllIngredientWhenLowStock,
  callGetAllIngredientWhenNearlyExpired,
} from '../../../services/serverApi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ButtonContainer = styled.div`
  .ant-btn-primary {
    background-color: #1890ff;
  }
  .ant-btn-success {
    background-color: #52c41a;
  }
  .ant-btn-yellow {
    background-color: #fadb14;
  }
  .ant-btn-black {
    background-color: #262626;
    color: #fff;
    border: 0px;
    border-radius: 5px;
  }
  .ant-switch-active {
    background-color: #1890ff;
  }
`;

const bell = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      d="M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z"
      fill="#111827"
    ></path>
    <path
      d="M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z"
      fill="#111827"
    ></path>
  </svg>,
];

const logsetting = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
      fill="#111827"
    ></path>
  </svg>,
];

const profile = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
      fill="#111827"
    ></path>
  </svg>,
];

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

const setting = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
      fill="#111827"
    ></path>
  </svg>,
];

function Header({
  placement,
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}: {
  placement: DrawerProps['placement'];
  name: string;
  subName: string;
  onPress: () => void;
  handleSidenavColor: (color: string) => void;
  handleSidenavType: (type: string) => void;
  handleFixedNavbar: (fixed: boolean) => void;
}) {
  const { Title, Text } = Typography;
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState('transparent');
  const [submit, setSubmit] = useState(false);
  useEffect(() => window.scrollTo(0, 0));

  const [bellData, setBellData] = useState<any[]>([]);
  const [bellData2, setBellData2] = useState<any[]>([]);

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  useEffect(() => {
    const fetchLowStockIngredients = async () => {
      try {
        const percentage = 20;
        const response = await callGetAllIngredientWhenLowStock(percentage);
        if (response?.status === 200 && response.data) {
          setBellData(response.data);
        } else {
          console.error('Failed to fetch low stock ingredients');
        }
      } catch (error) {
        console.error('Error fetching low stock ingredients:', error);
      }
    };
    const fetchNearlyExpiredIngredients = async () => {
      try {
        const query = `?daysUntilExpiry=7`;
        const response = await callGetAllIngredientWhenNearlyExpired(query);
        if (response?.status === 200 && response.data) {
          setBellData2(response.data?._embedded?.warehouseResponseList);
        } else {
          console.error('Failed to fetch nearly expired ingredients');
        }
      } catch (error) {
        console.error('Error fetching nearly expired ingredients:', error);
      }
    };
    fetchLowStockIngredients();
    fetchNearlyExpiredIngredients();
  }, []);

  const breadcrumbItems = [
    {
      title: <NavLink to="/dashboard">Pages</NavLink>,
    },
    {
      title: (
        <span style={{ textTransform: 'capitalize' }}>
          {name.replace('/', '')}
        </span>
      ),
    },
  ];
  const handleLogout = async () => {
    try {
      setSubmit(true);
      const res = await callLogout();
      if (res?.status == 200) {
        dispatch(doLogoutAction());
        navigate('/');
        notification.success({
          message: 'Logout success!',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Logout failed!',
          description: res?.data?.errors?.error || 'Something went wrong!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Logout failed!',
        description: 'Something went wrong!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setSubmit(false);
    }
  };

  const user = useSelector((state: RootState) => state.account.user);
  const dispatch = useDispatch();
  const menuItems = [
    {
      key: '0',
      icon: <HomeOutlined />,
      label: <Link to="/">Go To Client</Link>,
    },
    {
      key: '1',
      icon: <TeamOutlined />,
      label: <Link to="/account-admin">Manage Employee</Link>,
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: (
        <a
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </a>
      ),
    },
  ];

  const combinedData = [
    ...bellData.map((item) => ({ ...item, type: 'bellData' })),
    ...bellData2.map((item) => ({ ...item, type: 'bellData2' })),
  ];

  return (
    <>
      <section
        className="fp__banner h-[11vh] pt-[15px]"
        style={{ backgroundImage: 'url(images/counter_bg.jpg)' }}
      >
        <div className="setting-drwer" onClick={showDrawer}>
          {setting}
        </div>
        <Row gutter={[24, 0]}>
          <Col span={24} md={6}>
            <Breadcrumb items={breadcrumbItems} />
            <div className="ant-page-header-heading">
              <span
                className="ant-page-header-heading-title"
                style={{ textTransform: 'capitalize' }}
              >
                {subName.replace('/', '')}
              </span>
            </div>
          </Col>
          <Col span={24} md={18} className="header-control">
            <Button type="link" onClick={showDrawer}>
              {logsetting}
            </Button>
            <Button
              type="link"
              className="sidebar-toggler"
              onClick={() => onPress()}
            >
              {toggler}
            </Button>
            <Drawer
              className="settings-drawer"
              mask={true}
              width={360}
              onClose={hideDrawer}
              placement={placement}
              open={visible}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="header-top">
                  <Title level={4}>
                    Configurator
                    <Text className="subtitle">See our dashboard options.</Text>
                  </Title>
                </div>

                <div className="sidebar-color">
                  <Title level={5}>Sidebar Color</Title>
                  <div className="theme-color mb-2">
                    <ButtonContainer>
                      <Button
                        style={{ backgroundColor: '#1890ff', color: '#fff' }}
                        onClick={() => handleSidenavColor('#1890ff')}
                      >
                        1
                      </Button>
                      <Button
                        style={{ backgroundColor: '#52c41a', color: '#fff' }}
                        onClick={() => handleSidenavColor('#52c41a')}
                      >
                        1
                      </Button>
                      <Button
                        style={{ backgroundColor: '#d9363e', color: '#fff' }}
                        onClick={() => handleSidenavColor('#d9363e')}
                      >
                        1
                      </Button>
                      <Button
                        style={{ backgroundColor: '#fadb14', color: '#fff' }}
                        onClick={() => handleSidenavColor('#fadb14')}
                      >
                        1
                      </Button>
                      <Button
                        style={{ backgroundColor: '#111', color: '#fff' }}
                        onClick={() => handleSidenavColor('#111')}
                      >
                        1
                      </Button>
                    </ButtonContainer>
                  </div>

                  <div className="sidebarnav-color mb-2">
                    <Title level={5}>Sidenav Type</Title>
                    <Text>Choose between 2 different sidenav types.</Text>
                    <ButtonContainer className="trans">
                      <Button
                        type={
                          sidenavType === 'transparent' ? 'primary' : 'default'
                        }
                        onClick={() => {
                          handleSidenavType('transparent');
                          setSidenavType('transparent');
                        }}
                      >
                        TRANSPARENT
                      </Button>
                      <Button
                        type={sidenavType === 'white' ? 'primary' : 'default'}
                        onClick={() => {
                          handleSidenavType('white');
                          setSidenavType('white');
                        }}
                      >
                        WHITE
                      </Button>
                    </ButtonContainer>
                  </div>
                  {/* <div className="fixed-nav mb-2">
                  <Title level={5}>Navbar Fixed</Title>
                  <Switch onChange={(checked) => handleFixedNavbar(checked)} />
                </div> */}
                </div>
              </div>
            </Drawer>
            <Badge
              size="small"
              className="header-notifications"
              count={bellData.length + bellData2.length}
            >
              <Dropdown
                trigger={['click']}
                dropdownRender={() => (
                  <div
                    className="header-notifications-dropdown"
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      padding: '10px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      width: '300px',
                    }}
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={combinedData}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar shape="square">
                                {!item.image ? (
                                  <ExclamationCircleOutlined
                                    style={{ fontSize: '24px', color: 'red' }}
                                  />
                                ) : (
                                  <img
                                    src={item.image}
                                    alt={item.ingredientName}
                                  />
                                )}
                              </Avatar>
                            }
                            title={
                              <span>
                                {item.ingredientName}
                                {item.type === 'bellData' && ' (low stock)'}
                                {item.type === 'bellData2' &&
                                  (dayjs(item.expiredDate).isBefore(dayjs())
                                    ? ' (expired)'
                                    : ' (nearly expired)')}
                              </span>
                            }
                            description={
                              <div>
                                <p>
                                  <strong>Available Quantity:</strong>{' '}
                                  {item.availableQuantity} {item.unit}
                                </p>
                                {item.type === 'bellData2' ? (
                                  <>
                                    <p>
                                      <strong>Imported Date:</strong>{' '}
                                      {dayjs(item.importedDate).format(
                                        'DD-MM-YYYY'
                                      )}
                                    </p>
                                    <p>
                                      <strong>Expired Date:</strong>{' '}
                                      {dayjs(item.expiredDate).format(
                                        'DD-MM-YYYY'
                                      )}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p>
                                      <strong>Imported Quantity:</strong>{' '}
                                      {item.importedQuantity} {item.unit}
                                    </p>
                                    <p>
                                      <strong>Quantity Used:</strong>{' '}
                                      {item.quantityUsed} {item.unit}
                                    </p>
                                  </>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              >
                <a
                  href="#pablo"
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  {bell}
                </a>
              </Dropdown>
            </Badge>
            {user ? (
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <Avatar icon={<UserOutlined />} src={user.avatar} />
                  <span
                    style={{
                      marginLeft: '8px',
                      fontWeight: '600',
                      marginRight: '10px',
                      fontSize: '16px',
                    }}
                  >
                    Welcome, {user.fullName}
                  </span>
                </a>
              </Dropdown>
            ) : (
              <Link to="/login" className="btn-sign-in">
                {profile}
                <span>Sign in</span>
              </Link>
            )}
            {/* <Form>
              <Input
                className="header-search w-[400px]"
                placeholder="Type here..."
                prefix={<SearchOutlined />}
              />
            </Form> */}
          </Col>
        </Row>
      </section>
    </>
  );
}

export default Header;
