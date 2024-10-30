import { useState, useEffect } from 'react';
import {
  callGetAllCategory,
  callGetAllDishes,
} from '../../../services/clientApi';
import {
  notification,
  Pagination,
  Form,
  Input,
  Select,
  Slider,
  Rate,
  Button,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';

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
  subCategories: { name: string }[];
}

function MenuAbout() {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('*');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [total, setTotal] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [current, pageSize]);

  const fetchCategories = async () => {
    try {
      const response = await callGetAllCategory();
      const categoriesData = response.data._embedded.categoryResponseList;
      setCategories(categoriesData);
      const formattedMenuItems = categoriesData.map((category: Category) => ({
        title: category.name,
        items: [
          `All ${category.name}`,
          ...category.subCategories.map((subCategory) => subCategory.name),
        ],
      }));
      setMenuItems(formattedMenuItems);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    setShowDropdown(null);
    setCurrent(1);
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
        <Form className="fp__search_menu_form">
          <div className="row">
            <div className="col-xl-4 col-md-5">
              <Form.Item className="relative">
                <Input
                  size="large"
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pr-20 rounded-3xl"
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  className="absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-primary hover:bg-primary-dark text-white"
                >
                  <i className="fas fa-search "></i>
                  <span className="text-base">Search</span>
                </Button>
              </Form.Item>
            </div>
            <div className="col-xl-2 col-md-2">
              <Form.Item label="Rating" className="text-xl font-medium">
                <Rate
                  allowHalf
                  defaultValue={0}
                  onChange={(value) => setRatingFilter(value)}
                />
              </Form.Item>
            </div>
            <div className="col-xl-3 col-md-3">
              <Form.Item label="Price" className="mb-2 text-xl font-medium">
                <Slider
                  range
                  min={0}
                  max={1000000}
                  defaultValue={[0, 1000000]}
                  onChange={(value) => setPriceRange(value as [number, number])}
                />
              </Form.Item>
            </div>
            <div className="col-xl-3 col-md-4">
              <Form.Item>
                <Select size="large" className="text-xl font-medium">
                  <Select.Option className="text-xl font-medium " value="">
                    Select Product
                  </Select.Option>
                  <Select.Option className="text-xl font-medium" value="">
                    highlight
                  </Select.Option>
                  <Select.Option className="text-xl font-medium" value="">
                    new
                  </Select.Option>
                  <Select.Option className="text-xl font-medium" value="">
                    Price low to high
                  </Select.Option>
                  <Select.Option className="text-xl font-medium" value="">
                    Price high to low
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>

        <div className="row wow fadeInUp mt-2" data-wow-duration="1s">
          <div className="col-12">
            <div className="menu_filter d-flex flex-wrap justify-content-center ">
              <button
                className={activeFilter === '*' ? 'active' : ''}
                onClick={() => handleFilter('*')}
              >
                All menu
              </button>
              {menuItems.map((menu, index) => (
                <div className="relative" key={`menu-${index}`}>
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
                      {menu.items.map((item: string, itemIndex: number) => (
                        <li key={`${menu.title}-${itemIndex}`}>
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
                    className="title"
                    href={`/product-detail/${product.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(product.slug);
                    }}
                  >
                    {product.dishName}
                  </a>
                  <h5 className="price">
                    {product.offerPrice.toLocaleString()} VNĐ
                    {product.offerPrice < product.price && (
                      <del className="ml-2">
                        {product.price.toLocaleString()} VNĐ
                      </del>
                    )}
                  </h5>
                  <ul className="d-flex flex-wrap justify-content-center">
                    <li>
                      <a href="#">
                        <i className="fal fa-heart"></i>
                      </a>
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

export default MenuAbout;
