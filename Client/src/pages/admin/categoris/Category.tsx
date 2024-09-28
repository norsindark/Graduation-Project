import React, { useState, useEffect, Children } from 'react';
import { Table, Button, notification, Card, Space, Popconfirm } from 'antd';
import CategoryNew from './CategoryNew';
import CategoryEdit from './CategoryEdit';
import { callGetAllCategory, callDeleteCategory } from '../../../services/serverApi';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  status: string;
  parentName: string | null;
  createdAt: string;
  updatedAt: string;
  children?: CategoryItem[];
  subCategories?: CategoryItem[];
}

const Category: React.FC = () => {
  const [dataSource, setDataSource] = useState<CategoryItem[]>([]);
  const [showCategoryNew, setShowCategoryNew] = useState<boolean>(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(null);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, [current, pageSize]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const query = `pageNo=${current - 1}&pageSize=${pageSize}&sortBy=name&sortDir=asc`;
      const response = await callGetAllCategory(query);
      if (response?.status === 200 && response.data._embedded?.categoryResponseList) {
        const categories = response.data._embedded.categoryResponseList;
        setDataSource(buildCategoryTree(categories));
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
  };


  const buildCategoryTree = (categories: CategoryItem[]): CategoryItem[] => {
    const categoryMap = new Map<string, CategoryItem>();
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });
    categories.forEach((category) => {
      category.subCategories?.forEach((subCategory) => {
        const childCategory = categoryMap.get(subCategory.id);
        const parentCategory = categoryMap.get(category.id);
        if (parentCategory && childCategory) {
          parentCategory.children?.push(childCategory);
        }
      });
    });
    return Array.from(categoryMap.values()).filter((category) => !category.parentName);
  };

  const handleAddSuccess = () => {
    fetchCategories();
    setShowCategoryNew(false);
  };

  const handleEditClick = (record: CategoryItem) => {
    setCurrentCategory(record);
    setShowCategoryEdit(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const res = await callDeleteCategory(id);
      if (res?.status === 200) {
        notification.success({ message: 'Category deleted successfully!' });
        fetchCategories();
      } else if (res?.status === 401) {
        notification.error({ message: 'Error deleting category: This category has subcategories.' });
      } else {
        notification.error({ message: 'Error deleting category.' });
      }
    } catch (error) {
      notification.error({ message: 'Error deleting category.' });
    }
  };


  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: CategoryItem, b: CategoryItem) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (description ? description : 'No Description'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (status === 'INACTIVE' ? 'Hidden' : 'Displayed'),
    },
    {
      title: 'Action',
      key: 'actions',
      render: (_: any, record: CategoryItem) => (
        <Space>
          <Button type="primary" shape="round" icon={<EditOutlined />} onClick={() => handleEditClick(record)}>Edit</Button>
          <Popconfirm title="Delete this category?" onConfirm={() => handleDeleteClick(record.id)}>
            <Button type="primary" danger shape="round" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Card
        title="Manage Category"
        extra={
          !showCategoryNew && !showCategoryEdit && (
            <Button type="primary" onClick={() => setShowCategoryNew(true)} shape="round" icon={<PlusOutlined />}>
              Create Category
            </Button>
          )
        }
      >
        {showCategoryNew ? (
          <CategoryNew onAddSuccess={handleAddSuccess} setShowCategoryNew={setShowCategoryNew} />
        ) : showCategoryEdit && currentCategory ? (
          <CategoryEdit
            currentCategory={currentCategory}
            onEditSuccess={() => fetchCategories()}
            setShowCategoryEdit={setShowCategoryEdit}
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
              onShowSizeChange: (_, size) => {
                setCurrent(1);
                setPageSize(size);
              },
              onChange: (page) => {
                setCurrent(page);
              },
            }}
            expandable={{ childrenColumnName: 'subCategories' }}
            scroll={{ x: 'max-content' }}
            bordered
          />
        )}
      </Card>
    </div>
  );
};

export default Category;
