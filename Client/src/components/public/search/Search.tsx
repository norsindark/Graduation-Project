import { useState, useEffect } from 'react';
import { Modal, Input, Button, Pagination } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { callGetAllDishes } from '../../../services/clientApi';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const pageSize = 4; // Số sản phẩm mỗi trang

  useEffect(() => {
    if (isModalVisible) {
      fetchProducts();
    }
  }, [isModalVisible]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = `pageNo=0&pageSize=100&sortBy=dishName&order=asc`;
      const response = await callGetAllDishes(query);
      if (
        response.status === 200 &&
        response.data._embedded?.dishResponseList
      ) {
        setProducts(response.data._embedded.dishResponseList);
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.dishName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleProductClick = (slug: string) => {
    navigate(`/product-detail/${slug}`);
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Xử lý tìm kiếm khi bấm OK

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Tính toán sản phẩm cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrent(page);
  };

  return (
    <li className="md:px-1">
      <a href="#" className="menu_search" onClick={showModal}>
        <i className="far fa-search"></i>
      </a>
      <Modal
        title={
          <div className=" text-center mx-auto w-1/2 block rounded-full bg-[#81c784] size-8 font-medium h-10 text-3xl text-white">
            Search
          </div>
        }
        width={1200}
        centered
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={
          <div className="fp__menu_cart_header">
            <span className="close_cart-client" onClick={handleCancel}>
              <i className="fal fa-times"></i>
            </span>
          </div>
        }
        footer={[
          <Button
            key="submit"
            type="primary"
            shape="round"
            style={{ fontWeight: 'medium', margin: '0px' }}
            size="large"
            onClick={handleOk}
            icon={<SearchOutlined />}
          >
            <div className="text-[16px]">Search</div>
          </Button>,
          <Button
            key="cancel"
            type="primary"
            style={{
              fontWeight: 'medium',
              color: 'white !important',
              margin: '0 10px',
            }}
            danger
            shape="round"
            size="large"
            onClick={handleCancel}
            icon={<CloseOutlined />}
          >
            <div className="text-[16px]">Cancel</div>
          </Button>,
        ]}
      >
        <div className="relative w-full max-w-sm mx-auto">
          <Input
            placeholder="🔍 Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full py-2.5 px-4 text-gray-700 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              ✖️
            </button>
          )}
        </div>

        <section className="fp__menu mt_10 xs_mt_45 mb_55 xs_mb_70">
          <div className="container">
            <div className="row">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : filteredProducts.length > 0 ? (
                <>
                  {getCurrentPageData().map((item) => (
                    <div
                      key={item.dishId}
                      className="col-xl-3 col-sm-6 col-lg-4 wow fadeInUp"
                      onClick={() => handleProductClick(item.slug)}
                    >
                      <div className="fp__menu_item cursor-pointer">
                        <div className="fp__menu_item_img">
                          <img
                            src={item.thumbImage}
                            alt={item.dishName}
                            className="img-fluid w-100"
                          />
                          <a className="category">{item.categoryName}</a>
                        </div>
                        <div className="fp__menu_item_text">
                          <p className="rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={
                                  i < Math.floor(item.rating)
                                    ? 'fas fa-star'
                                    : 'far fa-star'
                                }
                              ></i>
                            ))}
                            <span>{item.rating}</span>
                          </p>
                          <a className="title truncate block whitespace-nowrap overflow-hidden">
                            {item.dishName}
                          </a>
                          <h5 className="price">
                            {item.offerPrice.toLocaleString()} VNĐ
                            {item.offerPrice < item.price && (
                              <del className="ml-2">
                                {item.price.toLocaleString()} VNĐ
                              </del>
                            )}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-12 d-flex justify-content-center mt-4">
                    <Pagination
                      current={current}
                      total={filteredProducts.length}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      className="custom-pagination"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center">No items found</div>
              )}
            </div>
          </div>
        </section>
      </Modal>
    </li>
  );
};

export default Search;
