import React, { useEffect, useState } from 'react';
import { notification, Popconfirm } from 'antd';
import { callWishListById, callDeleteWishList } from '../../../../services/clientApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useNavigate } from 'react-router-dom';

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

const WishListAccount = () => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedWishListItem, setSelectedWishListItem] = useState<WishListDish | null>(null);
  
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [listWishListItem, setListWishListItem] = useState<WishListItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  
  const userId = useSelector((state: RootState) => state.account.user?.id);
  
  const navigate = useNavigate();

  const handleProductClick = (slug: string) => {
    handleGoBack();
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
    setCurrent(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(total / pageSize);
    
    let startPage = Math.max(1, current - 1);
    let endPage = Math.min(totalPages, startPage + 2); // Hiển thị 3 ô

    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${i === current ? 'active' : ''}`}>
          <a className="page-link" href="#" onClick={() => handlePageChange(i)} >
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    if (!userId) {
      notification.error({
        message: 'Failed to load favorites list',
        description: 'Please log in to continue!',
        duration: 5,
        showProgress: true,
      });
      return;
    }
    fetchItems();
  }, [current, pageSize, userId]);

  const fetchItems = async () => {
    setLoading(true);
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
      } else {
        notification.error({
          message: 'Failed to load favorites list',
          description: response.data.errors?.error || 'Error loading data!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Failed to load favorites list',
        description: 'Error loading data!',
        duration:  5,
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
      });
      return; // Ngừng thực hiện nếu userId là undefined
    }

    try {
      console.log("User ID:", userId);
      console.log("Dish ID:", dishId);

      const response = await callDeleteWishList( dishId, userId);

      if (response.status === 200) {
        notification.success({
          message: 'Deleted successfully',
          description: 'Product has been removed from favorites list.',
          duration: 5,
        });
        fetchItems(); // Làm mới danh sách yêu thích sau khi xóa
      } else {
        notification.error({
          message: 'Cannot delete product',
          description: response.data.errors?.error || 'Error while deleting product!',
          duration: 5,
        });
      }
    } catch {
      notification.error({
        message: 'Cannot delete product',
        description: 'Error while deleting product!',
        duration: 5,
      });
    }
  };

  return (
    <div className="tab-pane fade" id="v-pills-messages2" role="tabpanel" aria-labelledby="v-pills-messages-tab2">
      <div className="fp_dashboard_body">
        <h3>wishlist</h3>
        <div className="fp__dashboard_wishlist">
          <div className="row">
            {loading ? (
              <p>Loading...</p>
            ) : (
              listWishListItem.flatMap((item) =>
                item.dishes.map((dish) => (
                  <div className="col-xl-4 col-sm-6 col-lg-6" key={dish.dishId}>
                    <div className="fp__menu_item">
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
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={
                                index < Math.floor(dish.rating)
                                  ? "fas fa-star"
                                  : index < dish.rating
                                  ? "fas fa-star-half-alt"
                                  : "far fa-star"
                              }
                            ></i>
                          ))}
                          <span>{dish.ratingCount}</span>
                        </p>
                        <a className="title"
                           href={`/product-detail/${dish.slug}`}
                           onClick={(e) => {
                             e.preventDefault();
                             handleProductClick(dish.slug);
                           }}>
                          {dish.dishName}
                        </a>
                        <h5 className="price">
                          ${dish.offerPrice.toFixed(2)} <del>${dish.price.toFixed(2)}</del>
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
              )
            )}
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center m-4">
              {renderPageNumbers()}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default WishListAccount;