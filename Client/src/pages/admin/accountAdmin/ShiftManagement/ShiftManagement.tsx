import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Button, Pagination, notification, Table } from 'antd';

import ShiftManagementNew from './ShiftManagementNew';
import ShiftManagementEdit from './ShiftManagementEdit';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { Popconfirm, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Shift {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
}

import {
  callGetAllShift,
  callDeleteShift,
} from '../../../../services/serverApi';

const ShiftManagement: React.FC = () => {
  const [listShift, setListShift] = useState<Shift[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [showShiftNew, setShowShiftNew] = useState(false);
  const [showShiftEdit, setShowShiftEdit] = useState(false);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);

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
        query += `&sortBy=createdAt&sortDir=desc`;
      }
      const response = await callGetAllShift(query);
      console.log('responseGetAllShift', response.data);

      if (response?.status === 200) {
        if (
          response.data._embedded &&
          Array.isArray(response.data._embedded.shiftResponseList)
        ) {
          setListShift(response.data._embedded.shiftResponseList);
          setTotal(response.data.page.totalElements);
        } else {
          setListShift([]);
          setTotal(0);
        }
      } else if (
        response?.status === 400 &&
        response.data.errors?.error === 'No Shift found'
      ) {
        setListShift([]);
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
        message: 'Unable to load shift list',
        description: 'An error occurred while loading data!',
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
    setShowShiftNew(false);
    fetchShifts();
  };

  const handleEditClick = (item: Shift) => {
    setCurrentShift(item);
    setShowShiftEdit(true);
  };

  const handleEditSuccess = () => {
    setShowShiftEdit(false);
    setCurrentShift(null);
    fetchShifts();
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const response = await callDeleteShift(id);
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
      title: 'Shift Name',
      dataIndex: 'shiftName',
      key: 'shiftName',
      sorter: (a: any, b: any) => a.shiftName.localeCompare(b.shiftName),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: (a: any, b: any) => a.startTime.localeCompare(b.startTime),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      sorter: (a: any, b: any) => a.endTime.localeCompare(b.endTime),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: Shift) => (
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
            onConfirm={() => handleDeleteClick(record.shiftId)}
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
      id="v-pills-shift-management"
      role="tabpanel"
      aria-labelledby="v-pills-shift-management-tab"
    >
      <div className="fp_dashboard_body">
        <h3>
          <FaCalendarAlt style={{ fontSize: '22px', marginRight: '5px' }} />
          Shift Management
        </h3>
        <Card
          title="Shift Management"
          extra={
            !showShiftNew &&
            !showShiftEdit && (
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                onClick={() => setShowShiftNew(true)}
              >
                Create New Shift
              </Button>
            )
          }
        >
          {showShiftNew ? (
            <ShiftManagementNew
              onAddSuccess={handleAddSuccess}
              setShowShiftNew={setShowShiftNew}
            />
          ) : showShiftEdit && currentShift ? (
            <ShiftManagementEdit
              currentShift={currentShift}
              onEditSuccess={handleEditSuccess}
              setShowShiftEdit={setShowShiftEdit}
            />
          ) : (
            <Table
              dataSource={listShift}
              columns={columns}
              rowKey="shiftId"
              loading={loading}
              onChange={onChange}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['1', '2'],
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
    </div>
  );
};

export default ShiftManagement;
