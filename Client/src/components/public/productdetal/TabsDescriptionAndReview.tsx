import React, { useEffect, useState, useCallback } from 'react';
import {
  Form,
  Input,
  Rate,
  Button,
  notification,
  Pagination,
  Modal,
} from 'antd';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill from 'react-quill';
import {
  callCreateReview,
  callGetAllReviewForOneDish,
  callCreateReplyReview,
  callUpdateReview,
} from '../../../services/clientApi';
const { TextArea } = Input;
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Loading from '../../Loading/Loading';

interface DishDetail {
  longDescription: string;
  dishId: string | undefined;
  // ... other properties
}

interface Review {
  reviewId: string;
  rating: number;
  comment: string;
  dishId: string;
  userFullName: string;
  userAvatar: string;
  replies: Reply[];
  createdAt: string;
  userId: string;
}

interface Reply {
  reviewId: string;
  rating: number;
  comment: string;
  userFullName: string;
  userAvatar: string;
  replies: Reply[];
  createdAt: string;
}

function TabsDescriptionAndReview({
  dishDetail,
}: {
  dishDetail: DishDetail | null;
}) {
  const [form] = Form.useForm();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [listReview, setListReview] = useState<Review[]>([]);

  const user = useSelector((state: RootState) => state.account.user);

  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});

  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [currentReplyTo, setCurrentReplyTo] = useState<string | null>(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditTo, setCurrentEditTo] = useState<string | null>(null);

  const [replyForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState('description');
  const [tabLoading, setTabLoading] = useState(false);

  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);

  const toggleReplies = (reviewId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const onFinish = async (values: { rating: number; review: string }) => {
    const { rating, review } = values;

    setLoading(true);
    try {
      const response = await callCreateReview(
        rating,
        review,
        dishDetail?.dishId || '',
        user?.id || ''
      );

      if (response.status === 200) {
        notification.success({
          message: 'Review submitted successfully',
          duration: 5,
          showProgress: true,
        });
        fetchReviews();
        form.resetFields();
      } else if (response.status === 400) {
        notification.error({
          message: 'An error occurred while reviewing',
          description: response.data.errors?.error || 'Something went wrong',
          duration: 5,
          showProgress: true,
        });
      } else if (response.status === 403) {
        notification.error({
          message: 'An error occurred while reviewing',
          description: response.data.errors?.error || 'You need to login to review',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'An error occurred while reviewing',
        description: error.message || 'Something went wrong',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = useCallback(async () => {
    if (dishDetail?.dishId) {
      setLoading(true);
      try {
        let query = `pageNo=${current - 1}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;
        const response = await callGetAllReviewForOneDish(
          dishDetail.dishId,
          query
        );

        setListReview(response.data._embedded.reviewResponseList);
        setTotal(response.data.page.totalElements);
      } finally {
        setLoading(false);
      }
    }
  }, [current, pageSize, dishDetail?.dishId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const showReplyModal = (reviewId: string) => {
    setCurrentReplyTo(reviewId);
    setReplyModalVisible(true);
  };

  const showEditModal = (reviewId: string) => {
    const review = listReview.find((r) => r.reviewId === reviewId);
    if (review) {
      editForm.setFieldsValue({
        rating: review.rating,
        review: review.comment,
      });
    }
    setCurrentEditTo(reviewId);
    setEditModalVisible(true);
  };

  const handleReply = async (values: { review: string; rating: number }) => {
    if (!currentReplyTo || !dishDetail?.dishId || !user?.id) {
      notification.error({
        message: 'Error',
        description: 'Missing required information for reply',
        duration: 5,
        showProgress: true,
      });
      return;
    }

    try {
      const response = await callCreateReplyReview(
        currentReplyTo,
        values.review,
        values.rating,
        dishDetail.dishId,
        user.id
      );

      if (response.status === 200) {
        notification.success({
          message: 'Reply submitted successfully',
          duration: 5,
          showProgress: true,
        });
        setReplyModalVisible(false);
        replyForm.resetFields();

        setExpandedReplies((prev) => ({
          ...prev,
          [currentReplyTo]: true,
        }));
        fetchReviews();
      } else {
        notification.error({
          message: 'Error',
          description: response.data.errors?.error || 'Failed to submit reply',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to submit reply',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    if (pageSize) setPageSize(pageSize);
    setExpandedReplies({}); // Reset expanded replies when changing page
  };

  const renderReplies = (replies: Reply[], depth = 0, parentId: string) => {
    if (!expandedReplies[parentId]) return null;

    return replies.map((reply) => (
      <div
        key={reply.reviewId}
        className={`flex justify-between border-t border-gray-200 mt-6 pt-6`}
      >
        <img src={reply.userAvatar} alt="review" className="img-fluid" />
        <div className="fp__single_comm_text ml-4">
          <h3>
            {reply.userFullName}{' '}
            <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
          </h3>

          <p>{reply.comment}</p>
          {reply.replies && reply.replies.length > 0 && (
            <span
              className="text-gray-500 text-sm cursor-pointer"
              onClick={() => toggleReplies(reply.reviewId)}
            >
              {reply.replies.length} replies
              <i
                className={`fas fa-chevron-${expandedReplies[reply.reviewId] ? 'up' : 'down'} ml-2`}
              ></i>
            </span>
          )}
          {user?.role.name === 'ADMIN' && (
            <Button
              type="text"
              className="text-blue-500 ml-2"
              size="small"
              icon={<i className="fas fa-reply"></i>}
              onClick={() => showReplyModal(reply.reviewId)}
            >
              Reply
            </Button>
          )}
          {renderReplies(reply.replies || [], depth + 1, reply.reviewId)}
        </div>
      </div>
    ));
  };

  const handleTabChange = (tab: string) => {
    setTabLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setTabLoading(false);
    }, 500); // Simulating a short loading time
  };

  const handleEdit = async (values: { review: string; rating: number }) => {
    if (!currentEditTo || !dishDetail?.dishId || !user?.id) {
      notification.error({
        message: 'Error',
        description: 'Missing required information for edit',
        duration: 5,
        showProgress: true,
      });
      return;
    }

    setEditLoading(true);
    try {
      const response = await callUpdateReview(
        currentEditTo,
        values.review,
        values.rating,
        dishDetail.dishId,
        user.id
      );

      if (response.status === 200) {
        notification.success({
          message: 'Review updated successfully',
          duration: 5,
          showProgress: true,
        });
        setEditModalVisible(false);
        editForm.resetFields();
        fetchReviews();
      } else {
        throw new Error(
          response.data.errors?.error || 'Failed to update review'
        );
      }
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to update review',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const renderReviewActions = (review: Review) => {
    return (
      <>
        {user?.role.name == 'ADMIN' && (
          <Button
            type="text"
            className="text-blue-500 ml-2"
            size="small"
            icon={<i className="fas fa-reply"></i>}
            onClick={() => showReplyModal(review.reviewId)}
          >
            Reply
          </Button>
        )}
        {user && user.id === review.userId && (
          <Button
            type="text"
            className="text-blue-500 ml-2"
            size="small"
            icon={<i className="fas fa-edit"></i>}
            onClick={() => showEditModal(review.reviewId)}
          >
            Edit
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div className="fp__menu_description_area mt_100 xs_mt_70">
        <ul className="nav nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => handleTabChange('description')}
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Description
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => handleTabChange('reviews')}
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false"
            >
              Reviews
            </button>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          {tabLoading ? (
            <Loading />
          ) : (
            <>
              <div
                className={`tab-pane fade ${activeTab === 'description' ? 'show active' : ''}`}
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabIndex={0}
              >
                <div className="menu_det_description">
                  <ReactQuill
                    value={dishDetail?.longDescription || ''}
                    readOnly={true}
                    theme="bubble"
                    modules={{ toolbar: false }}
                  />
                </div>
              </div>
              <div
                className={`tab-pane fade ${activeTab === 'reviews' ? 'show active' : ''}`}
                id="pills-contact"
                role="tabpanel"
                aria-labelledby="pills-contact-tab"
                tabIndex={0}
              >
                <div className="fp__review_area">
                  <div className="row">
                    <div className="col-lg-8">
                      <h4>{total} reviews</h4>
                      <div className="fp__comment pt-0 mt_20">
                        {listReview.map((review) => (
                          <div
                            key={review.reviewId}
                            className="fp__single_comment m-0 border-0"
                          >
                            <img
                              src={review.userAvatar}
                              alt="review"
                              className="img-fluid"
                            />
                            <div className="fp__single_comm_text">
                              <h3>
                                {review.userFullName}{' '}
                                <span>
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </h3>
                              <span className="rating">
                                {[...Array(5)].map((_, index) => (
                                  <i
                                    key={index}
                                    className={`fas fa-star${index < review.rating ? '' : '-empty'}`}
                                  ></i>
                                ))}
                              </span>
                              <p>{review.comment}</p>
                              {review.replies && review.replies.length > 0 && (
                                <span
                                  className="text-gray-500 text-sm cursor-pointer"
                                  onClick={() => toggleReplies(review.reviewId)}
                                >
                                  {review.replies.length} replies
                                  <i
                                    className={`fas fa-chevron-${expandedReplies[review.reviewId] ? 'up' : 'down'} ml-2`}
                                  ></i>
                                </span>
                              )}
                              {renderReviewActions(review)}
                              {renderReplies(
                                review.replies || [],
                                0,
                                review.reviewId
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 d-flex justify-content-center">
                          <Pagination
                            current={current}
                            pageSize={pageSize}
                            total={total}
                            onChange={handlePageChange}
                            className="mt-4"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="fp__post_review">
                        <h4>write a Review</h4>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                          <Form.Item
                            name="rating"
                            label="Select your rating"
                            className="font-medium"
                            initialValue={rating}
                          >
                            <Rate
                              allowHalf
                              onChange={setRating}
                              defaultValue={5}
                            />
                          </Form.Item>
                          <Form.Item
                            name="review"
                            label="Review"
                            className="font-medium"
                            rules={[
                              {
                                required: true,
                                message: 'Please write your review!',
                              },
                            ]}
                          >
                            <TextArea
                              rows={3}
                              placeholder="Write your review"
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="common_btn"
                              icon={<i className="fas fa-paper-plane"></i>}
                            >
                              Submit Review
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        title="Reply to Review"
        centered
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        footer={null}
      >
        <Form form={replyForm} onFinish={handleReply} layout="vertical">
          <Form.Item
            className="font-medium"
            name="review"
            label="Your Reply"
            rules={[{ required: true, message: 'Please enter your reply' }]}
          >
            <TextArea rows={3} />
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

      <Modal
        title="Edit Review"
        centered
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit} layout="vertical">
          <Form.Item
            className="font-medium"
            name="review"
            label="Your Review"
            rules={[{ required: true, message: 'Please enter your review' }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<i className="fas fa-paper-plane"></i>}
              loading={editLoading}
            >
              Update Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TabsDescriptionAndReview;
