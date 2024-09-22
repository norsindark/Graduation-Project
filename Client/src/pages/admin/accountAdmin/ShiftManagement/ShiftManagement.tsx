import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Button, Pagination, notification, Table } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import ShiftNew from './ShiftManagementNew';
import ShiftEdit from './ShiftManagementEdit';
// import {
//   callBulkShifts,
//   callDeleteShift,
// } from '../../../../services/clientApi';
import Loading from '../../../../components/Loading/Loading';

interface Shift {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  employees: string[];
}

const ShiftManagement = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [showShiftNew, setShowShiftNew] = useState(false);
  const [showShiftEdit, setShowShiftEdit] = useState(false);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const userId = useSelector((state: RootState) => state.account.user?.id);

  const fetchShifts = async () => {
    if (userId) {
      try {
        // setLoading(true);
        // const response = await callBulkShifts(
        //   userId,
        //   currentPage - 1,
        //   pageSize
        // );
        // if (response.status === 200) {
        //   setShifts(response.data.shifts);
        //   setTotal(response.data.total);
        // }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [userId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddSuccess = () => {
    setShowShiftNew(false);
    fetchShifts();
  };

  const handleEditSuccess = () => {
    setShowShiftEdit(false);
    setCurrentShift(null);
    fetchShifts();
  };

  const handleEditClick = (shift: Shift) => {
    setCurrentShift(shift);
    setShowShiftEdit(true);
  };

  const handleDeleteClick = (id: string) => {
    // callDeleteShift(id)
    //   .then(() => {
    //     notification.success({
    //   message: 'Ca làm việc đã được xóa thành công!',
    //   duration: 5,
    //   showProgress: true,
    // });
    // fetchShifts();
    // })
    // .catch((error: any) => {
    //   notification.error({
    //     message: 'Lỗi khi xóa ca làm việc',
    //     description:
    //       error instanceof Error
    //         ? error.message
    //         : 'Đã xảy ra lỗi trong quá trình xóa!',
    //     duration: 5,
    //     showProgress: true,
    //   });
    // });
  };

  const columns = [
    {
      title: 'Tên ca',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Giờ kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employees',
      key: 'employees',
      render: (employees: string[]) => employees.join(', '),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Shift) => (
        <>
          <Button onClick={() => handleEditClick(record)}>Sửa</Button>
          <Button onClick={() => handleDeleteClick(record.id)}>Xóa</Button>
        </>
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
          Quản lý ca làm việc
        </h3>
        {!showShiftNew && !showShiftEdit && (
          <Button
            type="primary"
            className="mb-3"
            onClick={() => setShowShiftNew(true)}
            size="large"
          >
            Tạo ca làm việc mới
          </Button>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div>
            {showShiftNew ? (
              <ShiftNew
                onAddSuccess={handleAddSuccess}
                setShowShiftNew={setShowShiftNew}
              />
            ) : showShiftEdit && currentShift ? (
              <ShiftEdit
                currentShift={currentShift as any} // Tạm thời ép kiểu
                onEditSuccess={handleEditSuccess}
                setShowShiftEdit={setShowShiftEdit}
              />
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={shifts}
                  pagination={false}
                  rowKey="id"
                />
                {shifts.length > 0 && (
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    className="mt-4"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftManagement;
