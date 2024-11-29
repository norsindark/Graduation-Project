import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { callGet20HightestReview } from '../../../services/clientApi';
import { notification } from 'antd';

interface Review {
  reviewId: string;
  rating: number;
  comment: string;
  dishId: string;
  dishName: string;
  userId: string;
  userFullName: string;
  userAvatar: string;
  replies: Review[];
  createdAt: string;
}

const FAKE_REVIEWS: Review[] = [
  {
    reviewId: '1',
    rating: 5,
    comment: 'The food is delicious, the service is attentive',
    dishId: '1',
    dishName: 'Beef pho',
    userId: '1',
    userFullName: 'John Doe',
    userAvatar: '../../../../public/images/comment_img_1.png',
    replies: [],
    createdAt: new Date().toISOString(),
  },
  {
    reviewId: '2',
    rating: 4.5,
    comment: 'The space is beautiful, the food is delicious',
    dishId: '2',
    dishName: 'Com tam',
    userId: '2',
    userFullName: 'Tran Thi B',
    userAvatar: '../../../../public/images/comment_img_2.jpg',
    replies: [],
    createdAt: new Date().toISOString(),
  },
  {
    reviewId: '3',
    rating: 5,
    comment: 'I will come back to support the restaurant',
    dishId: '3',
    dishName: 'Bun bo',
    userId: '3',
    userFullName: 'Le Van C',
    userAvatar: '../../../../public/images/comment_img_2.jpg',
    replies: [],
    createdAt: new Date().toISOString(),
  },
];

function FeedBack() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await callGet20HightestReview();
      setReviews(
        Array.isArray(response.data) && response.data.length > 0
          ? response.data
          : FAKE_REVIEWS
      );
    } catch (error) {
      setReviews(FAKE_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="fp__testimonial pt_95 xs_pt_66 mb_150 xs_mb_120">
      <div className="container">
        <div className="row wow fadeInUp" data-wow-duration="1s">
          <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
            <div className="fp__section_heading mb_40">
              <h4>Review</h4>
              <h2>Feedback from customers</h2>
              <span>
                <img
                  src="images/heading_shapes.png"
                  alt="shapes"
                  className="img-fluid w-100"
                />
              </span>
            </div>
          </div>
        </div>

        <div className="row testi_slider">
          <Slider {...settings}>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="col-xl-4 wow fadeInUp"
                  data-wow-duration="1s"
                >
                  <div className="fp__single_testimonial">
                    <div className="fp__testimonial_header d-flex flex-wrap align-items-center">
                      <div className="img">
                        <img
                          src={review.userAvatar}
                          alt={review.userFullName}
                          className="img-fluid w-100"
                        />
                      </div>
                      <div className="text">
                        <h4>{review.userFullName}</h4>
                        <p>{review.dishName}</p>
                      </div>
                    </div>
                    <div className="fp__single_testimonial_body">
                      <p className="feedback">{review.comment}</p>
                      <span className="rating">
                        {renderStars(review.rating)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No reviews yet</div>
            )}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default FeedBack;
