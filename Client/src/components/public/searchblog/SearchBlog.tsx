import { useState, useEffect } from 'react';
import { Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { callSearchBlog } from '../../../services/clientApi';

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
  slug: string;
}

function SearchBlog() {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<BlogDetail[]>([]);
  const [allBlogs, setAllBlogs] = useState<BlogDetail[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await callSearchBlog();
        setAllBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      }
    };
    fetchAllBlogs();
  }, []);

  const handleSearch = debounce((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const filteredResults = allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      id="search-container"
      className="fp__blog_search blog_sidebar m-0 wow fadeInUp"
      data-wow-duration="1s"
    >
      <h3>Search</h3>
      <div className="relative">
        <Form form={form}>
          <Form.Item name="search" className="mb-0">
            <div className="relative group">
              <Input
                placeholder="Search blogs..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 
                        focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                        transition-all duration-300"
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i
                  className={`fas fa-search ${isSearching ? 'animate-spin' : 'transition-transform duration-300'} 
                        text-gray-400 group-hover:scale-125 
                        group-hover:text-gray-500 group-focus-within:text-blue-500`}
                />
              </div>
            </div>
          </Form.Item>
        </Form>

        <div
          className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border 
                  border-gray-200 max-h-96 overflow-y-auto z-50 transition-transform 
                  duration-300 origin-top ${
                    showDropdown
                      ? 'scale-y-100 opacity-100'
                      : 'scale-y-0 opacity-0'
                  }`}
        >
          {searchResults.length > 0 &&
            searchResults.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog-detail/${blog.slug}`}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setShowDropdown(false)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="image-thumbnailBlog"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {blog.author || 'No author'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

          {searchResults.length === 0 && !isSearching && (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBlog;
