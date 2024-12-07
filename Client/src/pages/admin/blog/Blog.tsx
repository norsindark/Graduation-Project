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
  Divider,
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
import {
  callDeleteBlog,
  callGetAllBlog,
  callGetBlogById,
} from '../../../services/serverApi';

const { Title, Paragraph } = Typography;
const { Text } = Typography;

interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  author: string;
  thumbnail: string | null;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  totalComments: number;
  categoryBlogName: string;
  categoryBlogId: string;
  createdAt: string;
  updatedAt: string;
}

const Blog: React.FC = () => {
  const [dataSource, setDataSource] = useState<BlogPost[]>([]);
  const [showBlogNew, setShowBlogNew] = useState(false);
  const [showBlogEdit, setShowBlogEdit] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortQuery, setSortQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [current, pageSize]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&${sortQuery}`;
      } else {
        query += `&sortBy=createdAt&sortDir=desc`;
      }

      const response = await callGetAllBlog(query);
      if (response?.status === 200) {
        const { blogResponseList } = response.data._embedded;
        const { totalElements, number } = response.data.page;

        setDataSource(blogResponseList);
        setTotal(totalElements);
        setCurrent(number + 1);
      } else {
        setDataSource([]);
        setTotal(0);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Please try again later',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
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
        return 'Published';
      case 'DRAFT':
        return 'Draft';
      case 'ARCHIVED':
        return 'Archived';
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

  const handleViewClick = async (record: BlogPost) => {
    try {
      const response = await callGetBlogById(record.id);
      if (response?.status === 200) {
        setCurrentBlog(response.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Cannot load blog details',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      setLoading(true);
      const res = await callDeleteBlog(id);
      if (res?.status === 200) {
        notification.success({
          message: 'Category deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchBlog();
      } else {
        notification.error({
          message: 'Error deleting category',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting category.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
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

  const columns = [
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 120,
      render: (thumbnail: string) => (
        <Image
          src={thumbnail || '../../../../public/images/default-blog-thumb.png'}
          alt="Blog thumbnail"
          style={{
            width: 100,
            height: 60,
            objectFit: 'cover',
            borderRadius: '8px',
          }}
          fallback="../../../../public/images/default-blog-thumb.png"
          preview={false}
        />
      ),
    },
    {
      title: 'Title',
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
      sorter: (a: BlogPost, b: BlogPost) => a.title.localeCompare(b.title),
    },
    {
      title: 'Category',
      dataIndex: 'categoryBlogName',
      key: 'categoryBlogName',
      sorter: (a: BlogPost, b: BlogPost) =>
        a.categoryBlogName.localeCompare(b.categoryBlogName),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a: BlogPost, b: BlogPost) => a.author.localeCompare(b.author),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="text-base">
          {getStatusText(status)}
        </Tag>
      ),
      sorter: (a: BlogPost, b: BlogPost) => a.status.localeCompare(b.status),
    },
    {
      title: 'Comments',
      dataIndex: 'totalComments',
      key: 'totalComments',
      render: (total: number) => <Tag color="blue">{total}</Tag>,
      sorter: (a: BlogPost, b: BlogPost) => a.totalComments - b.totalComments,
    },

    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: BlogPost) => (
        <Space size="small">
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
            title="Are you sure you want to delete this blog?"
            onConfirm={() => handleDeleteClick(record.id)}
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

  console.log('currentBlog', currentBlog);
  return (
    <div className="layout-content">
      <Card
        title="Blog Management"
        extra={
          !showBlogNew &&
          !showBlogEdit && (
            <Button
              type="primary"
              onClick={() => setShowBlogNew(true)}
              shape="round"
              icon={<PlusOutlined />}
            >
              Create New Blog
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
            bordered
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
      <Modal
        open={viewModalVisible}
        centered
        title={
          <div className="text-center">
            <Title level={4} className="text-gray-800">
              📄 Blog Details
            </Title>
          </div>
        }
        onCancel={() => {
          setViewModalVisible(false);
          setCurrentBlog(null);
        }}
        width={1000}
        footer={null}
        className="custom-modal"
      >
        {currentBlog && (
          <div className="blog-view-content p-6 bg-white rounded-lg shadow-lg">
            <div className="space-y-4 mb-6 border-b pb-4">
              <Title level={3} className="text-gray-900">
                {currentBlog.title}
              </Title>
              <Space size={[0, 8]} wrap>
                <Text type="secondary">
                  🕒 {moment(currentBlog.createdAt).format('DD/MM/YYYY HH:mm')}
                </Text>
                <Divider type="vertical" />
                <Text type="secondary">✍️ {currentBlog.author}</Text>
                <Divider type="vertical" />
                <Tag color="blue">{currentBlog.categoryBlogName}</Tag>
                <Tag color={getStatusColor(currentBlog.status)}>
                  {getStatusText(currentBlog.status)}
                </Tag>
                <Tag color="orange">
                  💬 {currentBlog.totalComments} comments
                </Tag>
              </Space>
            </div>

            {currentBlog.thumbnail && (
              <div className="mb-6">
                <Image
                  src={currentBlog.thumbnail}
                  alt={currentBlog.title}
                  className="rounded-lg shadow-md w-full"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  fallback="/default-blog-image.jpg"
                />
              </div>
            )}

            <div className="mb-6">
              <Title level={5} className="text-gray-800">
                📖 Content
              </Title>
              <div
                className="blog-content text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentBlog.content }}
              />
            </div>

            <div className="mb-6">
              <Title level={5} className="text-gray-800">
                🏷️ Tags
              </Title>
              <div className="flex flex-wrap gap-2">
                {currentBlog.tags.split(',').map((tag) => (
                  <Tag key={tag.trim()} className="bg-gray-100 text-gray-600">
                    {tag.trim()}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
              <Title level={5} className="text-gray-800">
                🌟 SEO Information
              </Title>
              <Descriptions column={1}>
                <Descriptions.Item label="SEO Title">
                  {currentBlog.seoTitle}
                </Descriptions.Item>
                <Descriptions.Item label="SEO Description">
                  {currentBlog.seoDescription}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Created Date">
                  {moment(currentBlog.createdAt).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {moment(currentBlog.updatedAt).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="ID Blog">
                  {currentBlog.id}
                </Descriptions.Item>
                <Descriptions.Item label="Category Name">
                  {currentBlog.categoryBlogName}
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
