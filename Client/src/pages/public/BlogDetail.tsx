import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { callGetBlogBySlug } from '../../services/clientApi';
import { Button, Input, notification } from 'antd';
import Loading from '../../components/Loading/Loading';
import ReactQuill from 'react-quill';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import { callAddComment, callGetAllBlogsToSearch } from '../../services/clientApi';
import { SendOutlined } from '@ant-design/icons';
import CommentBlog from '../../components/public/commentblog/CommentBlog';
import { formatDateEnUS } from '../../utils/formatDateEn-US';
import PrevAndNextBlog from '../../components/public/prevandnextBlog/PrevAndNextBlog';

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

function BlogDetail() {
  const { slug } = useParams();
  const [blogData, setBlogData] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [prevBlog, setPrevBlog] = useState<PrevNextBlog | null>(null);
  const [nextBlog, setNextBlog] = useState<PrevNextBlog | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogDetail[]>([]);
  

  const [form] = Form.useForm();
  const userId = useSelector((state: RootState) => state.account.user?.id);

  useEffect(() => {
    if (slug) {
      fetchBlogDetail();
    }
    fetchAllBlogs();
  }, [slug]);

  // console.log(allBlogs);
  

  const fetchAllBlogs = async () => {
    setLoading(true);
    try {
      const response = await callGetAllBlogsToSearch();
      console.log("res: ",response);
      
      if (response.status === 200) {
        setAllBlogs(response.data);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading blogs',
        description: 'Please try again later',
        duration: 3,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  }

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
    setLoading(true);
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
        fetchBlogDetail();
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Cannot send comment, please try again later',
        duration: 3,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
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

              <div className="comment_input mt-16 sm:mt-10 p-6 bg-gray-50 rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ease-in-out">
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
                    className="px-6 py-2 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                  >
                    Submit Comment
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogDetail;
