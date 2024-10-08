import { useState } from 'react';

function MenuHome() {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('*');

  const handleFilter = (filter: string) => {
    if (filter.startsWith('tất cả')) {
      setActiveFilter(filter.replace('tất cả ', '').trim());
    } else {
      setActiveFilter(filter);
    }
    setShowDropdown(null);
  };

  const menuItems = [
    {
      title: 'Khai vị',
      items: ['Tất cả khai vị', 'Salad', 'Súp'],
    },
    {
      title: 'Món chính',
      items: ['Tất cả món chính', 'Hải sản', 'Thịt', 'Cơm', 'Mì'],
    },
    {
      title: 'Tráng miệng',
      items: ['Tất cả tráng miệng', 'Bánh ngọt', 'Kem', 'Trái cây'],
    },
    {
      title: 'Đồ uống',
      items: ['Tất cả đồ uống', 'Cà phê', 'Trà', 'Nước ép', 'Cocktail'],
    },
  ];

  const products = [
    {
      id: 1,
      title: 'Grilled Salmon',
      category: 'Hải sản',
      price: 45.0,
      rating: 4.5,
      image: 'images/menu2_img_3.jpg',
    },
    {
      id: 2,
      title: 'Chicken Salad',
      category: 'Salad',
      price: 25.0,
      rating: 4.0,
      image: 'images/menu2_img_1.jpg',
    },
    {
      id: 3,
      title: 'Tiramisu Cake',
      category: 'Bánh ngọt',
      price: 30.0,
      rating: 4.8,
      image: 'images/menu2_img_2.jpg',
    },
    {
      id: 4,
      title: 'Lobster Risotto',
      category: 'Hải sản',
      price: 99.0,
      rating: 4.9,
      image: 'images/menu2_img_5.jpg',
    },
    {
      id: 5,
      title: 'Fruit Salad',
      category: 'Trái cây',
      price: 15.0,
      rating: 4.7,
      image: 'images/menu2_img_4.jpg',
    },
    {
      id: 6,
      title: 'Espresso Coffee',
      category: 'Cà phê',
      price: 12.0,
      rating: 4.6,
      image: 'images/menu2_img_6.jpg',
    },
    {
      id: 7,
      title: 'Margarita Pizza',
      category: 'Thịt',
      price: 50.0,
      rating: 4.3,
      image: 'images/menu2_img_7.jpg',
    },
    {
      id: 8,
      title: 'Apple Pie',
      category: 'Bánh ngọt',
      price: 20.0,
      rating: 4.2,
      image: 'images/menu2_img_8.jpg',
    },
  ];

  const filteredProducts =
    activeFilter === '*'
      ? products
      : products.filter((product) => {
          const category = product.category.toLowerCase();
          switch (activeFilter) {
            case 'khai vị':
              return ['salad', 'súp'].includes(category);
            case 'món chính':
              return ['hải sản', 'thịt', 'cơm', 'mì'].includes(category);
            case 'tráng miệng':
              return ['bánh ngọt', 'kem', 'trái cây'].includes(category);
            case 'đồ uống':
              return ['cà phê', 'trà', 'nước ép', 'cocktail'].includes(
                category
              );
            default:
              return category === activeFilter.toLowerCase();
          }
        });

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
                className="active"
                data-filter="*"
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
                      className="absolute  shadow-lg w-60  left-0 rounded-md focus:outline-none z-50"
                      onMouseEnter={() => setShowDropdown(index)}
                      onMouseLeave={() => setShowDropdown(null)}
                    >
                      {menu.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <button
                            onClick={() => handleFilter(item.toLowerCase())}
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
              className={`col-xl-3 col-sm-6 col-lg-4 wow fadeInUp ${index % 2 === 0 ? 'animate__animated animate__fadeInRight' : 'animate__animated animate__fadeInLeft'}`}
              data-wow-duration="1s"
              key={product.id}
              style={{ animationDelay: `${index * 0.2}s` }} // Thêm hiệu ứng delay
            >
              <div className="fp__menu_item">
                <div className="fp__menu_item_img">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="img-fluid w-100"
                  />
                  <a className="category" href="#">
                    {product.category}
                  </a>
                </div>
                <div className="fp__menu_item_text">
                  <p className="rating">
                    {[...Array(5)].map((star, i) => (
                      <i
                        key={i}
                        className={
                          i < product.rating ? 'fas fa-star' : 'far fa-star'
                        }
                      ></i>
                    ))}
                    <span>{Math.round(product.rating * 10) / 10}</span>
                  </p>
                  <a className="title" href="#">
                    {product.title}
                  </a>
                  <h5 className="price">${product.price.toFixed(2)}</h5>
                  <ul className="d-flex flex-wrap justify-content-center">
                    <li>
                      <a href="#">
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default MenuHome;
