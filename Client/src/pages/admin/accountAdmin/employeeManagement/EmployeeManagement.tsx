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

const { Title } = Typography;

const EmployeeManagement: React.FC = () => {
  const [listEmployee, setListEmployee] = useState<EmployeeItem[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [showEmployeeNew, setShowEmployeeNew] = useState<boolean>(false);
  const [showEmployeeEdit, setShowEmployeeEdit] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeItem | null>(
    null
  );

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
          message: 'Xóa nhân viên thành công!',
          duration: 5,
          showProgress: true,
        });
        fetchItems();
      } else {
        notification.error({
          message: 'Xóa nhân viên thất bại',
          description: response.data.errors?.error || 'Đã xảy ra lỗi!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi xóa nhân viên',
        description: 'Đã xảy ra lỗi trong quá trình xóa!',
        duration: 5,
        showProgress: true,
      });
    }
  };

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
      } else {
        notification.error({
          message: 'Không thể tải danh sách nhân viên',
          description: 'Đã xảy ra lỗi trong quá trình lấy dữ liệu!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Không thể tải danh sách nhân viên',
        description: 'Đã xảy ra lỗi trong quá trình lấy dữ liệu!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
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

  const columns: ColumnType<EmployeeItem>[] = [
    {
      title: 'ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text: string) => text.slice(0, 7),
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      sorter: true,
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      sorter: true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: EmployeeItem) => (
        <Space size="small">
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDeleteClick(record.employeeId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
            >
              Xóa
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
          Quản lý nhân viên
        </h3>
        <Card
          title="Quản lý nhân viên"
          extra={
            !showEmployeeNew &&
            !showEmployeeEdit && (
              <Button
                type="primary"
                shape="round"
                icon={<UserAddOutlined />}
                onClick={() => setShowEmployeeNew(true)}
              >
                Thêm nhân viên mới
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
                pageSizeOptions: ['5', '10', '20', '50'],
                onShowSizeChange: (current, size) => {
                  setCurrent(1);
                  setPageSize(size);
                },
              }}
              scroll={{ x: 'max-content' }}
              bordered
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployeeManagement;
