import { useState, useEffect } from 'react';
import {
  callGetAllCategory,
  callGetAllDishes,
  callWishList,
  callWishListById,
  callGetAllOffers,
} from '../../../services/clientApi';
import { notification, Pagination } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

interface Product {
  dishId: string;
  dishName: string;
  description: string;
  thumbImage: string;
  offerPrice: number;
  price: number;
  categoryName: string;
  rating: number;
  slug: string;
}

interface Category {
  name: string;
  status: string;
  subCategories: { name: string }[];
}

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

function MenuHome() {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('*');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [total, setTotal] = useState<number>(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOffers();
  }, [current, pageSize]);

  const fetchCategories = async () => {
    try {
      const response = await callGetAllCategory();
      const categoriesData = response.data._embedded.categoryResponseList;

      const activeCategories = categoriesData.filter(
        (category: Category) => category.status === 'ACTIVE'
      );

      if (activeCategories.length > 0) {
        setCategories(activeCategories);
        const formattedMenuItems = activeCategories.map(
          (category: Category) => ({
            title: category.name,
            items: [
              `All ${category.name}`,
              ...category.subCategories
                .filter((subCat: any) => subCat.status === 'ACTIVE')
                .map((subCategory: any) => subCategory.name),
            ],
          })
        );
        setMenuItems(formattedMenuItems);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    setShowDropdown(null);
    setCurrent(1);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = `pageNo=${current - 1}&pageSize=${pageSize}&sortBy=dishName&order=asc`;
      const response = await callGetAllDishes(query);

      if (
        response.status === 200 &&
        response.data._embedded?.dishResponseList
      ) {
        setProducts(response.data._embedded.dishResponseList);
        setTotal(response.data.page.totalElements);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading list dishes',
        description: 'Please try again later',
        showProgress: true,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await callGetAllOffers();
      const currentDate = new Date();

      const validOffers = response.data._embedded.offerResponseList.filter(
        (offer: any) => {
          const endDate = new Date(offer.endDate);
          return currentDate <= endDate;
        }
      );
      setOffers(validOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const getProductOffer = (dishId: string) => {
    return offers.find((offer) => offer.dish.dishId === dishId);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    if (pageSize) setPageSize(pageSize);
  };

  const filteredProducts = products.filter((product) => {
    if (activeFilter === '*') return true;

    const category = categories.find(
      (cat) =>
        cat.name === activeFilter.replace('All ', '') ||
        cat.subCategories.some((subCat) => subCat.name === activeFilter)
    );

    if (!category) return false;

    if (activeFilter.startsWith('All ')) {
      return (
        product.categoryName.toLowerCase() === category.name.toLowerCase() ||
        category.subCategories.some(
          (subCat) =>
            product.categoryName.toLowerCase() === subCat.name.toLowerCase()
        )
      );
    } else {
      return product.categoryName.toLowerCase() === activeFilter.toLowerCase();
    }
  });

  const handleProductClick = (slug: string) => {
    navigate(`/product-detail/${slug}`);
  };

  //WishList

  const userId = useSelector((state: RootState) => state.account.user?.id);
  const handleAddToWishlist = async (dishId: string) => {
    if (!userId) {
      notification.error({
        message: 'Not logged in',
        description: 'Please log in to add products to your favorites list.',
      });
      return;
    }

    try {
      const wishListResponse = await callWishListById(userId, '');

      const wishListItems =
        wishListResponse.data._embedded?.wishlistResponseList || [];

      const isInWishlist = wishListItems.some((item: any) =>
        item.dishes?.some((dish: WishListDish) => dish.dishId === dishId)
      );

      if (isInWishlist) {
        notification.warning({
          message: 'The product is already in the favorites list',
          description: 'You have added this product to your favorites list.',
          duration: 5,
          showProgress: true,
        });
        return;
      }

      const response = await callWishList(dishId, userId);
      if (response.status === 200) {
        notification.success({
          message: 'Add to favorites list',
          description:
            'The product has been successfully added to the favorites list.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error',
          description:
            'An error occurred while adding a product to your favorites list.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Please try again later.',
      });
    }
  };

  return (
    <section className="fp__menu mt_95 xs_mt_65">
      <div className="container">
        <div className="row wow fadeInUp" data-wow-duration="1s">
          <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
            <div className="fp__section_heading mb_45">
              <h4>food Menu</h4>
              <h2>Our Popular Delicious Foods</h2>
              <span>
                <img
                  src="images/heading_shapes.png"
                  alt="shapes"
                  className="img-fluid w-100"
                />
              </span>
              <p className="text-base">
                Objectively pontificate quality models before intuitive
                information. Dramatically recaptiualize multifunctional
                materials.
              </p>
            </div>
          </div>
        </div>

        <div className="row wow fadeInUp" data-wow-duration="1s">
          <div className="col-12">
            <div className="menu_filter d-flex flex-wrap justify-content-center ">
              <button
                className={activeFilter === '*' ? 'active' : ''}
                onClick={() => handleFilter('*')}
              >
                All menu
              </button>
              {menuItems.map((menu, index) => (
                <div className="relative" key={index}>
                  <button
                    className="flex items-center space-x-1 hover:bg-gray-100 text-xl font-medium rounded-md justify-center align-center"
                    onMouseEnter={() => setShowDropdown(index)}
                    onMouseLeave={() => setShowDropdown(null)}
                  >
                    {menu.title} <i className="far fa-angle-down ml-2"></i>
                  </button>
                  {showDropdown === index && (
                    <ul
                      className="absolute shadow-lg w-60 left-0 rounded-md focus:outline-none z-50"
                      onMouseEnter={() => setShowDropdown(index)}
                      onMouseLeave={() => setShowDropdown(null)}
                    >
                      {menu.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex}>
                          <button
                            onClick={() => handleFilter(item)}
                            className="block bg-white text-xl font-medium px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left transition-transform duration-200 ease-in-out transform hover:translate-x-1"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          {filteredProducts.map((product, index) => (
            <div
              className={`col-xl-3 col-sm-6 col-lg-4 wow fadeInUp ${
                index % 2 === 0
                  ? 'animate__animated animate__fadeInRight'
                  : 'animate__animated animate__fadeInLeft'
              }`}
              data-wow-duration="1s"
              key={product.dishId}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="fp__menu_item">
                <div className="fp__menu_item_img">
                  <img
                    src={product.thumbImage}
                    alt={product.dishName}
                    className="img-fluid w-100"
                  />
                  <a className="category" href="#">
                    {product.categoryName}
                  </a>
                </div>
                <div className="fp__menu_item_text">
                  <p className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={
                          i < Math.round(product.rating)
                            ? 'fas fa-star'
                            : 'far fa-star'
                        }
                      ></i>
                    ))}
                    <span> {Math.round(product.rating * 10) / 10 || 0}</span>
                  </p>
                  <a
                    className="title truncate block whitespace-nowrap overflow-hidden"
                    href={`/product-detail/${product.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(product.slug);
                    }}
                  >
                    {product.dishName}
                  </a>
                  <h5 className="price">
                    {(() => {
                      const offer = getProductOffer(product.dishId);
                      if (offer) {
                        const discountedPrice =
                          product.price * (1 - offer.discountPercentage / 100);
                        return (
                          <>
                            {discountedPrice.toLocaleString()} VNĐ
                            <del className="ml-2">
                              {product.price.toLocaleString()} VNĐ
                            </del>
                            <span className="offer-badge ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                              -{offer.discountPercentage}%
                            </span>
                          </>
                        );
                      } else {
                        return (
                          <>
                            {product.offerPrice.toLocaleString()} VNĐ
                            {product.offerPrice < product.price && (
                              <del className="ml-2">
                                {product.price.toLocaleString()} VNĐ
                              </del>
                            )}
                          </>
                        );
                      }
                    })()}
                  </h5>
                  <ul className="d-flex flex-wrap justify-content-center">
                    {/* <li>
                      <a href="#">
                        <i className="fas fa-shopping-basket"></i>
                      </a>
                    </li> */}
                    <li>
                      <div
                        className="heart"
                        onClick={() => handleAddToWishlist(product.dishId)}
                      >
                        <i className="fal fa-heart"></i>
                      </div>
                    </li>
                    <li>
                      <Link
                        to={`/product-detail/${product.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleProductClick(product.slug);
                        }}
                      >
                        <i className="far fa-eye"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center">
            <Pagination
              current={current}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showQuickJumper
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MenuHome;
