import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Blog {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  date: string;
  comments: number;
}

function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      slug: 'blog-1',
      title: 'Competently supply customized initiatives',
      category: 'chicken',
      image: 'images/menu2_img_1.jpg',
      date: '25 oct 2022',
      comments: 25,
    },
    {
      id: 2,
      slug: 'blog-2',
      title: 'Unicode UTF8 Character Sets They Sltimate Guide Systems',
      category: 'kabab',
      image: 'images/menu2_img_2.jpg',
      date: '27 oct 2022',
      comments: 41,
    },
    {
      id: 3,
      slug: 'blog-3',
      title: "Quality Foods Requirements For Every Human Body's",
      category: 'grill',
      image: 'images/menu2_img_3.jpg',
      date: '27 oct 2022',
      comments: 32,
    },
    {
      id: 4,
      slug: 'blog-4',
      title: 'Competently supply customized initiatives',
      category: 'chicken',
      image: 'images/menu2_img_4.jpg',
      date: '25 oct 2022',
      comments: 25,
    },
    {
      id: 5,
      slug: 'blog-5',
      title: 'Unicode UTF8 Character Sets They Sltimate Guide Systems',
      category: 'kabab',
      image: 'images/menu2_img_5.jpg',
      date: '27 oct 2022',
      comments: 41,
    },
    {
      id: 6,
      slug: 'blog-6',
      title: "Quality Foods Requirements For Every Human Body's",
      category: 'grill',
      image: 'images/menu2_img_6.jpg',
      date: '27 oct 2022',
      comments: 32,
    },
    {
      id: 7,
      slug: 'blog-7',
      title: 'Competently supply customized initiatives',
      category: 'chicken',
      image: 'images/menu2_img_7.jpg',
      date: '25 oct 2022',
      comments: 25,
    },
    {
      id: 8,
      slug: 'blog-8',
      title: 'Unicode UTF8 Character Sets They Sltimate Guide Systems',
      category: 'kabab',
      image: 'images/menu2_img_8.jpg',
      date: '27 oct 2022',
      comments: 41,
    },
    {
      id: 9,
      slug: 'blog-9',
      title: "Quality Foods Requirements For Every Human Body's",
      category: 'grill',
      image: 'images/menu2_img_1.jpg',
      date: '27 oct 2022',
      comments: 32,
    },
  ]);

  // Sau này khi có API, bạn có thể uncomment đoạn code này
  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       const response = await fetch('API_URL/blogs');
  //       const data = await response.json();
  //       setBlogs(data);
  //     } catch (error) {
  //       console.error('Error fetching blogs:', error);
  //     }
  //   };
  //   fetchBlogs();
  // }, []);

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>Our Latest Food Blogs</h1>
              <ul>
                <li>
                  <Link to="/">home</Link>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="fp__blog_page fp__blog2 mt_120 xs_mt_65 mb_100 xs_mb_70">
        <div className="container">
          <div className="row">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="col-xl-4 col-sm-6 col-lg-4 wow fadeInUp"
                data-wow-duration="1s"
              >
                <div className="fp__single_blog">
                  <Link
                    to={`/blog-detail/${blog.slug}`}
                    className="fp__single_blog_img"
                  >
                    <img
                      src={blog.image}
                      alt="blog"
                      className="img-fluid w-100"
                    />
                  </Link>
                  <div className="fp__single_blog_text">
                    <a className="category" href="#">
                      {blog.category}
                    </a>
                    <ul className="d-flex flex-wrap mt_15">
                      <li>
                        <i className="fas fa-user"></i>admin
                      </li>
                      <li>
                        <i className="fas fa-calendar-alt"></i> {blog.date}
                      </li>
                      <li>
                        <i className="fas fa-comments"></i> {blog.comments}{' '}
                        comment
                      </li>
                    </ul>
                    <Link className="title" to={`/blog-detail/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fp__pagination mt_35">
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
                        <i className="fas fa-long-arrow-alt-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogPage;
