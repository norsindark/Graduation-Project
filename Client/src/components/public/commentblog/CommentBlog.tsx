import { Form, Input, Button, Modal, notification } from 'antd';
import { useCallback } from 'react';
import {
  callAddReplyComment,
  callGetAllComment,
  callUpdateComment,
} from '../../../services/clientApi';
import { useState, useEffect } from 'react';
import { formatDateEnUS } from '../../../utils/formatDateEn-US';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
interface Comment {
  commentId: string;
  content: string;
  userId: string;
  author: string;
  avatar: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentBlogProps {
  blogData: {
    id: string;
    totalComments: number;
  };
  userId?: string;
  fetchBlogDetail: () => void;
}

export default function CommentBlog({
  blogData,
  userId,
  fetchBlogDetail,
}: CommentBlogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const COMMENTS_PER_PAGE = 3;
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [currentReplyTo, setCurrentReplyTo] = useState<string | null>(null);
  const [replyForm] = Form.useForm();
  const [hasMore, setHasMore] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = useCallback(async () => {
    if (blogData?.id) {
      setLoading(true);
      try {
        let query = `pageNo=0&pageSize=100&sortBy=createdAt&sortDir=desc`;
        const response = await callGetAllComment(blogData.id, query);

        const allComments = response.data._embedded.commentResponseList;
        const totalElements = response.data.page.totalElements;

        setComments(allComments);
        setTotalComments(totalElements);
        setHasMore(totalElements > COMMENTS_PER_PAGE);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }, [blogData?.id]);

  const userEmail = useSelector(
    (state: RootState) => state.account.user?.email
  );

  useEffect(() => {
    if (isExpanded) {
      fetchComments();
      setVisibleComments(COMMENTS_PER_PAGE);
    }
  }, [blogData?.id, isExpanded]);

  const handleLoadMore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingMore(true);
    try {
      setVisibleComments((prev) => prev + COMMENTS_PER_PAGE);
      setHasMore(visibleComments + COMMENTS_PER_PAGE < comments.length);
    } finally {
      setTimeout(() => {
        setLoadingMore(false);
      }, 500);
    }
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(false);
    setVisibleComments(COMMENTS_PER_PAGE);
  };

  const handleExpandAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(true);
    setVisibleComments(COMMENTS_PER_PAGE);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const showReplyModal = (commentId: string) => {
    setCurrentReplyTo(commentId);
    setReplyModalVisible(true);
  };

  const handleReply = async (values: { content: string }) => {
    if (!currentReplyTo || !userId) {
      notification.warning({
        message: 'Warning',
        description:
          'Missing required information to reply of Please login to reply',
        duration: 3,
        showProgress: true,
      });
      return;
    }

    try {
      const response = await callAddReplyComment(
        values.content,
        userId,
        currentReplyTo
      );

      if (response.status === 200) {
        notification.success({
          message: 'Success',
          duration: 3,
          showProgress: true,
        });
        setReplyModalVisible(false);
        replyForm.resetFields();

        setExpandedReplies((prev) => ({
          ...prev,
          [currentReplyTo]: true,
        }));

        fetchComments();
      } else {
        notification.error({
          message: 'Error',
          description: response.data.errors?.error || 'Failed to send reply',
          duration: 3,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to send reply',
        duration: 3,
        showProgress: true,
      });
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.commentId);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      const response = await callUpdateComment(
        commentId,
        editContent,
        userId || '',
        blogData.id
      );

      if (response.status === 200) {
        notification.success({
          message: 'Update success',
          duration: 3,
          showProgress: true,
        });
        setEditingCommentId(null);
        fetchComments();
      } else {
        notification.error({
          message: 'Error',
          description: response.data.errors?.error || 'Cannot update comment',
          duration: 3,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Cannot update comment',
        duration: 3,
        showProgress: true,
      });
    }
  };

  const renderReplies = (replies: Comment[], depth = 0, parentId: string) => {
    if (!expandedReplies[parentId]) return null;

    return replies.map((reply) => (
      <div key={reply.commentId} className="fp__single_comment replay">
        <img
          src={
            reply.avatar || '../../../../../../public/images/comment_img_2.jpg'
          }
          alt="review"
          className="image-thumbnailBlog"
        />
        <div className="fp__single_comm_text">
          <h3>
            {reply.author} <span>{formatDateEnUS(reply.createdAt)}</span>
          </h3>

          {editingCommentId === reply.commentId ? (
            // Edit mode cho replies
            <div className="edit-comment-section">
              <Input.TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                autoSize={{ minRows: 2 }}
                className="mb-2"
              />
              <div className="edit-actions">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleUpdateComment(reply.commentId)}
                  className="mr-2"
                  icon={<i className="fas fa-save"></i>}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  onClick={handleCancelEdit}
                  icon={<i className="fas fa-times"></i>}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // View mode cho replies
            <>
              <p>{reply.content}</p>
              {reply.replies && reply.replies.length > 0 && (
                <span
                  className="text-gray-500 text-sm cursor-pointer"
                  onClick={() => toggleReplies(reply.commentId)}
                >
                  {reply.replies.length} replies
                  <i
                    className={`fas fa-chevron-${
                      expandedReplies[reply.commentId] ? 'up' : 'down'
                    } ml-2`}
                  ></i>
                </span>
              )}
              <div className="comment-actions">
                {reply.author === userEmail && (
                  <Button
                    type="text"
                    className="text-blue-500 ml-2"
                    size="small"
                    icon={<i className="fas fa-edit"></i>}
                    onClick={() => handleStartEdit(reply)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </>
          )}
          {renderReplies(reply.replies || [], depth + 1, reply.commentId)}
        </div>
      </div>
    ));
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.commentId} className="fp__single_comment m-0 border-0">
      <img
        src={
          comment.avatar || '../../../../../../public/images/comment_img_2.jpg'
        }
        alt="review"
        className="image-thumbnailBlog"
      />
      <div className="fp__single_comm_text">
        <h3>
          {comment.author} <span>{formatDateEnUS(comment.createdAt)}</span>
        </h3>

        {editingCommentId === comment.commentId ? (
          // Edit mode
          <div className="edit-comment-section">
            <Input.TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              autoSize={{ minRows: 2 }}
              className="mb-2"
            />
            <div className="edit-actions">
              <Button
                type="primary"
                size="small"
                onClick={() => handleUpdateComment(comment.commentId)}
                className="mr-2"
                icon={<i className="fas fa-save"></i>}
              >
                Save
              </Button>
              <Button
                size="small"
                onClick={handleCancelEdit}
                icon={<i className="fas fa-times"></i>}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p>{comment.content}</p>
            {comment.replies && comment.replies.length > 0 && (
              <span
                className="text-gray-500 text-sm cursor-pointer"
                onClick={() => toggleReplies(comment.commentId)}
              >
                {comment.replies.length} replies
                <i
                  className={`fas fa-chevron-${expandedReplies[comment.commentId] ? 'up' : 'down'} ml-2`}
                ></i>
              </span>
            )}
            <div className="comment-actions">
              <Button
                type="text"
                className="text-blue-500 ml-2"
                size="small"
                icon={<i className="fas fa-reply"></i>}
                onClick={() => showReplyModal(comment.commentId)}
              >
                Reply
              </Button>
              {comment.author === userEmail && (
                <Button
                  type="text"
                  className="text-blue-500 ml-2"
                  size="small"
                  icon={<i className="fas fa-edit"></i>}
                  onClick={() => handleStartEdit(comment)}
                >
                  Edit
                </Button>
              )}
            </div>
          </>
        )}

        {renderReplies(comment.replies || [], 0, comment.commentId)}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="fp__comment mt_100 xs_mt_70 wow fadeInUp"
        data-wow-duration="1s"
      >
        <h4>{totalComments} Comments</h4>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          isExpanded && (
            <div className="comments-container">
              {comments
                .slice(0, visibleComments)
                .map((comment) => renderComment(comment))}

              {loadingMore && (
                <div className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-sm text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        <div className="mt-4 d-flex justify-content-center">
          {isExpanded ? (
            visibleComments < comments.length ? (
              <Button
                onClick={handleLoadMore}
                loading={loadingMore}
                disabled={loadingMore}
                type="primary"
                icon={<i className="fas fa-arrow-down"></i>}
                className="common_btn"
              >
                {loadingMore ? 'Loading...' : 'View more comments'}
              </Button>
            ) : (
              <Button
                onClick={handleCollapse}
                type="primary"
                icon={<i className="fas fa-arrow-up"></i>}
                className="common_btn"
              >
                Collapse comments
              </Button>
            )
          ) : (
            <Button
              onClick={handleExpandAll}
              loading={loading}
              disabled={loading}
              type="primary"
              icon={<i className="fas fa-comments"></i>}
              className="common_btn"
            >
              {loading ? 'Loading...' : `View all comments (${totalComments})`}
            </Button>
          )}
        </div>

        <Modal
          title="Reply to Comment"
          centered
          open={replyModalVisible}
          onCancel={() => setReplyModalVisible(false)}
          footer={null}
        >
          <Form form={replyForm} onFinish={handleReply} layout="vertical">
            <Form.Item
              className="font-medium"
              name="content"
              label="Your Reply"
              rules={[{ required: true, message: 'Please enter your reply' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<i className="fas fa-paper-plane"></i>}
              >
                Submit Reply
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
