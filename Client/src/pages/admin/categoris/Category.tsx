import React, { useState } from 'react';
import { Table, Button, notification, Row, Col } from 'antd';
import CategoryNew from './CategoryNew';
import CategoryEdit from './CategoryEdit';

interface CategoryItem {
  key: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  children?: CategoryItem[];
}

const initialDataSource: CategoryItem[] = [
  {
    key: '1',
    name: 'Khai vị',
    description: 'Món ăn khai vị',
    displayOrder: 1,
    isActive: true,
    children: [
      {
        key: '1-1',
        name: 'Salad',
        description: 'Các loại salad tươi ngon',
        displayOrder: 1,
        isActive: true,
      },
      {
        key: '1-2',
        name: 'Súp',
        description: 'Các loại súp nóng hổi',
        displayOrder: 2,
        isActive: true,
      },
    ],
  },
  {
    key: '2',
    name: 'Món chính',
    description: 'Các món ăn chính',
    displayOrder: 2,
    isActive: true,
    children: [
      {
        key: '2-1',
        name: 'Mì Ý',
        description: 'Các món mì Ý ngon tuyệt',
        displayOrder: 1,
        isActive: true,
      },
      {
        key: '2-2',
        name: 'Bò bít tết',
        description: 'Bò bít tết mềm ngọt',
        displayOrder: 2,
        isActive: true,
      },
    ],
  },
  {
    key: '3',
    name: 'Tráng miệng',
    description: 'Món tráng miệng ngọt ngào',
    displayOrder: 3,
    isActive: true,
    children: [
      {
        key: '3-1',
        name: 'Bánh ngọt',
        description: 'Các loại bánh ngọt hấp dẫn',
        displayOrder: 1,
        isActive: true,
      },
      {
        key: '3-2',
        name: 'Kem',
        description: 'Kem mát lạnh đa dạng hương vị',
        displayOrder: 2,
        isActive: true,
      },
    ],
  },
];

const Category: React.FC = () => {
  const [dataSource, setDataSource] =
    useState<CategoryItem[]>(initialDataSource);
  const [showCategoryNew, setShowCategoryNew] = useState<boolean>(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(
    null
  );

  const handleAddSuccess = () => {
    setShowCategoryNew(false);
    notification.success({
      message: 'Category added successfully!',
      duration: 5,
    });
  };

  const handleEditSuccess = () => {
    setShowCategoryEdit(false);
    setCurrentCategory(null);
    notification.success({
      message: 'Category updated successfully!',
      duration: 5,
    });
  };

  const handleEditClick = (category: CategoryItem) => {
    setCurrentCategory(category);
    setShowCategoryEdit(true);
  };

  const handleDeleteClick = (key: string) => {
    notification.success({
      message: 'Category deleted successfully!',
      duration: 5,
    });
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns = [
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
      title: 'Thứ tự hiển thị',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (isActive ? 'Đang hiển thị' : 'Ẩn'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: CategoryItem) => {
        if (record.children) {
          return (
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Button
                  type="primary"
                  shape="round"
                  block
                  onClick={() => handleEditClick(record)}
                >
                  Sửa
                </Button>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Button
                  type="primary"
                  shape="round"
                  danger
                  block
                  onClick={() => handleDeleteClick(record.key)}
                >
                  Xóa
                </Button>
              </Col>
            </Row>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="layout-content">
      <Row>
        <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}>
          {!showCategoryNew && !showCategoryEdit && (
            <Button
              type="primary"
              className="mb-3"
              onClick={() => setShowCategoryNew(true)}
              size="large"
              shape="round"
              block
            >
              Create New Category
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
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
              rowKey="key"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                total: dataSource.length,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Category;
