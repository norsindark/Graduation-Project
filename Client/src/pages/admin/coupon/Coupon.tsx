import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Tag,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { FaTags } from 'react-icons/fa';
import CouponNew from './CouponNew';
import CouponEdit from './CouponEdit';
import {
  callGetAllCoupon,
  callDeleteUser,
  callDeleteCoupon,
} from '../../../services/serverApi';
import type { ColumnType } from 'antd/es/table';
import CouponDetail from './CouponDetail';

interface CouponItem {
  couponId: string;
  couponCode: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
  availableQuantity: number;
  startDate: string;
  expirationDate: string;
  status: string;
  code: string;
  maxUsage: string;
}

const Coupon: React.FC = () => {
  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [showCouponDetail, setShowCouponDetail] = useState<boolean>(false);
  const [showCouponNew, setShowCouponNew] = useState<boolean>(false);
  const [showCouponEdit, setShowCouponEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<CouponItem | null>(null);
  const [loading, setLoading] = useState(false);

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
        query += `&sortBy=startDate&sortDir=desc`;
      }

      const response = await callGetAllCoupon(query);
      if (response?.status == 200) {
        if (
          response &&
          response.data._embedded &&
          Array.isArray(response.data._embedded.couponResponseList)
        ) {
          setListUser(response.data._embedded.couponResponseList);
          setTotal(response.data.page.totalElements);
        } else {
          setListUser([]);
          setTotal(0);
        }
      } else {
        notification.error({
          message: 'Unable to load coupon list',
          description:
            response.data.errors?.error || 'Error during get process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Unable to load coupon list',
        description: 'Error during get process!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowCouponNew(false);
    fetchItems();
  };

  const handleEditSuccess = () => {
    setShowCouponEdit(false);
    setCurrentItem(null);
    fetchItems();
  };

  const handleEditClick = (item: CouponItem) => {
    setCurrentItem(item);
    setShowCouponEdit(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const res = await callDeleteCoupon(id);
      if (res?.status == 200) {
        notification.success({
          message: 'Coupon deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchItems();
      } else {
        notification.error({
          message: 'Unable to delete coupon',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Unable to delete coupon',
        description: 'Error during delete process!',
        duration: 5,
        showProgress: true,
      });
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

  const handleViewClick = (record: CouponItem) => {
    setCurrentItem(record);
    setShowCouponDetail(true);
  };

  const columns = [
    {
      title: 'Coupon Code',
      dataIndex: 'couponCode',
      key: 'couponCode',
      sorter: (a: any, b: any) => a.couponCode.localeCompare(b.couponCode),
    },
    {
      title: 'Discount %',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      sorter: (a: any, b: any) =>
        a.discountPercent.localeCompare(b.discountPercent),
      render: (discountPercent: number) =>
        discountPercent.toLocaleString() + ' %',
    },
    {
      title: 'Max Discount',
      dataIndex: 'maxDiscount',
      key: 'maxDiscount',
      sorter: (a: any, b: any) => a.maxDiscount.localeCompare(b.maxDiscount),
      render: (maxDiscount: number) => maxDiscount.toLocaleString() + ' VNĐ',
    },
    {
      title: 'Min Order',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      sorter: (a: any, b: any) =>
        a.minOrderValue.localeCompare(b.minOrderValue),
      render: (minOrderValue: number) =>
        minOrderValue.toLocaleString() + ' VNĐ',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CouponItem) => (
        <Space
          size="small"
          //   className="flex justify-center items-center flex-col"
        >
          <Button
            type="default"
            shape="round"
            icon={<EyeOutlined />}
            onClick={() => handleViewClick(record)}
          >
            View
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this coupon?"
            onConfirm={() => handleDeleteClick(record.couponId)}
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
        title="Coupon Management"
        extra={
          !showCouponNew &&
          !showCouponEdit && (
            <Button
              type="primary"
              shape="round"
              icon={<FaTags />}
              onClick={() => setShowCouponNew(true)}
            >
              Add New Coupon
            </Button>
          )
        }
      >
        {showCouponNew ? (
          <CouponNew
            onAddSuccess={handleAddSuccess}
            setShowCouponNew={setShowCouponNew}
          />
        ) : showCouponEdit && currentItem ? (
          <CouponEdit
            currentItem={currentItem}
            onEditSuccess={handleEditSuccess}
            setShowCouponEdit={setShowCouponEdit}
          />
        ) : showCouponDetail ? (
          <CouponDetail
            couponCode={currentItem?.couponCode}
            visible={showCouponDetail}
            onClose={() => setShowCouponDetail(false)}
          />
        ) : (
          <Table
            dataSource={listUser}
            columns={columns as ColumnType<CouponItem>[]}
            rowKey="couponId"
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
    </div>
  );
};

export default Coupon;
