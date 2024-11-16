import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Button, Pagination, notification, Table } from 'antd';

import EmployeeShiftNew from './EmployeeShiftNew';
import EmployeeShiftEdit from './EmployeeShiftEdit';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { Popconfirm, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
interface EmployeeShift {
  id: string;
  employee: {
    id: string;
    employeeName: string;
    salary: number;
    jobTitle: string;
    createdAt: string;
    updatedAt: string;
  };
  shift: {
    id: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  };
  workDate: string;
  newWorkDate: string;
  status: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

import {
  callGetAllEmployeeShift,
  callDeleteEmployeeShift,
} from '../../../services/serverApi';

const EmployeeShift: React.FC = () => {
  const [listEmployeeShift, setListEmployeeShift] = useState<EmployeeShift[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [showEmployeeShiftNew, setShowEmployeeShiftNew] = useState(false);
  const [showEmployeeShiftEdit, setShowEmployeeShiftEdit] = useState(false);
  const [currentEmployeeShift, setCurrentEmployeeShift] =
    useState<EmployeeShift | null>(null);

  useEffect(() => {
    fetchShifts();
  }, [currentPage, pageSize, filter, sortQuery]);

  const fetchShifts = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${currentPage - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=workDate&sortDir=asc`;
      }
      const response = await callGetAllEmployeeShift(query);
      if (response?.status === 200) {
        if (
          response.data._embedded &&
          Array.isArray(response.data._embedded.employeeShiftList)
        ) {
          setListEmployeeShift(response.data._embedded.employeeShiftList);
          setTotal(response.data.page.totalElements);
        } else {
          setListEmployeeShift([]);
          setTotal(0);
        }
      } else if (
        response?.status === 400 &&
        response.data.errors?.error === 'No Employee Shift found'
      ) {
        setListEmployeeShift([]);
        setTotal(0);
        if (
          currentPage > 1 &&
          response.data.page.totalElements <= (currentPage - 1) * pageSize
        ) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch {
      notification.error({
        message: 'Không thể tải danh sách ca làm việc',
        description: 'Đã xảy ra lỗi khi tải dữ liệu!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (pagination: any, sortDir: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    if (sortDir && sortDir.field) {
      const order = sortDir.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`${sortDir.field},${order}`);
    } else {
      setSortQuery('');
    }
  };

  const handleAddSuccess = () => {
    setShowEmployeeShiftNew(false);
    fetchShifts();
  };

  const handleEditClick = (item: EmployeeShift) => {
    setCurrentEmployeeShift(item);
    setShowEmployeeShiftEdit(true);
  };

  const handleEditSuccess = () => {
    setShowEmployeeShiftEdit(false);
    setCurrentEmployeeShift(null);
    fetchShifts();
  };

  const handleDeleteClick = async (
    employeeId: string,
    shiftId: string,
    workDate: string
  ) => {
    try {
      const response = await callDeleteEmployeeShift(
        employeeId,
        shiftId,
        workDate
      );
      if (response?.status == 200) {
        notification.success({
          message: 'Shift has been successfully deleted!',
          duration: 5,
          showProgress: true,
        });
        fetchShifts();
      } else {
        notification.error({
          message: 'Unable to delete shift',
          description: response.data.errors?.error || 'An error occurred!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting shift',
        description: 'An error occurred during the deletion process!',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: ['employee', 'employeeName'],
      key: 'employeeName',
      sorter: (a: EmployeeShift, b: EmployeeShift) =>
        a.employee.employeeName.localeCompare(b.employee.employeeName),
    },
    {
      title: 'Shift Name',
      dataIndex: ['shift', 'shiftName'],
      key: 'shiftName',
      sorter: (a: EmployeeShift, b: EmployeeShift) =>
        a.shift.shiftName.localeCompare(b.shift.shiftName),
    },
    {
      title: 'Work Date',
      dataIndex: 'workDate',
      key: 'workDate',
      sorter: (a: EmployeeShift, b: EmployeeShift) =>
        a.workDate.localeCompare(b.workDate),
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Start Time',
      dataIndex: ['shift', 'startTime'],
      key: 'startTime',
      sorter: (a: EmployeeShift, b: EmployeeShift) =>
        a.shift.startTime.localeCompare(b.shift.startTime),
      render: (text: string) => text.slice(0, 5), // Chỉ lấy HH:MM
    },
    {
      title: 'End Time',
      dataIndex: ['shift', 'endTime'],
      key: 'endTime',
      sorter: (a: EmployeeShift, b: EmployeeShift) =>
        a.shift.endTime.localeCompare(b.shift.endTime),
      render: (text: string) => text.slice(0, 5), // Chỉ lấy HH:MM
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: EmployeeShift) => (
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
            title="Are you sure you want to delete this shift?"
            onConfirm={() =>
              handleDeleteClick(
                record.employee.id,
                record.shift.id,
                moment(record.workDate).format('YYYY-MM-DD')
              )
            }
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
        title="Employee Shift Management"
        extra={
          !showEmployeeShiftNew &&
          !showEmployeeShiftEdit && (
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => setShowEmployeeShiftNew(true)}
            >
              Create New Shift
            </Button>
          )
        }
      >
        {showEmployeeShiftNew ? (
          <EmployeeShiftNew
            onAddSuccess={handleAddSuccess}
            setShowEmployeeShiftNew={setShowEmployeeShiftNew}
          />
        ) : showEmployeeShiftEdit && currentEmployeeShift ? (
          <EmployeeShiftEdit
            currentEmployeeShift={currentEmployeeShift}
            onEditSuccess={handleEditSuccess}
            setShowEmployeeShiftEdit={setShowEmployeeShiftEdit}
          />
        ) : (
          <Table
            dataSource={listEmployeeShift}
            columns={columns}
            rowKey="id"
            loading={loading}
            onChange={onChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              onShowSizeChange: (current, size) => {
                setCurrentPage(1);
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

export default EmployeeShift;
