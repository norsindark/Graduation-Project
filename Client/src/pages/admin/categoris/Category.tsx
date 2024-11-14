import React, { useState, useEffect, Children } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Tag,
  Tooltip,
} from 'antd';
import CategoryNew from './CategoryNew';
import CategoryEdit from './CategoryEdit';
import {
  callGetAllCategory,
  callDeleteCategory,
} from '../../../services/serverApi';
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
  displayOrder: string;
}

const Category: React.FC = () => {
  const [dataSource, setDataSource] = useState<CategoryItem[]>([]);
  const [showCategoryNew, setShowCategoryNew] = useState<boolean>(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(
    null
  );
  const [sortQuery, setSortQuery] = useState<string>('');
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
      let query = `pageNo=${current - 1}&pageSize`;
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
    let rootOrder = 1;

    const assignDisplayOrder = (
      category: CategoryItem,
      parentOrder: string = ''
    ) => {
      if (!category.displayOrder) {
        category.displayOrder = parentOrder ? parentOrder : `${rootOrder++}`;
      }

      if (category.subCategories && category.subCategories.length > 0) {
        category.subCategories.forEach((subCategory, index) => {
          subCategory.displayOrder = `${category.displayOrder}-${index + 1}`;
          assignDisplayOrder(subCategory, subCategory.displayOrder);
        });
      }
    };

    const processCategory = (category: CategoryItem) => {
      if (category.subCategories && category.subCategories.length > 0) {
        category.children = category.subCategories.map((subCategory) => ({
          ...subCategory,
          children: [],
        }));
        category.subCategories.forEach(processCategory);
      }
    };

    // Xử lý các danh mục gốc trước
    const rootCategories = categories.filter(
      (category) => !category.parentName
    );
    rootCategories.forEach((category, index) => {
      category.displayOrder = `${index + 1}`;
      processCategory(category);
      assignDisplayOrder(category);
    });

    return rootCategories;
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
        notification.success({
          message: 'Category deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchCategories();
      } else if (res?.status === 400) {
        notification.error({
          message: 'Error deleting category: This category has subcategories.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error deleting category.',
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
      title: 'Display Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      render: (displayOrder: string) => displayOrder,
      sorter: (a: CategoryItem, b: CategoryItem) =>
        a.displayOrder.localeCompare(b.displayOrder),
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: CategoryItem, b: CategoryItem) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) =>
        description ? (
          <Tooltip title={description}>
            <span>{description.length > 50 ? description.slice(0, 50) + '...' : description}</span>
          </Tooltip>
        ) : (
          'No Description'
        ),
      sorter: (a: CategoryItem, b: CategoryItem) =>
        a.description.localeCompare(b.description),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'INACTIVE' ? 'red' : 'green'}>{status}</Tag>
      ),
      sorter: (a: CategoryItem, b: CategoryItem) =>
        a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CategoryItem) => (
        <Space>
          {record.parentName ? null : (
            <Button
              type="primary"
              shape="round"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            >
              Edit
            </Button>
          )}
          <Popconfirm
            title={
              record.parentName
                ? 'Delete this sub category?'
                : 'Delete this category?'
            }
            onConfirm={() => handleDeleteClick(record.id)}
          >
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
            >
              {record.parentName ? 'Delete Sub Category' : 'Delete'}
            </Button>
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
          !showCategoryNew &&
          !showCategoryEdit && (
            <Button
              type="primary"
              onClick={() => setShowCategoryNew(true)}
              shape="round"
              icon={<PlusOutlined />}
            >
              Create Category
            </Button>
          )
        }
      >
        {showCategoryNew ? (
          <CategoryNew
            onAddSuccess={handleAddSuccess}
            setShowCategoryNew={setShowCategoryNew}
          />
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
            onChange={onChange}
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
            scroll={{ x: 'max-content' }}
            bordered
            expandable={{ childrenColumnName: 'subCategories' }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        )}
      </Card>
    </div>
  );
};

export default Category;
