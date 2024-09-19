import { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const Search = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const items = [
    {
      title: 'Hyderabadi biryani',
      price: '$70.00',
      img: 'images/menu2_img_1.jpg',
      rating: 4.5,
      category: 'Biryani',
    },
    {
      title: 'Chicken Masala',
      price: '$80.00',
      img: 'images/menu2_img_2.jpg',
      rating: 4.0,
      category: 'Chicken',
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Xử lý tìm kiếm khi bấm OK
    console.log('Searching for:', searchText);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <li className="md:px-1">
      <a href="#" className="menu_search" onClick={showModal}>
        <i className="far fa-search"></i>
      </a>
      <Modal
        title={
          <div className=" text-center mx-auto w-1/2 block rounded-full bg-colorPrimary size-8 font-medium h-10 text-3xl text-white">
            Search
          </div>
        }
        centered
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={
          <div className="fp__menu_cart_header">
            <span className="close_cart" onClick={handleCancel}>
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
          >
            <div className="text-[16px]">Cancel</div>
          </Button>,
        ]}
      >
        <Input
          placeholder="Search . . ."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <section className="fp__menu mt_10 xs_mt_45 mb_100 xs_mb_70">
          <div className="container">
            <div className="row">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={index}
                    className="col-xl-6 col-sm-6 col-lg-4 burger pizza wow fadeInUp"
                    data-wow-duration="1s"
                  >
                    <div className="fp__menu_item">
                      <div className="fp__menu_item_img">
                        <img
                          src={item.img}
                          alt="menu"
                          className="img-fluid w-100"
                        />
                        <a className="category" href="#">
                          {item.category}
                        </a>
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
                          <span>{Math.floor(item.rating * 10)}</span>
                        </p>
                        <a className="title" href="menu_details.html">
                          {item.title}
                        </a>
                        <h5 className="price">{item.price}</h5>
                        <ul className="d-flex flex-wrap justify-content-center">
                          <li>
                            <a
                              href="#"
                              data-bs-toggle="modal"
                              data-bs-target="#cartModal"
                            >
                              <i className="fas fa-shopping-basket"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fal fa-heart"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="far fa-eye"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items found</p>
              )}
            </div>
          </div>
        </section>

        <div className="fp__pagination mt_-40 ">
          <div className="row">
            <div className="col-12">
              <nav aria-label="...">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#">
                      <i className="fas fa-long-arrow-alt-left"></i>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      <i className="fas fa-long-arrow-alt-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </Modal>
    </li>
  );
};

export default Search;
