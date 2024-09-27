import { useState, useEffect } from 'react';
import { DatePicker, Table, Button, message, Card, notification } from 'antd';

import dayjs from 'dayjs';
import { Row, Col } from 'antd';
import { Input, Select } from 'antd';

import {
  callGetAllAttendanceManagement,
  callUpdateAttendanceManagement,
} from '../../../services/serverApi';

import { EditOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';

interface AttendanceManagement {
  attendanceId: string;
  employeeName: string;
  shiftName: string;
  shiftStartTime: string;
  shiftEndTime: string;
  attendanceDate: string;
  status: 'PENDING' | 'ABSENT' | 'LATE' | 'PRESENT';
  note: string;
}

const AttendanceManagement = () => {
  const [listAttendanceManagement, setListAttendanceManagement] = useState<
    AttendanceManagement[]
  >([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    fetchItems();
  }, [current, pageSize, filter, sortQuery, selectedDate]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let date = selectedDate ? selectedDate.format('YYYY-MM-DD') : '';

      let query = `date=${date}&pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=status&sortDir=desc`;
      }

      const response = await callGetAllAttendanceManagement(query);
      if (response?.status === 200) {
        const dataList =
          response.data._embedded?.attendanceByDateResponseList || [];
        setListAttendanceManagement(dataList);
        setTotal(response.data.page.totalElements);
      } else {
        notification.error({
          message: 'Unable to load attendance list',
          description:
            response.data.errors?.error || 'Error while fetching data!',
          duration: 5,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Unable to load attendance list',
        description: 'Connection or system error!',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    setCurrent(1);
    setPageSize(5);
  };

  const handleAddTimekeeping = () => {
    if (!selectedDate) {
      message.error('Please select a date before adding attendance');
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

  const isEditing = (record: AttendanceManagement) =>
    record.attendanceId === editingKey;

  const edit = (record: AttendanceManagement) => {
    setEditingKey(record.attendanceId);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (attendanceId: string) => {
    try {
      const row = listAttendanceManagement.find(
        (item) => item.attendanceId === attendanceId
      );
      if (row) {
        await handleConfirmAttendance(row.attendanceId, row.status, row.note);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Error when saving:', errInfo);
    }
  };

  const handleStatusChange = (attendanceId: string, newStatus: string) => {
    setListAttendanceManagement((prev) =>
      prev.map((item) =>
        item.attendanceId === attendanceId
          ? {
              ...item,
              status: newStatus as 'PENDING' | 'ABSENT' | 'LATE' | 'PRESENT',
            }
          : item
      )
    );
  };

  const handleNoteChange = (attendanceId: string, newNote: string) => {
    setListAttendanceManagement((prev) =>
      prev.map((item) =>
        item.attendanceId === attendanceId ? { ...item, note: newNote } : item
      )
    );
  };

  const handleConfirmAttendance = async (
    attendanceId: string,
    status: string,
    note: string = ''
  ) => {
    try {
      const responseUpdate = await callUpdateAttendanceManagement(
        attendanceId,
        status,
        note
      );
      if (responseUpdate?.status === 200) {
        message.success('Attendance status updated successfully');
        fetchItems();
      } else {
        message.error('Update failed');
      }
    } catch (error) {
      message.error('Error during update process');
    }
  };

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: (a: any, b: any) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: 'Shift Name',
      dataIndex: 'shiftName',
      key: 'shiftName',
      sorter: (a: any, b: any) => a.shiftName.localeCompare(b.shiftName),
    },
    {
      title: 'Start Time',
      dataIndex: 'shiftStartTime',
      key: 'shiftStartTime',
    },
    {
      title: 'End Time',
      dataIndex: 'shiftEndTime',
      key: 'shiftEndTime',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (text: string, record: AttendanceManagement) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={text}
            onChange={(e) =>
              handleNoteChange(record.attendanceId, e.target.value)
            }
          />
        ) : (
          text
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: AttendanceManagement) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(record.attendanceId, value)}
          >
            <Select.Option value="PRESENT">PRESENT</Select.Option>
            <Select.Option value="ABSENT">ABSENT</Select.Option>
            <Select.Option value="LATE">LATE</Select.Option>
          </Select>
        ) : ['PRESENT', 'ABSENT', 'LATE'].includes(status) ? (
          { PRESENT: 'PRESENT', ABSENT: 'ABSENT', LATE: 'LATE' }[status]
        ) : (
          status
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: AttendanceManagement) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.attendanceId)}
              style={{ marginRight: 8 }}
              type="primary"
              shape="round"
              icon={<SaveOutlined />}
            >
              Save
            </Button>
            <Button
              type="primary"
              danger
              shape="round"
              icon={<CloseOutlined />}
              onClick={cancel}
            >
              Cancel
            </Button>
          </span>
        ) : (
          <Button
            type="primary"
            shape="round"
            onClick={() => edit(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <div className="layout-content">
      <Card
        title="Attendance Management"
        extra={
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        }
      >
        <Row>
          <Col xs={24}>
            <Table
              dataSource={listAttendanceManagement}
              columns={columns}
              rowKey={(record) => record.attendanceId}
              loading={loading}
              onChange={onChange}
              pagination={{
                current: current,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                onShowSizeChange: (_, size) => {
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
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
