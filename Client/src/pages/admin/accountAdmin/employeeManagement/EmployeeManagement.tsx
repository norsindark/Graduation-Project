import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Typography,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { callGetAllEmployee } from '../../../../services/serverApi';
import type { ColumnType } from 'antd/es/table';
import EmployeeManagementNew from './EmployeeManagementNew';
import EmployeeManagementEdit from './EmployeeManagementEdit';
import { callDeleteEmployee } from '../../../../services/serverApi';
import { FaUser } from 'react-icons/fa';

interface EmployeeItem {
  employeeId: string;
  employeeName: string;
  email: string;
  jobTitle: string;
  salary: string;
}

const EmployeeManagement: React.FC = () => {
  const [listEmployee, setListEmployee] = useState<EmployeeItem[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [showEmployeeNew, setShowEmployeeNew] = useState<boolean>(false);
  const [showEmployeeEdit, setShowEmployeeEdit] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeItem | null>(
    null
  );

  useEffect(() => {
    fetchItems();
  }, [current, pageSize, filter, sortQuery]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=createdAt&sortDir=desc`;
      }
      const response = await callGetAllEmployee(query);
      if (response?.status === 200) {
        if (
          response.data._embedded &&
          Array.isArray(response.data._embedded.employeeResponseList)
        ) {
          setListEmployee(response.data._embedded.employeeResponseList);
          setTotal(response.data.page.totalElements);
        } else {
          setListEmployee([]);
          setTotal(0);
        }
      }
    } catch {
      notification.error({
        message: 'Unable to load employee list',
        description: 'An error occurred while fetching data!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (pagination: any, sortDir: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
    if (sortDir && sortDir.field) {
      const order = sortDir.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`${sortDir.field},${order}`);
    } else {
      setSortQuery('');
    }
  };
  const handleAddSuccess = () => {
    setShowEmployeeNew(false);
    fetchItems();
  };

  const handleEditClick = (item: EmployeeItem) => {
    setCurrentEmployee(item);
    setShowEmployeeEdit(true);
  };

  const handleEditSuccess = () => {
    setShowEmployeeEdit(false);
    setCurrentEmployee(null);
    fetchItems();
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const response = await callDeleteEmployee(id);
      if (response?.status === 200) {
        notification.success({
          message: 'Employee deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchItems();
      } else {
        notification.error({
          message: 'Failed to delete employee',
          description: response.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting employee',
        description: 'An error occurred during deletion!',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const columns: ColumnType<EmployeeItem>[] = [
    {
      title: 'ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text: string) => text.slice(0, 7),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: (a: any, b: any) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      sorter: (a: any, b: any) => a.jobTitle.localeCompare(b.jobTitle),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a: any, b: any) => a.salary.localeCompare(b.salary),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: EmployeeItem) => (
        <Space
          size="small"
          className="flex justify-center items-center flex-col"
        >
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => handleDeleteClick(record.employeeId)}
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
    <div
      className="tab-pane fade"
      id="v-pills-employee-management"
      role="tabpanel"
      aria-labelledby="v-pills-employee-management-tab"
    >
      <div className="fp_dashboard_body">
        <h3>
          <FaUser style={{ fontSize: '22px', marginRight: '5px' }} />
          Employee Management
        </h3>
        <Card
          title="Employee Management"
          extra={
            !showEmployeeNew &&
            !showEmployeeEdit && (
              <Button
                type="primary"
                shape="round"
                icon={<UserAddOutlined />}
                onClick={() => setShowEmployeeNew(true)}
              >
                Add New Employee
              </Button>
            )
          }
        >
          {showEmployeeNew ? (
            <EmployeeManagementNew
              onAddSuccess={handleAddSuccess}
              setShowEmployeeNew={setShowEmployeeNew}
            />
          ) : showEmployeeEdit && currentEmployee ? (
            <EmployeeManagementEdit
              currentEmployee={currentEmployee}
              onEditSuccess={handleEditSuccess}
              setShowEmployeeEdit={setShowEmployeeEdit}
            />
          ) : (
            <Table
              dataSource={listEmployee}
              columns={columns}
              rowKey="employeeId"
              loading={loading}
              onChange={onChange}
              pagination={{
                current: current,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['1', '2'],
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
    </div>
  );
};

export default EmployeeManagement;
