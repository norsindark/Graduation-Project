import { Pagination } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { callGetAllBlog } from '../../services/clientApi';
import { notification } from 'antd';

interface Blog {
  id: string;
  slug: string;
  title: string;
  categoryBlogName: string;
  status: string;
  thumbnail: string;
  createdAt: string;
  totalComments: number;
  author: string;
}

function BlogPage() {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [total, setTotal] = useState<number>(0);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [current, pageSize]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const query = `pageNo=${current - 1}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`;
      const response = await callGetAllBlog(query);
      const blogsData = response.data._embedded?.blogResponseList;
      if (blogsData) {
        const activeBlogs = blogsData.filter(
          (blog: Blog) => blog.status === 'PUBLISHED'
        );
        if (activeBlogs.length > 0) {
          setBlogs(activeBlogs);
          setTotal(response.data.page.totalElements);
        } else {
          setBlogs([]);
          setTotal(0);
        }
      }
    } catch (error) {
      setBlogs([]);
      setTotal(0);
      notification.error({
        message: 'Error loading blog list',
        description: 'Please try again later',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    if (pageSize) setPageSize(pageSize);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="img-fluid w-100"
                    />
                  </Link>
                  <div className="fp__single_blog_text">
                    <a className="category" href="#">
                      {blog.categoryBlogName}
                    </a>
                    <ul className="d-flex flex-wrap mt_15">
                      <li>
                        <i className="fas fa-user"></i>
                        {blog.author}
                      </li>
                      <li>
                        <i className="fas fa-calendar-alt"></i>{' '}
                        {formatDate(blog.createdAt)}
                      </li>
                      <li>
                        <i className="fas fa-comments"></i> {blog.totalComments}{' '}
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

          <div className="row mt-4">
            <div className="col-12 d-flex justify-content-center mb-4 mt-2">
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
    </>
  );
}

export default BlogPage;
