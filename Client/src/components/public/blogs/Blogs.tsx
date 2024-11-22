import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { callGetAllBlog } from '../../../services/clientApi';
import { notification } from 'antd';

interface Blog {
  id: string;
  slug: string;
  title: string;
  categoryBlogName: string;
  thumbnail: string;
  createdAt: string;
  totalComments: number;
  author: string;
  status: string;
}

function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Lấy 3 bài blog mới nhất
      const query = `pageNo=0&pageSize=3&sortBy=createdAt&sortDir=desc`;
      const response = await callGetAllBlog(query);
      const blogsData = response.data._embedded?.blogResponseList;
      if (blogsData) {
        const activeBlogs = blogsData.filter(
          (blog: Blog) => blog.status === 'PUBLISHED'
        );
        setBlogs(activeBlogs);
      }
    } catch (error) {
      setBlogs([]);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="fp__blog fp__blog2">
      <div className="fp__blog_overlay pt_95 pt_xs_60 pb_100 xs_pb_70">
        <div className="container">
          <div className="row wow fadeInUp" data-wow-duration="1s">
            <div className="col-md-8 col-lg-7 col-xl-6 m-auto text-center">
              <div className="fp__section_heading mb_25">
                <h4>news & blogs</h4>
                <h2>our latest foods blog</h2>
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
                    <Link
                      className="title truncate block whitespace-nowrap overflow-hidden"
                      to={`/blog-detail/${blog.slug}`}
                    >
                      {blog.title}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blogs;
