import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Drawer,
  Descriptions,
  Row,
  Col,
  Typography,
  Avatar,
  Pagination,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import UserNew from './UserNew';
import UserEdit from './UserEdit';
import {
  callGetUsers,
  callDeleteUser,
  callGetUserById,
} from '../../../services/serverApi';
import type { ColumnType } from 'antd/es/table';
import Loading from '../../../components/Loading/Loading';
interface UserItem {
  id: string;
  email: string;
  fullName: string;
  role: {
    id: string;
    name: string;
  };
  status: string;
}
interface UserDetail extends UserItem {
  avatar: string | null;
  addresses: any[];
}

const { Title, Text } = Typography;

const User: React.FC = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [showUserNew, setShowUserNew] = useState<boolean>(false);
  const [showUserEdit, setShowUserEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [showUserDetail, setShowUserDetail] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  console.log(userDetail);

  useEffect(() => {
    fetchItems();
  }, [current, pageSize, filter, sortQuery]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (filter) {
        query += `&filter=${filter}`;
      }
      if (sortQuery) {
        query += `&sort=${sortQuery}`;
      }

      const response = await callGetUsers(query);
      if (response?.status == 200) {
        if (
          response &&
          response.data._embedded &&
          Array.isArray(response.data._embedded.getUserResponseList)
        ) {
          setListUser(response.data._embedded.getUserResponseList);
          setTotal(response.data.page.totalElements);
        } else {
          setListUser([]);
          setTotal(0);
        }
      } else {
        notification.error({
          message: 'Unable to load user list',
          description:
            response.data.errors?.error || 'Error during get process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Unable to load user list',
        description: 'Error during get process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowUserNew(false);
    fetchItems();
  };

  const handleEditSuccess = () => {
    setShowUserEdit(false);
    setCurrentItem(null);
    fetchItems();
  };

  const handleEditClick = (item: UserItem) => {
    setCurrentItem(item);
    setShowUserEdit(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const res = await callDeleteUser(id);
      if (res?.status == 200) {
        notification.success({
          message: 'User deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchItems();
      } else {
        notification.error({
          message: 'Unable to delete user',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Unable to delete user',
        description: 'Error during delete process!',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const onChange = (pagination: any, filters: any, sorter: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
    if (sorter && sorter.field) {
      const order = sorter.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`${sorter.field},${order}`);
    } else {
      setSortQuery('');
    }
  };

  const handleDetailClick = async (id: string) => {
    setLoading(true);
    try {
      const response = await callGetUserById(id);
      if (response.status === 200) {
        setUserDetail(response.data);
        setShowUserDetail(true);
      }
    } catch (error) {
      console.error('Error when get user detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <Button type="link" onClick={() => handleDetailClick(text)}>
          {text.slice(0, 7)}
        </Button>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserItem) => (
        <Space size="small">
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Card
        title="User Management"
        extra={
          !showUserNew &&
          !showUserEdit && (
            <Button
              type="primary"
              shape="round"
              icon={<UserAddOutlined />}
              onClick={() => setShowUserNew(true)}
            >
              Add New User
            </Button>
          )
        }
      >
        {showUserNew ? (
          <UserNew
            onAddSuccess={handleAddSuccess}
            setShowUserNew={setShowUserNew}
          />
        ) : showUserEdit && currentItem ? (
          <UserEdit
            currentItem={currentItem}
            onEditSuccess={handleEditSuccess}
            setShowUserEdit={setShowUserEdit}
          />
        ) : (
          <Table
            dataSource={listUser}
            columns={columns as ColumnType<UserItem>[]}
            rowKey="id"
            loading={loading}
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              onShowSizeChange: (current, size) => {
                setCurrent(1);
                setPageSize(size);
              },
            }}
            scroll={{ x: 'max-content' }}
            bordered
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        )}
      </Card>{' '}
      <Drawer
        title="User Detail"
        placement="right"
        onClose={() => setShowUserDetail(false)}
        open={showUserDetail}
        width="50%"
      >
        {loading ? (
          <Loading />
        ) : userDetail ? (
          <Row gutter={[16, 16]} className="user-detail-container">
            <Col xs={24} sm={12}>
              <Typography.Title level={5}>Avatar</Typography.Title>
              {userDetail.avatar ? (
                <Avatar size={100} src={userDetail.avatar} />
              ) : (
                <Avatar size={100} icon={<UserOutlined />} />
              )}
            </Col>
            <Col xs={24} sm={12}>
              <Typography.Title level={5}>Basic Information</Typography.Title>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="ID">
                  {userDetail.id}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24}>
              <div className="fp_dashboard_body address_body">
                <h3>
                  <i
                    className="fas fa-home"
                    style={{ fontSize: '22px', marginRight: '5px' }}
                  />
                  User Address
                </h3>
                {userDetail.addresses.length > 0 ? (
                  <div className="fp_dashboard_existing_address">
                    <Row gutter={[16, 16]}>
                      {userDetail.addresses.map((address, index) => (
                        <Col key={index} xs={24} md={12}>
                          <div className="fp__checkout_single_address">
                            <div className="form-check">
                              <label className="form-check-label">
                                <span className="icon mb-3">
                                  <i className="fas fa-home"></i>
                                  {address.addressType}
                                </span>
                                <div className="p-2 bg-white shadow-md rounded-lg">
                                  <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1">
                                    <div className="flex flex-col">
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Phone:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.phoneNumber}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Street:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.street}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          City:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.city}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          State:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.state}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Country:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.country}
                                        </span>
                                      </div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-700 mr-1">
                                          Postal Code:
                                        </span>
                                        <span className="text-gray-600">
                                          {address.postalCode}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            </div>
                            <ul>
                              <li>
                                <a
                                  className="dash_edit_btn"
                                  onClick={() => handleEditClick(address)}
                                >
                                  <i className="far fa-edit"></i>
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dash_del_icon"
                                  onClick={() => handleDeleteClick(address.id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ) : (
                  <Text>Không có địa chỉ</Text>
                )}
              </div>
            </Col>
          </Row>
        ) : (
          <Text>Không có dữ liệu</Text>
        )}
      </Drawer>
    </div>
  );
};

export default User;
