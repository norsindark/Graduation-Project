import { useState } from 'react';
import { DatePicker, Table, Button, Modal, Form, Select, message } from 'antd';
import { FaCalendarCheck } from 'react-icons/fa';
import moment from 'moment';

interface Employee {
  id: string;
  name: string;
}

interface AttendanceManagement {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

const AttendanceManagement = () => {
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(
    moment()
  );
  const [AttendanceManagement, setAttendanceManagement] = useState<
    AttendanceManagement[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] =
    useState<AttendanceManagement | null>(null);
  const [form] = Form.useForm();

  // Giả lập danh sách nhân viên, trong thực tế bạn sẽ lấy từ API
  const employees: Employee[] = [
    { id: '1', name: 'Nhân viên 1' },
    { id: '2', name: 'Nhân viên 2' },
    { id: '3', name: 'Nhân viên 3' },
  ];

  const fetchTimekeepingRecords = (date: moment.Moment) => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu chấm công
    // Ở đây chúng ta sẽ tạo dữ liệu mẫu
    const records: AttendanceManagement[] = employees.map((employee) => ({
      id: `${employee.id}-${date.format('YYYY-MM-DD')}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date: date.format('YYYY-MM-DD'),
      status: Math.random() > 0.5 ? 'present' : 'absent',
    }));
    setAttendanceManagement(records);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setSelectedDate(date);
      fetchTimekeepingRecords(date);
    }
  };

  const handleAddTimekeeping = () => {
    if (selectedDate) {
      setIsModalVisible(true);
    } else {
      message.error('Vui lòng chọn ngày trước khi thêm chấm công');
    }
  };

  const handleEditClick = (record: AttendanceManagement) => {
    form.setFieldsValue({
      employeeId: record.employeeId,
      status: record.status,
    });
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (id: string) => {
    // Trong thực tế, bạn sẽ gọi API để xóa dữ liệu
    setAttendanceManagement(
      AttendanceManagement.filter((record) => record.id !== id)
    );
    message.success('Đã xóa dữ liệu chấm công');
  };

  const handleModalOk = () => {
    if (selectedDate) {
      form.validateFields().then((values) => {
        if (currentRecord) {
          // Chỉnh sửa bản ghi hiện có
          const updatedRecords = AttendanceManagement.map((record) =>
            record.id === currentRecord.id
              ? {
                  ...record,
                  employeeId: values.employeeId,
                  employeeName:
                    employees.find((e) => e.id === values.employeeId)?.name ||
                    '',
                  status: values.status,
                }
              : record
          );
          setAttendanceManagement(updatedRecords);
          message.success('Đã cập nhật dữ liệu chấm công');
        } else {
          // Thêm bản ghi mới
          const newRecord: AttendanceManagement = {
            id: Date.now().toString(),
            employeeId: values.employeeId,
            employeeName:
              employees.find((e) => e.id === values.employeeId)?.name || '',
            date: selectedDate.format('YYYY-MM-DD'),
            status: values.status,
          };
          setAttendanceManagement([...AttendanceManagement, newRecord]);
          message.success('Đã thêm dữ liệu chấm công');
        }
        setIsModalVisible(false);
        setCurrentRecord(null);
        form.resetFields();
      });
    }
  };

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'present':
            return 'Có mặt';
          case 'absent':
            return 'Vắng mặt';
          case 'late':
            return 'Đi muộn';
          default:
            return status;
        }
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: AttendanceManagement) => (
        <>
          <Button onClick={() => handleEditClick(record)}>Sửa</Button>
          <Button
            onClick={() => handleDeleteClick(record.id)}
            style={{ marginLeft: 8 }}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div
      className="tab-pane fade"
      id="v-pills-attendance-management"
      role="tabpanel"
      aria-labelledby="v-pills-attendance-management-tab"
    >
      <div className="fp_dashboard_body address_body">
        <h3>
          <FaCalendarCheck style={{ fontSize: '22px', marginRight: '5px' }} />
          Quản lý chấm công
        </h3>
        <div style={{ marginBottom: 16 }}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            style={{ marginRight: 16 }}
          />
          <Button type="primary" onClick={handleAddTimekeeping}>
            Thêm chấm công
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={AttendanceManagement}
          rowKey="id"
        />
        <Modal
          title={currentRecord ? 'Chỉnh sửa chấm công' : 'Thêm chấm công'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            setCurrentRecord(null);
            form.resetFields();
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="employeeId"
              label="Nhân viên"
              rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
              <Select>
                {employees.map((employee) => (
                  <Select.Option key={employee.id} value={employee.id}>
                    {employee.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Select.Option value="present">Có mặt</Select.Option>
                <Select.Option value="absent">Vắng mặt</Select.Option>
                <Select.Option value="late">Đi muộn</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AttendanceManagement;
