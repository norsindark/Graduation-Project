import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  callGetAllBlog,
  callGetAllTags,
  callGetBlogBySlug,
} from '../../services/clientApi';
import { Button, Input, notification, Spin } from 'antd';
import Loading from '../../components/Loading/Loading';
import ReactQuill from 'react-quill';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { callAddComment } from '../../services/clientApi';
import { SendOutlined } from '@ant-design/icons';
import CommentBlog from '../../components/public/commentblog/CommentBlog';
import { formatDateEnUS } from '../../utils/formatDateEn-US';
import PrevAndNextBlog from '../../components/public/prevandnextBlog/PrevAndNextBlog';
import { callGetAllCountBlogByCategory } from '../../services/clientApi';
import SearchBlog from '../../components/public/searchblog/SearchBlog';

interface BlogDetail {
  id: string;
  title: string;
  content: string;
  author: string;
  thumbnail: string;
  tags: string;
  createdAt: string;
  totalComments: number;
  categoryBlogName: string;
}

interface PrevNextBlog {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
}

interface CommentValues {
  content: string;
}

interface LatestBlog {
  id: string;
  slug: string;
  title: string;
  status: string;
  thumbnail: string;
  createdAt: string;
}

interface CategoryCount {
  categoryBlogName: string;
  countBlog: number;
}

