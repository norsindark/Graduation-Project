import React, { useState, useEffect } from 'react';
import { Table, Button, notification, Card, Space, Popconfirm } from 'antd';
import CategoryNew from './CategoryNew';
import CategoryEdit from './CategoryEdit';
import { callGetAllCategory } from '../../../services/serverApi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
          setDataSource(treeData);
          setTotal(response.data.page.totalElements);
        } else {
          setDataSource([]);
          setTotal(0);
        }
      } else {
        notification.error({
          message: 'Lỗi khi tải danh sách danh mục',
          description:
            response.data.errors?.error || 'Lỗi khi tải danh sách danh mục!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi khi tải danh sách danh mục',
        description: 'Vui lòng thử lại sau',
      });
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (categories: CategoryItem[]): CategoryItem[] => {
    const categoryMap = new Map<string, CategoryItem>();
    const rootCategories: CategoryItem[] = [];

    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    let rootIndex = 1;
    categories.forEach((category) => {
      if (category.parentName) {
        const parentCategory = Array.from(categoryMap.values()).find(
          (c) => c.name === category.parentName
        );
        if (parentCategory) {
          if (!parentCategory.displayOrder) {
            parentCategory.displayOrder = `${rootIndex}`;
            rootIndex++;
          }
          const childIndex = (parentCategory.children?.length || 0) + 1;
          const displayOrder = `${parentCategory.displayOrder}-${childIndex}`;
          categoryMap.get(category.id)!.displayOrder = displayOrder;
          parentCategory.children?.push(categoryMap.get(category.id)!);
        } else {
          categoryMap.get(category.id)!.displayOrder = `${rootIndex}`;
          rootCategories.push(categoryMap.get(category.id)!);
          rootIndex++;
        }
      } else {
        categoryMap.get(category.id)!.displayOrder = `${rootIndex}`;
        rootCategories.push(categoryMap.get(category.id)!);
        rootIndex++;
      }
    });

    return rootCategories;
  };

  const handleAddSuccess = () => {
    fetchCategories();
  };

  const handleEditSuccess = () => {
    fetchCategories();
  };

  const handleEditClick = (record: CategoryItem) => {
    setCurrentCategory(record);
    setShowCategoryEdit(true);
  };

  const handleDeleteClick = async (id: string) => {
    // try {
    //   const res = await callDeleteCategory(id);
    //   if (res?.status == 200) {
    //     notification.success({
    //       message: 'Danh mục đã được xóa thành công!',
    //       duration: 5,
    //       showProgress: true,
    //     });
    //     fetchCategories();
    //   } else {
    //     notification.error({
    //       message: 'Lỗi khi xóa danh mục',
    //       description: res.data.errors?.error || 'Lỗi khi xóa danh mục!',
    //       duration: 5,
    //       showProgress: true,
    //     });
    //   }
    // } catch {
    //   notification.error({
    //     message: 'Lỗi khi xóa danh mục',
    //     description: 'Lỗi khi xóa danh mục!',
    //     duration: 5,
    //     showProgress: true,
    //   });
    // }
  };

  const columns = [
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      render: (displayOrder: string) => displayOrder,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'ACTIVE' ? 'Đang hiển thị' : 'Ẩn',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: CategoryItem) => (
        <Space>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Card
        title="Quản lý danh mục"
        extra={
          !showCategoryNew &&
          !showCategoryEdit && (
            <Button
              title="Thêm danh mục mới"
              type="primary"
              className="mb-3"
              onClick={() => setShowCategoryNew(true)}
              size="large"
              shape="round"
              block
            >
              Tạo danh mục mới
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
              onChange: (page, pageSize) => {
                setCurrent(page);
                setPageSize(pageSize);
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
