import React, { useEffect, useState } from 'react';
import { notification, Pagination, Popconfirm } from 'antd';
import {
  callWishListById,
  callDeleteWishList,
} from '../../../../services/clientApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../../components/Loading/Loading';

interface WishListDish {
  dishId: string;
  dishName: string;
  slug: string;
  description: string;
  status: string;
  thumbImage: string;
  offerPrice: number;
  price: number;
  rating: number;
  ratingCount: number;
}

interface WishListItem {
  wishlistId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  dishes: WishListDish[];
}

const WishListAccount = ({ onClose }: { onClose: () => void }) => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedWishListItem, setSelectedWishListItem] =
    useState<WishListDish | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [listWishListItem, setListWishListItem] = useState<WishListItem[]>([]);

  const [loading, setLoading] = useState(false);

  const userId = useSelector((state: RootState) => state.account?.user?.id);

  const navigate = useNavigate();

  const handleProductClick = (slug: string) => {
    handleGoBack();
    onClose();
    setTimeout(() => {
      window.scrollTo({
        top: 300,
        behavior: 'smooth',
      });
    }, 100);
    navigate(`/product-detail/${slug}`);
  };

  const handleViewInvoice = (dish: WishListDish) => {
    setSelectedWishListItem(dish);
    setIsInvoiceModalOpen(true);
  };

  const handleGoBack = () => {
    setIsInvoiceModalOpen(false);
    setSelectedWishListItem(null);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrent(page);
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchItems();
  }, [current, pageSize, userId]);

  const fetchItems = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;
      const response = await callWishListById(userId || '', query);
      if (response?.status === 200) {
        if (
          response?.data?._embedded?.wishlistResponseList &&
          Array.isArray(response.data._embedded.wishlistResponseList)
        ) {
          setListWishListItem(response.data._embedded.wishlistResponseList);
          setTotal(response.data.page.totalElements);
        } else {
          setListWishListItem([]);
          setTotal(0);
        }
      }
    } catch {
      notification.error({
        message: 'Failed to load favorites list',
        description: 'Error loading data!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (dishId: string) => {
    if (!userId) {
      notification.error({
        message: 'Cannot delete product',
        description: 'Please log in to continue!',
        duration: 5,
        showProgress: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await callDeleteWishList(dishId, userId);

      if (response.status === 200) {
        notification.success({
          message: 'Deleted successfully',
          description: 'Product has been removed from favorites list.',
          duration: 5,
          showProgress: true,
        });
        fetchItems(); // Làm mới danh sách yêu thích sau khi xóa
      } else {
        notification.error({
          message: 'Cannot delete product',
          description:
            response.data.errors?.error || 'Error while deleting product!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Cannot delete product',
        description: 'Error while deleting product!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="tab-pane fade"
        id="v-pills-messages2"
        role="tabpanel"
        aria-labelledby="v-pills-messages-tab2"
      >
        <div className="fp_dashboard_body">
          <h3>Favorites list</h3>
          {loading ? (
            <Loading />
          ) : (
            <div className="fp__dashboard_wishlist">
              <div className="row">
                {listWishListItem.flatMap((item) =>
                  item.dishes.map((dish) => (
                    <div
                      className="col-xl-4 col-sm-6 col-lg-6"
                      key={dish.dishId}
                    >
                      <div className="fp__menu_item ">
                        <div className="fp__menu_item_img">
                          <img
                            src={dish.thumbImage}
                            alt={dish.dishName}
                            className="img-fluid w-100"
                          />
                          <a className="category" href="#">
                            {dish.slug}
                          </a>
                        </div>
                        <div className="fp__menu_item_text">
                          <p className="rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={
                                  i < Math.round(dish.rating)
                                    ? 'fas fa-star'
                                    : 'far fa-star'
                                }
                              ></i>
                            ))}
                            <span>
                              {' '}
                              {Math.round(dish.rating * 10) / 10 || 0}
                            </span>
                          </p>
                          <a
                            className="title truncate block whitespace-nowrap overflow-hidden"
                            href={`/product-detail/${dish.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleProductClick(dish.slug);
                            }}
                          >
                            {dish.dishName}
                          </a>
                          <h5 className="price">
                            ${dish.offerPrice.toFixed(2)}{' '}
                            <del>${dish.price.toFixed(2)}</del>
                          </h5>
                          <ul className="d-flex flex-wrap justify-content-center">
                            <li>
                              <a href="#">
                                <i className="far fa-eye"></i>
                              </a>
                            </li>
                            <li>
                              <Popconfirm
                                title="Are you sure you want to delete this product?"
                                onConfirm={() => handleDeleteClick(dish.dishId)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <a href="#">
                                  <i className="fal fa-trash"></i>
                                </a>
                              </Popconfirm>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {listWishListItem.length > 0 && (
                <div className="absolute left-[55%] transform z-1000 bg-white p-2 mt-4">
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
    </>
  );
};

export default WishListAccount;
