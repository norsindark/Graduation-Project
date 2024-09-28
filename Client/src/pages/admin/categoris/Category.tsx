import React, { useState, useEffect } from 'react';
import { Table, Button, notification, Card, Space, Popconfirm } from 'antd';
import CategoryNew from './CategoryNew';
import CategoryEdit from './CategoryEdit';
import { callGetAllCategory } from '../../../services/serverApi';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { callDeleteCategory } from '../../../services/serverApi';
interface CategoryItem {
  id: string;
  name: string;
  description: string;
  status: string;
  parentName: string | null;
  createdAt: string;
  updatedAt: string;
  children?: CategoryItem[];
  displayOrder?: string;
}

const Category: React.FC = () => {
  const [dataSource, setDataSource] = useState<CategoryItem[]>([]);
  const [showCategoryNew, setShowCategoryNew] = useState<boolean>(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(
    null
  );

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, [current, pageSize, sortQuery]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=name&sortDir=asc`;
      }
      const response = await callGetAllCategory(query);
      if (response?.status == 200) {
        if (
          response &&
          response.data._embedded &&
          Array.isArray(response.data._embedded.categoryResponseList)
        ) {
          const categories = response.data._embedded.categoryResponseList;
          const treeData = buildCategoryTree(categories);
          console.log(treeData);
          setDataSource(treeData);
          setTotal(response.data.page.totalElements);
        } else {
          setDataSource([]);
          setTotal(0);
        }
      } else {
        notification.error({
          message: 'Error when loading category list',
          description:
            response.data.errors?.error || 'Error when loading category list!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error when loading category list',
        description: 'Please try again later',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (categories: CategoryItem[]): CategoryItem[] => {
    const categoryMap = new Map<string, CategoryItem>();
    const rootCategories: CategoryItem[] = [];

    // Đầu tiên, tạo map của tất cả các danh mục
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    let rootIndex = 1;
    categories.forEach((category) => {
      const currentCategory = categoryMap.get(category.id)!;

      if (category.parentName) {
        // Tìm danh mục cha dựa trên parentName
        const parentCategory = Array.from(categoryMap.values()).find(
          (c) => c.name === category.parentName
        );

        if (parentCategory) {
          if (!parentCategory.displayOrder) {
            parentCategory.displayOrder = `${rootIndex}`;
            rootIndex++;
          }
          const childIndex = (parentCategory.children?.length || 0) + 1;
          currentCategory.displayOrder = `${parentCategory.displayOrder}-${childIndex}`;
          parentCategory.children?.push(currentCategory);
        } else {
          // Nếu không tìm thấy danh mục cha, xử lý như danh mục gốc
          currentCategory.displayOrder = `${rootIndex}`;
          rootCategories.push(currentCategory);
          rootIndex++;
        }
      } else {
        // Danh mục gốc
        currentCategory.displayOrder = `${rootIndex}`;
        rootCategories.push(currentCategory);
        rootIndex++;
      }
    });

    return rootCategories;
  };

  const handleAddSuccess = () => {
    fetchCategories();
    setShowCategoryNew(false);
  };

  const handleEditSuccess = () => {
    fetchCategories();
  };

  const handleEditClick = (record: CategoryItem) => {
    setCurrentCategory(record);
    setShowCategoryEdit(true);
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

  const handleDeleteClick = async (id: string) => {
    try {
      const res = await callDeleteCategory(id);
      if (res?.status == 200) {
        notification.success({
          message: 'Category deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchCategories();
      } else {
        notification.error({
          message: 'Error deleting category',
          description: res.data.errors?.error || 'Error deleting category!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch {
      notification.error({
        message: 'Error deleting category',
        description: 'Error deleting category!',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const columns = [
    {
      title: 'Display Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      render: (displayOrder: string) => displayOrder,
      sorter: (a: CategoryItem, b: CategoryItem) =>
        parseInt(a.displayOrder || '0') - parseInt(b.displayOrder || '0'),
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
        description === '' ? 'No Description' : description,
      sorter: (a: CategoryItem, b: CategoryItem) =>
        a.description.localeCompare(b.description),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: CategoryItem) => {
        if (!record.parentName) {
          return status === 'INACTIVE' ? 'Hidden' : 'Display';
        }
        return null;
      },
      sorter: (a: CategoryItem, b: CategoryItem) =>
        a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      key: 'actions',
      render: (_: any, record: CategoryItem) => {
        if (!record.parentName) {
          return (
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
                title="Are you sure you want to delete this category?"
                onConfirm={() => handleDeleteClick(record.id)}
                okText="Yes"
                cancelText="No"
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
          );
        }
        return null;
      },
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
              className="mb-3"
              onClick={() => setShowCategoryNew(true)}
              shape="round"
              icon={<PlusOutlined />}
            >
              Create Category New
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
            onEditSuccess={handleEditSuccess}
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
            scroll={{ x: 'max-content' }}
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

export default Category;
