import React, { useEffect, useState } from 'react';
import {
  Table,
  Avatar,
  Space,
  Typography,
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

interface Comment {
  commentId: string;
  content: string;
  blogId: string;
  blogTitle: string;
  userId: string;
  userFullName: string;
  userAvatar: string | null;
  replies: Reply[];
  createdAt: string;
}

interface Reply {
  commentId: string;
  content: string;
  blogId: string;
  blogTitle: string;
  userFullName: string;
  userAvatar: string | null;
  replies: Reply[];
  createdAt: string;
}

interface Blog {
  blogId: string;
  title: string;
}

// Thêm data fake
const FAKE_COMMENTS: Comment[] = [
  {
    commentId: '1',
    content: 'Bài viết rất hay và bổ ích!',
    blogId: '1',
    blogTitle: 'Top 10 món ăn Việt Nam',
    userId: 'user1',
    userFullName: 'Nguyễn Văn A',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    createdAt: '2024-03-15T10:00:00',
    replies: [
      {
        commentId: '1-1',
        content: 'Cảm ơn bạn đã chia sẻ!',
        blogId: '1',
        blogTitle: 'Top 10 món ăn Việt Nam',
        userFullName: 'Trần Thị B',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        createdAt: '2024-03-15T10:30:00',
        replies: [],
      },
    ],
  },
  {
    commentId: '2',
    content: 'Tôi rất thích cách trình bày của bài viết này',
    blogId: '2',
    blogTitle: 'Cách nấu phở ngon',
    userId: 'user2',
    userFullName: 'Lê Thị C',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    createdAt: '2024-03-14T15:00:00',
    replies: [],
  },
  {
    commentId: '3',
    content: 'Bài viết rất chi tiết và dễ hiểu',
    blogId: '1',
    blogTitle: 'Top 10 món ăn Việt Nam',
    userId: 'user3',
    userFullName: 'Phạm Văn D',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    createdAt: '2024-03-13T09:00:00',
    replies: [],
  },
];

function CommentsBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortQuery, setSortQuery] = useState('');

  useEffect(() => {
    fetchComments(selectedBlog?.blogId || '');
  }, [current, pageSize, sortQuery, selectedBlog]);

  // Thay đổi hàm fetchComments để sử dụng data fake
  const fetchComments = async (blogId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Giả lập delay network
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredComments = [...FAKE_COMMENTS];

      // Lọc theo blog nếu có blogId
      if (blogId) {
        filteredComments = filteredComments.filter(
          (comment) => comment.blogId === blogId
        );
      }

      setComments(filteredComments);
      setTotal(filteredComments.length);

      // Tạo danh sách blogs duy nhất
      if (blogs.length === 0) {
        const uniqueBlogs = Array.from(
          new Set(
            FAKE_COMMENTS.map((comment) =>
              JSON.stringify({
                blogId: comment.blogId,
                title: comment.blogTitle,
              })
            )
          )
        ).map((str) => JSON.parse(str));
        setBlogs(uniqueBlogs);
      }
    } catch (error) {
      setError('Failed to fetch comments');
      notification.error({
        message: 'Error',
        description: 'Failed to fetch comments',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
    fetchComments(blog.blogId);
  };

  // Thay đổi hàm handleDeleteClick để sử dụng data fake
  const handleDeleteClick = async (commentId: string) => {
    try {
      // Giả lập delay network
      await new Promise((resolve) => setTimeout(resolve, 500));

      notification.success({
        message: 'Comment deleted successfully!',
        duration: 5,
      });

      // Cập nhật state để xóa comment
      setComments((prevComments) =>
        prevComments.filter((comment) => {
          // Xóa comment chính
          if (comment.commentId === commentId) return false;

          // Xóa reply nếu có
          comment.replies = comment.replies.filter(
            (reply) => reply.commentId !== commentId
          );
          return true;
        })
      );
    } catch (error) {
      notification.error({
        message: 'Error deleting comment.',
        description: 'Failed to delete comment',
        duration: 5,
      });
    }
  };

  const renderReplyWithDelete = (reply: Reply, level = 1) => (
    <div
      key={reply.commentId}
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
            onConfirm={() => handleDeleteClick(reply.commentId)}
          >
            <Button type="primary" danger shape="round" size="small">
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>
        </Space>
        <Text>{reply.content}</Text>
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

  const columns: ColumnsType<Comment> = [
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
      sorter: true,
    },
    {
      title: 'Comment',
      dataIndex: 'content',
      key: 'content',
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
      render: (_: any, record: Comment) => (
        <Space>
          <Popconfirm
            title="Delete this comment?"
            onConfirm={() => handleDeleteClick(record.commentId)}
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
              Comments Management
            </Button>
          </Col>
        </Row>

        <div className="flex">
          <div className="w-1/5 pr-4">
            <h2 className="text-xl font-semibold mb-2">Blog List</h2>
            <ul className="space-y-2">
              <li
                className={`p-2 border rounded cursor-pointer ${
                  !selectedBlog ? 'bg-blue-100' : ''
                }`}
                onClick={() => {
                  setSelectedBlog(null);
                  fetchComments('');
                }}
              >
                <h3 className="font-semibold text-base">All Blogs</h3>
              </li>
              {blogs.map((blog) => (
                <li
                  key={blog.blogId}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedBlog?.blogId === blog.blogId ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleBlogClick(blog)}
                >
                  <h3 className="font-semibold text-base">{blog.title}</h3>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-4/5 pl-4">
            <h2 className="text-xl font-semibold mb-2">
              {selectedBlog
                ? `Comments for ${selectedBlog.title}`
                : 'All Comments'}
            </h2>
            <Table
              columns={columns}
              dataSource={comments}
              rowKey="commentId"
              loading={loading}
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

export default CommentsBlog;
