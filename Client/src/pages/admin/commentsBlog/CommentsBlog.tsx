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
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
import {
  callDeleteCommentBlog,
  callGetAllCommentBlog,
} from '../../../services/serverApi';
import { callGetCommentBlogById } from '../../../services/serverApi';
const { Text } = Typography;

interface Comment {
  commentId: string;
  content: string;
  author: string;
  avatar: string | null;
  blogId: string;
  blogTitle: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  commentId: string;
  content: string;
  author: string;
  avatar: string | null;
  createdAt: string;
}

interface Blog {
  blogId: string;
  title: string;
}

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

  const fetchComments = async (blogId: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (blogId) {
        response = await callGetCommentBlogById(blogId);
      } else {
        const query = `pageNo=${current - 1}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;
        response = await callGetAllCommentBlog(query);
      }

      if (response?.data?._embedded?.commentResponseList) {
        const commentsList = response.data._embedded.commentResponseList;
        setComments(commentsList);
        setTotal(response.data.page.totalElements);
        if (blogs.length === 0) {
          const uniqueBlogs = Array.from(
            new Set(
              commentsList.map((comment: Comment) =>
                JSON.stringify({
                  blogId: comment.blogId,
                  title: comment.blogTitle,
                })
              )
            )
          )
            .map((str: unknown) => {
              if (typeof str === 'string') {
                return JSON.parse(str) as Blog;
              }
              return null;
            })
            .filter((item): item is Blog => item !== null);

          setBlogs(uniqueBlogs);
        }
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

  const handleDeleteClick = async (commentId: string) => {
    try {
      const res = await callDeleteCommentBlog(commentId);
      if (res?.status === 200) {
        notification.success({
          message: 'Comment deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchComments(selectedBlog?.blogId || '');
      } else {
        notification.error({
          message: 'Error deleting comment.',
          description: 'Please delete all replies before deleting the comment!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting comment.',
        description: 'Failed to delete comment',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const renderReplyWithDelete = (reply: Reply) => (
    <div key={reply.commentId} className="border-l-2 border-gray-200 pl-4 mb-4">
      <Space direction="vertical" size="small" className="w-full">
        <Space className="w-full justify-between">
          <Space>
            <Avatar
              src={
                reply.avatar ||
                '../../../../../../public/images/comment_img_2.jpg'
              }
            />
            <Text strong>{reply.author}</Text>
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
      </Space>
    </div>
  );

  const onChange = (pagination: any, filters: any, sorter: any) => {
    const newCurrent = pagination.current;
    const newPageSize = pagination.pageSize;

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

  const columns: ColumnsType<Comment> = [
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.avatar || '../../../../public/images/comment_img_2.jpg'}
          />
          <Text strong>{text}</Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Comment',
      dataIndex: 'content',
      key: 'content',
      render: (content) => (
        <Tooltip title={content.length > 50 ? content : ''}>
          <span>
            {content.length > 50 ? `${content.slice(0, 50)}...` : content}
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
                className={`p-2 border rounded cursor-pointer ${!selectedBlog ? 'bg-blue-100' : ''
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
                  className={`p-2 border rounded cursor-pointer ${selectedBlog?.blogId === blog.blogId ? 'bg-blue-100' : ''
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
              onChange={onChange}
              pagination={{
                current: current,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                showTotal: (total) => `Total ${total} items`,
                position: ['bottomRight'],
              }}
              expandable={{
                expandedRowRender: (record: Comment) => (
                  <div className="pl-8">
                    {record.replies.map((reply) =>
                      renderReplyWithDelete(reply)
                    )}
                  </div>
                ),
                rowExpandable: (record: Comment) =>
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
