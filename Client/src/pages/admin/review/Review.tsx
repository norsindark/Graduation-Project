import React, { useEffect, useState } from 'react';
import {
  callDeleteReview,
  callGetAllReview,
  callGetAllReviewByDish,
} from '../../../services/serverApi';
import {
  Table,
  Rate,
  Avatar,
  Space,
  Typography,
  notification,
  Button,
  Col,
  Row,
  Popconfirm,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
const { Text } = Typography;

interface Review {
  reviewId: string;
  rating: number;
  comment: string;
  dishId: string;
  dishName: string;
  userId: string;
  userFullName: string;
  userAvatar: string | null;
  replies: Reply[];
  createdAt: string;
}

interface Reply {
  reviewId: string;
  rating: number;
  comment: string;
  dishId: string;
  dishName: string;
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
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState('');

  useEffect(() => {
    fetchReviews(selectedDish?.dishId || '');
  }, [current, pageSize, sortQuery, selectedDish]);

  const fetchReviews = async (dishId: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (dishId) {
        // Use specific dish review endpoint
        response = await callGetAllReviewByDish(dishId);
      } else {
        // Use general review endpoint with pagination
        const query = `page=${current - 1}&size=${pageSize}&sort=createdAt,desc`;
        response = await callGetAllReview(query);
      }

      if (response?.data?._embedded?.reviewResponseList) {
        setReviews(response.data._embedded.reviewResponseList);
        setTotal(response.data.page.totalElements);

        // Update dishes list only on initial load
        if (dishes.length === 0) {
          const uniqueDishes = Array.from(
            new Set(
              response.data._embedded.reviewResponseList.map((review: Review) =>
                JSON.stringify({
                  dishId: review.dishId,
                  name: review.dishName,
                })
              )
            )
          ).map((str) => JSON.parse(str as unknown as string));
          setDishes(uniqueDishes);
        }
      } else {
        setReviews([]);
        setTotal(0);
      }
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
    fetchReviews(dish.dishId);
  };

  const onChange = (pagination: any, filters: any, sorter: any) => {
    const newCurrent = pagination.current;
    const newPageSize = pagination.pageSize;

    // Only fetch if page or size changed
    if (newCurrent !== current || newPageSize !== pageSize) {
      setCurrent(newCurrent);
      setPageSize(newPageSize);
    }

    if (sorter && sorter.field) {
      const order = sorter.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`${sorter.field},${order}`);
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
      } else {
        notification.error({
          message: 'Error deleting review.',
          description: res?.data?.message || 'Unknown error occurred',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting review.',
        description: 'Failed to delete review',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const renderReplyWithDelete = (reply: Reply, level = 1) => (
    <div
      key={reply.reviewId}
      className={`border-l-2 border-gray-200 pl-4 mb-${level === 1 ? '4' : '2'}`}
    >
      <Space direction="vertical" size="small" className="w-full">
        <Space className="w-full justify-between">
          <Space>
            <Avatar src={reply.userAvatar || '/default-avatar.png'} />
            <Text strong>{reply.userFullName}</Text>
            <Text type="secondary">
              {dayjs(reply.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Text>
          </Space>
          <Popconfirm
            title="Delete this reply?"
            onConfirm={() => handleDeleteClick(reply.reviewId)}
          >
            <Button type="primary" danger shape="round" size="small">
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>
        </Space>
        <Text>{reply.comment}</Text>
        {reply.replies && reply.replies.length > 0 && (
          <div className="pl-8">
            {reply.replies.map((nestedReply) =>
              renderReplyWithDelete(nestedReply, level + 1)
            )}
          </div>
        )}
      </Space>
    </div>
  );

  const columns: ColumnsType<Review> = [
    {
      title: 'Author',
      dataIndex: 'userFullName',
      key: 'userFullName',
      render: (text, record) => (
        <Space>
          <Avatar src={record.userAvatar || '/default-avatar.png'} />
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: true,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <Tooltip title={comment.length > 50 ? comment : ''}>
          <span>
            {comment.length > 50 ? `${comment.slice(0, 50)}...` : comment}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
      sorter: true,
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
              <DeleteOutlined /> Delete
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
              Review Management
            </Button>
          </Col>
        </Row>

        <div className="flex">
          <div className="w-1/5 pr-4">
            <h2 className="text-xl font-semibold mb-2">Dish List</h2>
            <ul className="space-y-2">
              <li
                className={`p-2 border rounded cursor-pointer ${!selectedDish ? 'bg-blue-100' : ''
                  }`}
                onClick={() => {
                  setSelectedDish(null);
                  fetchReviews('');
                }}
              >
                <h3 className="font-semibold text-base">All Dishes</h3>
              </li>
              {dishes.map((dish) => (
                <li
                  key={dish.dishId}
                  className={`p-2 border rounded cursor-pointer ${selectedDish?.dishId === dish.dishId ? 'bg-blue-100' : ''
                    }`}
                  onClick={() => handleDishClick(dish)}
                >
                  <h3 className="font-semibold text-base">{dish.name}</h3>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-4/5 pl-4">
            <h2 className="text-xl font-semibold mb-2">
              {selectedDish
                ? `Reviews for ${selectedDish.name}`
                : 'All Reviews'}
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
                showTotal: (total) => `Total ${total} items`,
                position: ['bottomRight'],
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="pl-8">
                    {record.replies.map((reply) =>
                      renderReplyWithDelete(reply)
                    )}
                  </div>
                ),
                rowExpandable: (record) =>
                  record.replies && record.replies.length > 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
