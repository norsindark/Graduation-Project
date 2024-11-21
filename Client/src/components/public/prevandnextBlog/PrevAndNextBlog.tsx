import { Link } from 'react-router-dom';
import { callGetAllBlog } from '../../../services/clientApi';
import { useEffect, useState } from 'react';

interface PrevNextBlogProps {
  slug?: string;
  prevBlog: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
  } | null;
  nextBlog: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
  } | null;
  setPrevBlog: (blog: any) => void;
  setNextBlog: (blog: any) => void;
}

function PrevAndNextBlog({
  slug,
  prevBlog,
  nextBlog,
  setPrevBlog,
  setNextBlog,
}: PrevNextBlogProps) {
  const fetchPrevNextBlogs = async () => {
    try {
      const response = await callGetAllBlog(
        'pageNo=0&pageSize=100&sortBy=createdAt&sortDir=desc'
      );
      const blogsData = response.data._embedded?.blogResponseList || [];
      const activeBlogs = blogsData.filter(
        (blog: any) => blog.status === 'PUBLISHED'
      );

      const currentIndex = activeBlogs.findIndex(
        (blog: any) => blog.slug === slug
      );

      if (currentIndex > 0) {
        setPrevBlog({
          id: activeBlogs[currentIndex - 1].id,
          title: activeBlogs[currentIndex - 1].title,
          slug: activeBlogs[currentIndex - 1].slug,
          thumbnail: activeBlogs[currentIndex - 1].thumbnail,
        });
      } else {
        setPrevBlog(null);
      }

      if (currentIndex < activeBlogs.length - 1) {
        setNextBlog({
          id: activeBlogs[currentIndex + 1].id,
          title: activeBlogs[currentIndex + 1].title,
          slug: activeBlogs[currentIndex + 1].slug,
          thumbnail: activeBlogs[currentIndex + 1].thumbnail,
        });
      } else {
        setNextBlog(null);
      }
    } catch (error) {
      console.error('Lỗi khi tải blog trước/sau:', error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPrevNextBlogs();
    }
  }, [slug]);

  return (
    <ul
      className="blog_det_button mt_100 xs_mt_70 wow fadeInUp"
      data-wow-duration="1s"
    >
      {prevBlog && (
        <li>
          <Link to={`/blog-detail/${prevBlog.slug}`}>
            <img
              src={prevBlog.thumbnail}
              alt="previous blog"
              className="img-fluid w-100"
            />
            <p>
              {prevBlog.title}
              <span>
                <i className="far fa-long-arrow-left"></i> Previous
              </span>
            </p>
          </Link>
        </li>
      )}
      {nextBlog && (
        <li>
          <Link to={`/blog-detail/${nextBlog.slug}`}>
            <p>
              {nextBlog.title}
              <span>
                Next <i className="far fa-long-arrow-right"></i>
              </span>
            </p>
            <img
              src={nextBlog.thumbnail}
              alt="next blog"
              className="img-fluid w-100"
            />
          </Link>
        </li>
      )}
    </ul>
  );
}

export default PrevAndNextBlog;
