import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Popconfirm,
  notification,
  Modal,
  Typography,
  Image,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import BlogNew from './BlogNew';
import BlogEdit from './BlogEdit';

const { Title, Paragraph } = Typography;

interface BlogPost {
  id: string;
  title: string;
  image: string;
  category: string;
  author: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
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
    description:
      'Tổng hợp những xu hướng công nghệ nổi bật nhất trong năm 2024',
    seoTitle: 'Top 10 xu hướng công nghệ nổi bật 2024 | TechBlog',
    seoDescription:
      'Khám phá 10 xu hướng công nghệ đang định hình tương lai trong năm 2024.',
  },
  {
    id: '2',
    title: 'Hướng dẫn lập trình React từ cơ bản đến nâng cao',
    image: '/images/react-tutorial.jpg',
    category: 'Lập Trình',
    author: 'Trần Thị B',
    status: 'DRAFT',
    createdAt: '2024-03-19',
    description:
      'Hướng dẫn chi tiết cách lập trình React từ cơ bản đến nâng cao',
    seoTitle: 'Hướng dẫn lập trình React từ cơ bản đến nâng cao | TechBlog',
    seoDescription:
      'Học cách lập trình React từ cơ bản đến nâng cao. Bài viết cung cấp các ví dụ và hướng dẫn chi tiết.',
  },
  {
    id: '3',
    title: 'Review MacBook Pro M3 2024',
    image: '/images/macbook-review.jpg',
    category: 'Đánh giá',
    author: 'Lê Văn C',
    status: 'PUBLISHED',
    createdAt: '2024-03-18',
    description: 'Đánh giá chi tiết về MacBook Pro M3 2024',
    seoTitle: 'Review MacBook Pro M3 2024 | TechBlog',
    seoDescription:
      'Đánh giá chi tiết về MacBook Pro M3 2024. Đánh giá về thiết kế, hiệu suất và các tính năng mới nhất.',
  },
  {
    id: '4',
    title: 'Tương lai của AI trong năm 2024',
    image: '/images/ai-future.jpg',
    category: 'Công Nghệ',
    author: 'Phạm Thị D',
    status: 'ARCHIVED',
    createdAt: '2024-03-17',
    description:
      '<p>Nội dung chi tiết về tương lai của AI trong năm 2024...</p',
    seoTitle: 'Tương lai của AI trong năm 2024 | TechBlog',
    seoDescription:
      'Khám phá tương lai của AI trong năm 2024 và ảnh hưởng đến các ngành công nghệ.',
  },
];

const Blog: React.FC = () => {
  const [dataSource, setDataSource] = useState<BlogPost[]>([]);
  const [showBlogNew, setShowBlogNew] = useState(false);
  const [showBlogEdit, setShowBlogEdit] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [current, pageSize]);

  const fetchBlog = () => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(fakeData);
      setTotal(fakeData.length);
      setLoading(false);
    }, 500);
  };

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

  const handleAddSuccess = () => {
    fetchBlog();
    setShowBlogNew(false);
  };

  const handleEditClick = (record: BlogPost) => {
    setCurrentBlog(record);
    setShowBlogEdit(true);
  };

  const handleViewClick = (record: BlogPost) => {
    setCurrentBlog(record);
    setViewModalVisible(true);
  };

  const handleDeleteClick = (id: string) => {
    const updatedData = dataSource.filter((item) => item.id !== id);
    setDataSource(updatedData);
    setTotal(updatedData.length);
    notification.success({
      message: 'Xóa bài viết thành công!',
      duration: 2,
    });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image: string) => (
        <Image
          src={image}
          alt="Blog thumbnail"
          style={{
            width: 100,
            height: 60,
            objectFit: 'cover',
            borderRadius: '8px',
          }}
          preview={false}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: BlogPost) => (
        <Space>
          <Button
            type="default"
            shape="round"
            icon={<EyeOutlined />}
            onClick={() => handleViewClick(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDeleteClick(record.id)}
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
    <div className="layout-content">
      <Card
        title="Quản Lý Bài Viết"
        extra={
          !showBlogNew &&
          !showBlogEdit && (
            <Button
              type="primary"
              onClick={() => setShowBlogNew(true)}
              shape="round"
              icon={<PlusOutlined />}
            >
              Thêm Bài Viết
            </Button>
          )
        }
      >
        {showBlogNew ? (
          <BlogNew
            onAddSuccess={handleAddSuccess}
            setShowBlogNew={setShowBlogNew}
          />
        ) : showBlogEdit && currentBlog ? (
          <BlogEdit
            currentBlog={currentBlog}
            onEditSuccess={() => {
              fetchBlog();
              setShowBlogEdit(false);
            }}
            setShowBlogEdit={setShowBlogEdit}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              current,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
              onChange: (page, size) => {
                setCurrent(page);
                setPageSize(size);
              },
            }}
          />
        )}
      </Card>

      <Modal
        open={viewModalVisible}
        title={<Title level={4}>Chi tiết bài viết</Title>}
        onCancel={() => {
          setViewModalVisible(false);
          setCurrentBlog(null);
        }}
        width={1000}
        footer={null}
      >
        {currentBlog && (
          <div className="blog-view-content">
            <div className="mb-6">
              <Title level={3}>{currentBlog.title}</Title>
              <div className="flex items-center gap-4 text-gray-500 mb-4">
                <span>
                  {moment(currentBlog.createdAt).format('DD/MM/YYYY HH:mm')}
                </span>
                <span>•</span>
                <span>{currentBlog.author}</span>
                <span>•</span>
                <Tag color="blue">{currentBlog.category}</Tag>
                <Tag color={getStatusColor(currentBlog.status)}>
                  {getStatusText(currentBlog.status)}
                </Tag>
              </div>
            </div>

            <div className="mb-6">
              <Image
                src={currentBlog.image}
                alt={currentBlog.title}
                className="rounded-lg w-full object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>

            <div className="mb-6">
              <Title level={5}>Mô tả</Title>
              <div
                dangerouslySetInnerHTML={{ __html: currentBlog.description }}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5}>Thông tin SEO</Title>
              <Descriptions column={1}>
                <Descriptions.Item label="SEO Title">
                  {currentBlog.seoTitle}
                </Descriptions.Item>
                <Descriptions.Item label="SEO Description">
                  {currentBlog.seoDescription}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Blog;
