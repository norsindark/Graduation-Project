import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { callGetReviewByUserId } from '../../../../services/clientApi';
import { RootState } from '../../../../redux/store';
import { notification, Pagination } from 'antd';
import Loading from '../../../../components/Loading/Loading';
import { Link } from 'react-router-dom';

interface ReviewAccountProps {
  onClose: () => void;
}

const ReviewAccount: React.FC<ReviewAccountProps> = ({ onClose }) => {
  const [reviews, setReviews] = useState<any[]>([]);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  const userId = useSelector((state: RootState) => state.account?.user?.id);

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchReviews();
  }, [current, pageSize, userId]);

  const fetchReviews = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const query = `pageNo=${current - 1}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;
      const response = await callGetReviewByUserId(userId || '', query);
      if (response?.status === 200) {
        setReviews(response.data._embedded.reviewResponseList);
        setTotal(response.data.page.totalElements);
      } else {
        setReviews([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}`}
        ></i>
      );
    }
    return stars;
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrent(page);
  };

  const createSlug = (dishName: string): string => {
    return dishName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
      .replace(/[đĐ]/g, 'd') // Thay thế đ/Đ thành d
      .replace(/[^a-z0-9\s-]/g, '') // Chỉ giữ lại chữ thường, số và dấu gạch ngang
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, '-') // Xóa các dấu gạch ngang liên tiếp
      .trim(); // Xóa khoảng trắng đầu/cuối
  };

  const handleProductClick = () => {
    onClose();
    setTimeout(() => {
      window.scrollTo({
        top: 300,
        behavior: 'smooth',
      });
    }, 100);
  };

  return (
    <div className="tab-pane fade" id="v-pills-messages" role="tabpanel">
      <div className="fp_dashboard_body dashboard_review">
        <h3>Your reviews</h3>
        {loading ? (
          <Loading />
        ) : (
          <div className="fp__review_area">
            <div className="fp__comment pt-0 mt_20">
              {reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="fp__single_comment m-0 border-0"
                >
                  <img
                    src={review.userAvatar || 'images/comment_img_2.jpg'}
                    alt="review"
                    className="img-fluid"
                  />
                  <div className="fp__single_comm_text">
                    <h3>
                      <a href="#">{review.userFullName}</a>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </h3>
                    <span className="rating">
                      {renderStars(review.rating)}
                      <b>({review.rating})</b>
                    </span>
                    <p>{review.comment}</p>
                    <p className="text-muted">
                      Dish:{' '}
                      <Link
                        to={`/product-detail/${createSlug(review.dishName)}`}
                        className="text-primary hover:underline"
                        onClick={handleProductClick}
                      >
                        {review.dishName}
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {reviews.length > 0 && (
              <div className="absolute left-[55%] transform z-1000 bg-white p-2 mt-2">
                <Pagination
                  align="center"
                  current={current}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAccount;