function BlogDetail() {
  const { slug } = useParams();
  const [blogData, setBlogData] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [prevBlog, setPrevBlog] = useState<PrevNextBlog | null>(null);
  const [nextBlog, setNextBlog] = useState<PrevNextBlog | null>(null);

  const [latestBlogs, setLatestBlogs] = useState<LatestBlog[]>([]);

  const [form] = Form.useForm();
  const userId = useSelector((state: RootState) => state.account.user?.id);
  const commentFormRef = useRef<HTMLDivElement>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);

  const navigate = useNavigate();
  const MAX_TAGS = 12;
  useEffect(() => {
    fetchLatestBlogs();
    fetchTags();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (slug) {
      fetchBlogDetail();
    }
  }, [slug]);

  const fetchBlogDetail = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await callGetBlogBySlug(slug);
      if (response.status === 200) {
        setBlogData(response.data);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading blog details',
        description: 'Please try again later',
        duration: 3,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBlogs = async () => {
    try {
      const query = `pageNo=0&pageSize=3&sortBy=createdAt&sortDir=desc`;
      const response = await callGetAllBlog(query);
      const blogsData = response.data._embedded?.blogResponseList;
      if (blogsData) {
        const activeBlogs = blogsData.filter(
          (blog: LatestBlog) => blog.status === 'PUBLISHED'
        );
        setLatestBlogs(activeBlogs);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading latest blogs',
        description: 'Please try again later',
        duration: 3,
        showProgress: true,
      });
    }
  };

  const fetchTags = async () => {
    try {
      const response = await callGetAllTags();

      const processedTags = response.data
        .join(',')
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== '');

      const tagCount = processedTags.reduce(
        (acc: { [key: string]: number }, tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        },
        {}
      );

      const popularTags = Object.entries(tagCount)
        .sort((a, b) => {
          const countA = a[1] as number;
          const countB = b[1] as number;
          return countB - countA;
        })
        .slice(0, MAX_TAGS)
        .map(([tag]) => tag);

      setTags(popularTags);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await callGetAllCountBlogByCategory();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading categories',
        description: 'Please try again later',
        duration: 3,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!blogData) return null;

  const handleSubmitComment = async (values: CommentValues) => {
    if (!userId) {
      notification.warning({
        message: 'Please login to comment',
        description: 'You need to login to comment',
        duration: 3,
        showProgress: true,
      });
      return;
    }

    setCommentLoading(true);
    setContentLoading(true);

    try {
      const response = await callAddComment(
        values.content,
        userId,
        blogData?.id as string
      );

      if (response.status === 200) {
        notification.success({
          message: 'Comment successfully',
          description: 'Thank you for your feedback',
          duration: 3,
          showProgress: true,
        });
        form.resetFields();

        await new Promise((resolve) => setTimeout(resolve, 300));
        await fetchBlogDetail();

        setTimeout(() => {
          commentFormRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Cannot send comment, please try again later',
        duration: 3,
        showProgress: true,
      });
    } finally {
      setCommentLoading(false);
      setContentLoading(false);
    }
  };
  const handleTagClick = (tag: string) => {
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
  };
  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <section
        className="fp__breadcrumb"
        style={{ background: 'url(../../../public/images/counter_bg.jpg)' }}
      >
        <div className="fp__breadcrumb_overlay">
          <div className="container">
            <div className="fp__breadcrumb_text">
              <h1>Blog Details</h1>
              <ul>
                <li>
                  <a href="/">home</a>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <span>
                  <i className="fas fa-angle-right mr-4"></i>
                </span>
                <li>
                  <a href="/blog-detail">Blog Details</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="fp__blog_details mt_120 xs_mt_90 mb_100 xs_mb_70">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8">
              <Spin spinning={contentLoading}>
                <div className="fp__blog_det_area">
                  <div
                    className="fp__blog_details_img wow fadeInUp"
                    data-wow-duration="1s"
                  >
                    <img
                      src={
                        blogData.thumbnail ||
                        '../../../public/images/blog_details.jpg'
                      }
                      alt="blog details"
                      className="imf-fluid w-100"
                    />
                  </div>
                  <div
                    className="fp__blog_details_text wow fadeInUp"
                    data-wow-duration="1s"
                  >
                    <ul className="details_bloger d-flex flex-wrap">
                      <li>
                        <i className="far fa-user"></i> {blogData.author}
                      </li>
                      <li>
                        <i className="far fa-comment-alt-lines"></i>{' '}
                        {blogData.totalComments} Comments
                      </li>
                      <li>
                        <i className="far fa-calendar-alt"></i>{' '}
                        {formatDateEnUS(blogData.createdAt)}
                      </li>
                    </ul>
                    <h2>{blogData.title}</h2>{' '}
                    <div>
                      <div className="menu_det_description">
                        <ReactQuill
                          value={blogData.content || ''}
                          readOnly={true}
                          theme="bubble"
                          modules={{ toolbar: false }}
                        />
                      </div>
                    </div>
                    <div className="blog_tags_share d-flex flex-wrap justify-content-between align-items-center">
                      <div className="tags d-flex flex-wrap align-items-center">
                        <span>tags:</span>
                        <ul className="d-flex flex-wrap">
                          {blogData.tags.split(',').map((tag, index) => (
                            <li key={index}>
                              <a href="#">{tag.trim()}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="share d-flex flex-wrap align-items-center">
                        <span>share:</span>
                        <ul className="d-flex flex-wrap">
                          <li>
                            <a href="#">
                              <i className="fab fa-facebook-f"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fab fa-linkedin-in"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fab fa-twitter"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Spin>

              <PrevAndNextBlog
                slug={slug}
                prevBlog={prevBlog}
                nextBlog={nextBlog}
                setPrevBlog={setPrevBlog}
                setNextBlog={setNextBlog}
              />

              <CommentBlog
                blogData={blogData}
                userId={userId}
                fetchBlogDetail={fetchBlogDetail}
              />

              <div
                ref={commentFormRef}
                className="comment_input mt-16 sm:mt-10 p-6 bg-gray-50 rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ease-in-out"
              >
                <div className="header pb-4 border-b border-gray-300 mb-6">
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    ✍️ Leave A Comment
                  </h4>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    📄 Your email address will not be published. Required fields
                    are marked <span className="text-red-500">*</span>
                  </p>
                </div>
                <Form
                  form={form}
                  onFinish={handleSubmitComment}
                  layout="vertical"
                  className="space-y-4"
                >
                  <Form.Item
                    name="content"
                    label={
                      <span className="font-medium text-gray-700 flex items-center gap-1">
                        🖊️ Comment
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please enter your comment!' },
                    ]}
                  >
                    <Input.TextArea
                      rows={5}
                      placeholder="Write your comment here..."
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    shape="round"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    loading={commentLoading}
                    className="px-6 py-2 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                  >
                    {commentLoading ? 'Đang gửi...' : 'Gửi bình luận'}
                  </Button>
                </Form>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4">
              <div id="sticky_sidebar">
                <SearchBlog />
                <div
                  className="fp__related_blog blog_sidebar wow fadeInUp"
                  data-wow-duration="1s"
                >
                  <h3>Latest Post</h3>
                  <ul>
                    {latestBlogs.map((blog) => (
                      <li key={blog.id}>
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="img-fluid w-100"
                        />
                        <div className="text">
                          <Link to={`/blog-detail/${blog.slug}`}>
                            {blog.title}
                          </Link>
                          <p>
                            <i className="far fa-calendar-alt"></i>{' '}
                            {formatDateEnUS(blog.createdAt)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="fp__blog_categori blog_sidebar wow fadeInUp"
                  data-wow-duration="1s"
                >
                  <h3>Categories</h3>
                  <ul>
                    {categories.map((category) => (
                      <li key={category.categoryBlogName}>
                        <a href="#" onClick={(e) => handleCategoryClick(e)}>
                          {category.categoryBlogName}{' '}
                          <span>{category.countBlog}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="fp__blog_tags blog_sidebar wow fadeInUp"
                  data-wow-duration="1s"
                >
                  <h3>Popular Tags</h3>
                  <ul className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <li key={index}>
                        <a
                          onClick={() => handleTagClick(tag)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-primary-600 
                         hover:text-white rounded-full text-sm transition-colors 
                         duration-300 cursor-pointer"
                        >
                          {tag}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogDetail;
