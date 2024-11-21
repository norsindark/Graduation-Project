import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Tag,
  Image,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CategoryBlogNew from './CategoryBlogNew';
import CategoryBlogEdit from './CategoryBlogEdit';
import {
  callDeleteCategoryBlog,
  callGetAllCategoryBlog,
} from '../../../services/serverApi';

interface CategoryBlogItem {
  categoryBlogId: string;
  categoryName: string;
  slug: string;
  status: string;
  thumbnail: string | null;
  displayOrder: number;
  createdDate: string;
  updatedDate: string;
}

const CategoryBlog: React.FC = () => {
  const [dataSource, setDataSource] = useState<CategoryBlogItem[]>([]);

  const [showCategoryBlogNew, setShowCategoryBlogNew] = useState(false);
  const [showCategoryBlogEdit, setShowCategoryBlogEdit] = useState(false);

  const [currentCategory, setCurrentCategory] =
    useState<CategoryBlogItem | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [sortQuery, setSortQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesBlog();
  }, [current, pageSize]);

  const fetchCategoriesBlog = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=name&sortDir=desc`;
      }
      const response = await callGetAllCategoryBlog(query);
      if (
        response?.status === 200 &&
        response.data._embedded?.categoryBlogResponseList
      ) {
        const categories = response.data._embedded.categoryBlogResponseList;
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
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    fetchCategoriesBlog();
    setShowCategoryBlogNew(false);
  };

  const handleEditClick = (record: CategoryBlogItem) => {
    setCurrentCategory(record);
    setShowCategoryBlogEdit(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      setLoading(true);
      const res = await callDeleteCategoryBlog(id);
      if (res?.status === 200) {
        notification.success({
          message: 'Category deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchCategoriesBlog();
      } else {
        notification.error({
          message: 'Error deleting category',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting category.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (pagination: any, sortDir: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
    if (sortDir && sortDir.field) {
      const order = sortDir.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`${sortDir.field},${order}`);
    } else {
      setSortQuery('');
    }
  };

  const columns = [
    {
      title: 'displayOrder',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      sorter: (a: CategoryBlogItem, b: CategoryBlogItem) =>
        a.displayOrder - b.displayOrder,
    },

    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a: CategoryBlogItem, b: CategoryBlogItem) =>
        a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',

      render: (status: string) => (
        <Tag
          color={status === 'ACTIVE' ? 'green' : 'red'}
          className="text-base"
        >
          {status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </Tag>
      ),
      sorter: (a: CategoryBlogItem, b: CategoryBlogItem) =>
        a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CategoryBlogItem) => (
        <Space size="small">
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
            onConfirm={() => handleDeleteClick(record.categoryBlogId)}
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
              Create New Category
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
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              onShowSizeChange: (current, size) => {
                setCurrent(1);
                setPageSize(size);
              },
            }}
            bordered
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        )}
      </Card>
    </div>
  );
};

export default CategoryBlog;
