import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Tooltip, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';

interface BlogPost {
  id: string;
  title: string;
  image: string;
  category: string;
  author: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
}

// Data mẫu
const fakeData: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 xu hướng công nghệ năm 2024',
    image: '/images/tech-trends.jpg',
    category: 'Công Nghệ',
    author: 'Nguyễn Văn A',
    status: 'PUBLISHED',
    createdAt: '2024-03-20',
  },
  {
    id: '2',
    title: 'Hướng dẫn lập trình React từ cơ bản đến nâng cao',
    image: '/images/react-tutorial.jpg',
    category: 'Lập Trình',
    author: 'Trần Thị B',
    status: 'DRAFT',
    createdAt: '2024-03-19',
  },
  {
    id: '3',
    title: 'Review MacBook Pro M3 2024',
    image: '/images/macbook-review.jpg',
    category: 'Đánh giá',
    author: 'Lê Văn C',
    status: 'PUBLISHED',
    createdAt: '2024-03-18',
  },
  {
    id: '4',
    title: 'Tương lai của AI trong năm 2024',
    image: '/images/ai-future.jpg',
    category: 'Công Nghệ',
    author: 'Phạm Thị D',
    status: 'ARCHIVED',
    createdAt: '2024-03-17',
  },
];

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'DRAFT':
        return 'Bản nháp';
      case 'ARCHIVED':
        return 'Đã lưu trữ';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: '15%',
      render: (image: string) => (
        <img
          src={image}
          alt="Blog thumbnail"
          style={{
            width: 100,
            height: 60,
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (title: string) => (
        <Tooltip title={title}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: '15%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      render: (_: any, record: BlogPost) => (
        <Space size="middle">
          <Tooltip title="Xem trước">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedPost(record);
                setIsPreviewVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => console.log('Edit:', record.id)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log('Delete:', record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Card
        title="Quản Lý Bài Viết"
        extra={
          <Button type="primary" icon={<PlusOutlined />} shape="round" O>
            Thêm Bài Viết
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={fakeData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} bài viết`,
          }}
        />
      </Card>

      <Modal
        title="Xem trước bài viết"
        visible={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPost && (
          <div>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              style={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            />
            <h2>{selectedPost.title}</h2>
            <p>
              <strong>Danh mục:</strong> {selectedPost.category}
            </p>
            <p>
              <strong>Tác giả:</strong> {selectedPost.author}
            </p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              <Tag color={getStatusColor(selectedPost.status)}>
                {getStatusText(selectedPost.status)}
              </Tag>
            </p>
            <p>
              <strong>Ngày tạo:</strong> {selectedPost.createdAt}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Blog;
