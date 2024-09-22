import React, { useState, useEffect } from 'react';
import { Table, Button, notification, Card, Space, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import UserNew from './UserNew';
import UserEdit from './UserEdit';
import axios from 'axios';
import { callGetUsers } from '../../../services/serverApi';
import type { ColumnType } from 'antd/es/table';

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
      console.log('response', response);

      if (
        response &&
        response._embedded &&
        Array.isArray(response._embedded.getUserResponseList)
      ) {
        setListUser(response._embedded.getUserResponseList);
        setTotal(response.page.totalElements);
      } else {
        console.error('Received data is not in the expected format:', response);
        setListUser([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error loading user list:', error);
      notification.error({
        message: 'Unable to load user list',
        duration: 5,
      });
    }
    setLoading(false);
  };

  const handleAddSuccess = () => {
    setShowUserNew(false);
    notification.success({
      message: 'User added successfully!',
      duration: 5,
    });
    fetchItems();
  };

  const handleEditSuccess = () => {
    setShowUserEdit(false);
    setCurrentItem(null);
    notification.success({
      message: 'User information updated successfully!',
      duration: 5,
    });
    fetchItems();
  };

  const handleEditClick = (item: UserItem) => {
    setCurrentItem(item);
    setShowUserEdit(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`);
      notification.success({
        message: 'User deleted successfully!',
        duration: 5,
      });
      fetchItems();
    } catch (error) {
      notification.error({
        message: 'Unable to delete user',
        duration: 5,
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

  const columns = [
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
            onConfirm={() => handleDeleteClick(Number(record.id))}
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
      </Card>
    </div>
  );
};

export default User;
