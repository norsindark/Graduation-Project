import React, { useEffect, useState } from 'react';
import {
  callDeleteReview,
  callGetAllReview,
} from '../../../services/serverApi';
import {
  Table,
  Rate,
  Avatar,
  Space,
  Typography,
  Collapse,
  notification,
  Button,
  Col,
  Row,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
const { Text } = Typography;
const { Panel } = Collapse;

interface Review {
  reviewId: string;
  rating: number;
  comment: string;
  dishId: string;
  userFullName: string;
  userAvatar: string | null;
  replies: Reply[];
  createdAt: string;
}

interface Reply {
  reviewId: string;
  rating: number;
  comment: string;
  userFullName: string;
  userAvatar: string | null;
  replies: Reply[];
  createdAt: string;
}

interface Dish {
  dishId: string;
  name: string;
}

function Review() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState('');

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    if (selectedDish) {
      fetchReviews(selectedDish.dishId);
    }
  }, [selectedDish]);

  const fetchDishes = async () => {
    setDishes([
      { dishId: '1', name: 'Dish 1' },
      { dishId: '2', name: 'Dish 2' },
      { dishId: '3', name: 'Dish 3' },
    ]);
  };

  const fetchReviews = async (dishId: string) => {
    setLoading(true);
    setError(null);
    try {
      const query = `pageNo=0&pageSize=10&sortBy=createdAt&sortDir=desc&dishId=${dishId}`;
      const response = await callGetAllReview(query);
      setReviews(response.data._embedded.reviewResponseList);
    } catch (error) {
      setError('Failed to fetch reviews');
      notification.error({
        message: 'Error',
        description: 'Failed to fetch reviews',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
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

  const handleDeleteClick = async (reviewId: string) => {
    try {
      const res = await callDeleteReview(reviewId);
      if (res?.status === 200) {
        notification.success({
          message: 'Review deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchReviews(selectedDish?.dishId || '');
      } else if (res?.status === 400) {
        notification.error({
          message: 'Error deleting review: This review has replies.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error deleting review.',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting review.',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const columns: ColumnsType<Review> = [
    {
      title: 'User',
      dataIndex: 'userFullName',
      key: 'userFullName',
      render: (text, record) => (
        <Space>
          <Avatar src={record.userAvatar || '/default-avatar.png'} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Replies',
      dataIndex: 'replies',
      key: 'replies',
      render: (replies) => replies.length,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Review) => (
        <Space>
          <Popconfirm
            title="Delete this review?"
            onConfirm={() => handleDeleteClick(record.reviewId)}
          >
            <Button type="primary" danger shape="round">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <div className="container mx-auto p-4">
        <Row>
          <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}>
            <Button
              type="primary"
              className="mb-3"
              size="large"
              shape="round"
              block
            >
              Review
            </Button>
          </Col>
        </Row>

        <div className="flex">
          {/* Danh sách món ăn */}
          <div className="w-1/5 pr-4">
            <h2 className="text-xl font-semibold mb-2">Danh sách món ăn</h2>
            <ul className="space-y-2">
              {dishes.map((dish) => (
                <li
                  key={dish.dishId}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedDish?.dishId === dish.dishId ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleDishClick(dish)}
                >
                  <h3 className="font-semibold text-base"> {dish.name}</h3>
                </li>
              ))}
            </ul>
          </div>

          {/* Danh sách reviews */}
          <div className="w-4/5 pl-4">
            <h2 className="text-xl font-semibold mb-2">
              {selectedDish
                ? `Reviews for ${selectedDish.name}`
                : 'Select a dish to view reviews'}
            </h2>
            <Table
              columns={columns}
              dataSource={reviews}
              rowKey="reviewId"
              loading={loading}
              onChange={onChange}
              pagination={{
                current,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                onShowSizeChange: (_, size) => {
                  setCurrent(1);
                  setPageSize(size);
                },
                onChange: (page) => {
                  setCurrent(page);
                },
              }}
              scroll={{ x: 'max-content' }}
              bordered
              expandable={{ childrenColumnName: 'replies' }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
