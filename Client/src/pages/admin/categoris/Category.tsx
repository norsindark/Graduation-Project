import React, { useState } from 'react';
import { Table, Button, notification, Row, Col } from 'antd';
import CategoryNew from './CategoryNew';
import CategoryEdit from './CategoryEdit';

interface CategoryItem {
  key: string;
  name: string;
  description: string;
  children?: CategoryItem[];
}

const initialDataSource: CategoryItem[] = [
  {
    key: '1',
    name: 'Appetizers',
    description: 'Starters to begin your meal',
    children: [
      {
        key: '1-1',
        name: 'Salads',
        description: 'Fresh and healthy salads',
      },
      {
        key: '1-2',
        name: 'Soups',
        description: 'Warm and comforting soups',
      },
    ],
  },
  {
    key: '2',
    name: 'Main Course',
    description: 'Hearty and satisfying main dishes',
    children: [
      {
        key: '2-1',
        name: 'Pasta',
        description: 'Delicious pasta dishes',
      },
      {
        key: '2-2',
        name: 'Steak',
        description: 'Juicy and tender steaks',
      },
    ],
  },
  {
    key: '3',
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    children: [
      {
        key: '3-1',
        name: 'Cakes',
        description: 'Delectable cakes',
      },
      {
        key: '3-2',
        name: 'Ice Cream',
        description: 'Creamy and cold ice creams',
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
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
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
                  Edit
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
                  Delete
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
