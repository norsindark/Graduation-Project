import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Tag,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CategoryBlogNew from './CategoryBlogNew';
import CategoryBlogEdit from './CategoryBlogEdit';

interface CategoryBlogItem {
  id: string;
  name: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  displayOrder: string;
}

// Dữ liệu giả để sử dụng tạm thời khi chưa có API
const fakeData: CategoryBlogItem[] = [
  {
    id: '1',
    name: 'Tin Công Nghệ',
    image: '/images/technology.jpg',
    status: 'ACTIVE',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    displayOrder: '1',
  },
  {
    id: '2',
    name: 'Tin Thể Thao',
    image: '/images/sports.jpg',
    status: 'ACTIVE',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    displayOrder: '2',
  },
  {
    id: '3',
    name: 'Finance',
    image: '../../../../public/images/blog_3.jpg',
    status: 'ACTIVE',
    createdAt: '2023-03-01',
    updatedAt: '2023-03-02',
    displayOrder: '3',
  },
];

const CategoryBlog: React.FC = () => {
  const [dataSource, setDataSource] = useState<CategoryBlogItem[]>([]);

  const [showCategoryBlogNew, setShowCategoryBlogNew] = useState(false);
  const [showCategoryBlogEdit, setShowCategoryBlogEdit] = useState(false);

  const [currentCategory, setCurrentCategory] =
    useState<CategoryBlogItem | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesBlog();
  }, [current, pageSize]);

  const fetchCategoriesBlog = () => {
    setLoading(true);

    // Dữ liệu giả
    setTimeout(() => {
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = fakeData.slice(start, end);
      setDataSource(paginatedData);
      setTotal(fakeData.length);
      setLoading(false);
    }, 500);

    // *** Dữ liệu thật sẽ sử dụng API ***
    // Khi có API, bỏ comment đoạn sau và xóa đoạn xử lý dữ liệu giả ở trên
    /*
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      // Thêm điều kiện sắp xếp nếu có
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=name&sortDir=desc`;
      }
      const response = await callGetAllCategory(query);
      if (
        response?.status === 200 &&
        response.data._embedded?.categoryResponseList
      ) {
        const categories = response.data._embedded.categoryResponseList;
        setDataSource(categories);
        setTotal(response.data.page.totalElements);
        setCurrent(response.data.page.number + 1);
      } else {
        setDataSource([]);
        setTotal(0);
      }
    } catch {
      notification.error({
        message: 'Error loading category list',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
    */
  };

  const handleAddSuccess = () => {
    fetchCategoriesBlog();
    setShowCategoryBlogNew(false);
  };

  const handleEditClick = (record: CategoryBlogItem) => {
    setCurrentCategory(record);
    setShowCategoryBlogEdit(true);
  };

  const handleDeleteClick = (id: string) => {
    const updatedData = dataSource.filter((item) => item.id !== id);
    setDataSource(updatedData);
    notification.success({
      message: 'Category deleted successfully!',
      duration: 2,
    });

    // *** Xử lý xóa bằng API (khi có API) ***
    /*
    try {
      const res = await callDeleteCategory(id);
      if (res?.status === 200) {
        notification.success({
          message: 'Category deleted successfully!',
          duration: 5,
        });
        fetchCategoriesBlog();
      } else {
        notification.error({
          message: 'Error deleting category',
          description: res.data.errors?.error || 'Error during delete process!',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting category.',
      });
    }
    */
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: '10%',
      sorter: (a: CategoryBlogItem, b: CategoryBlogItem) =>
        Number(a.displayOrder) - Number(b.displayOrder),
    },
    {
      title: 'Hình Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: (image: string) => (
        <img
          src={image}
          alt="Category"
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      title: 'Tên Danh Mục',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      sorter: (a: CategoryBlogItem, b: CategoryBlogItem) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => (
        <Tag color={status === 'INACTIVE' ? 'error' : 'success'}>
          {status === 'INACTIVE' ? 'Không hoạt động' : 'Hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CategoryBlogItem) => (
        <Space>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title={'Delete this category?'}
            onConfirm={() => handleDeleteClick(record.id)}
          >
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Card
        title="Quản Lý Danh Mục Blog"
        extra={
          !showCategoryBlogNew &&
          !showCategoryBlogEdit && (
            <Button
              type="primary"
              onClick={() => setShowCategoryBlogNew(true)}
              shape="round"
              icon={<PlusOutlined />}
            >
              Thêm Danh Mục Mới
            </Button>
          )
        }
      >
        {showCategoryBlogNew ? (
          <CategoryBlogNew
            onAddSuccess={handleAddSuccess}
            setShowCategoryBlogNew={setShowCategoryBlogNew}
          />
        ) : showCategoryBlogEdit && currentCategory ? (
          <CategoryBlogEdit
            currentCategory={currentCategory}
            onEditSuccess={() => fetchCategoriesBlog()}
            setShowCategoryBlogEdit={setShowCategoryBlogEdit}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              current,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default CategoryBlog;
