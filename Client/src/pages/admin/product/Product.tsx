import React, { useState, useEffect } from 'react';
import { Table, Button, notification, Row, Col } from 'antd';
import ProductNew from './ProductNew';
import ProductEdit from './ProductEdit';
import axios from 'axios';

interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  ingredients: Ingredient[];
  preparationTime: number;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  image?: string; // Thêm trường image
}

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

const sampleData: ProductItem[] = [
  {
    id: 1,
    name: 'Phở bò',
    description: 'Phở bò truyền thống Hà Nội',
    price: 50000,
    ingredients: [
      { id: 1, name: 'Bánh phở', quantity: 200, unit: 'g' },
      { id: 2, name: 'Thịt bò', quantity: 100, unit: 'g' },
      { id: 3, name: 'Hành lá', quantity: 20, unit: 'g' },
    ],
    preparationTime: 15,
    allergens: ['Gluten', 'Bò'],
    nutritionalInfo: {
      calories: 450,
      protein: 25,
      carbs: 60,
      fat: 10,
    },
  },
  {
    id: 2,
    name: 'Bún chả',
    description: 'Bún chả Hà Nội',
    price: 45000,
    ingredients: [
      { id: 4, name: 'Bún', quantity: 150, unit: 'g' },
      { id: 5, name: 'Thịt lợn', quantity: 100, unit: 'g' },
      { id: 6, name: 'Nước mắm', quantity: 30, unit: 'ml' },
    ],
    preparationTime: 20,
    allergens: ['Cá', 'Thịt lợn'],
    nutritionalInfo: {
      calories: 500,
      protein: 30,
      carbs: 55,
      fat: 15,
    },
  },
];

interface ProductNewProps {
  onAddSuccess: () => void;
  setShowProductNew: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProductEditProps {
  currentItem: ProductItem;
  onEditSuccess: () => void;
  setShowProductEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const Product: React.FC = () => {
  const [dataSource, setDataSource] = useState<ProductItem[]>(sampleData);
  const [showProductNew, setShowProductNew] = useState<boolean>(false);
  const [showProductEdit, setShowProductEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Uncomment the following lines when you have a real API
      // const response = await axios.get('/api/products');
      // if (Array.isArray(response.data)) {
      //   setDataSource(response.data);
      // } else {
      //   console.error('Dữ liệu nhận được không phải là mảng:', response.data);
      //   setDataSource([]);
      // }

      // For now, we'll use the sample data
      setDataSource(sampleData);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
      notification.error({
        message: 'Không thể tải danh sách sản phẩm',
        duration: 5,
      });
    }
    setLoading(false);
  };

  const handleAddSuccess = () => {
    setShowProductNew(false);
    notification.success({
      message: 'Sản phẩm đã được thêm thành công!',
      duration: 5,
    });
    fetchItems();
  };

  const handleEditSuccess = () => {
    setShowProductEdit(false);
    setCurrentItem(null);
    notification.success({
      message: 'Sản phẩm đã được cập nhật thành công!',
      duration: 5,
    });
    fetchItems();
  };

  const handleEditClick = (item: ProductItem) => {
    setCurrentItem(item);
    setShowProductEdit(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await axios.delete(`/api/products/${id}`);
      notification.success({
        message: 'Sản phẩm đã được xóa thành công!',
        duration: 5,
      });
      fetchItems();
    } catch (error) {
      notification.error({
        message: 'Không thể xóa sản phẩm',
        duration: 5,
      });
    }
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img
          src={image}
          alt="Product"
          style={{ width: '50px', height: '50px' }}
        />
      ),
    },
    {
      title: 'Thời gian chuẩn bị',
      dataIndex: 'preparationTime',
      key: 'preparationTime',
      render: (time: number) => `${time} phút`,
    },
    {
      title: 'Thông tin dị ứng',
      dataIndex: 'allergens',
      key: 'allergens',
      render: (allergens: string[]) => allergens.join(', '),
    },
    {
      title: 'Thông tin dinh dưỡng',
      dataIndex: 'nutritionalInfo',
      key: 'nutritionalInfo',
      render: (info: any) => (
        <ul>
          <li>Calories: {info.calories}</li>
          <li>Protein: {info.protein}g</li>
          <li>Carbs: {info.carbs}g</li>
          <li>Fat: {info.fat}g</li>
        </ul>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: ProductItem) => (
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
              onClick={() => handleDeleteClick(record.id)}
            >
              Xóa
            </Button>
          </Col>
        </Row>
      ),
    },
  ];
  return (
    <div className="layout-content">
      <Row>
        <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}>
          {!showProductNew && !showProductEdit && (
            <Button
              type="primary"
              className="mb-3"
              onClick={() => setShowProductNew(true)}
              size="large"
              shape="round"
              block
            >
              Thêm sản phẩm mới
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          {showProductNew ? (
            <ProductNew
              onAddSuccess={handleAddSuccess}
              setShowProductNew={setShowProductNew}
            />
          ) : showProductEdit && currentItem ? (
            <ProductEdit
              currentItem={currentItem}
              onEditSuccess={handleEditSuccess}
              setShowProductEdit={setShowProductEdit}
            />
          ) : (
            <Table
              dataSource={dataSource}
              columns={columns}
              rowKey="id"
              loading={loading}
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

export default Product;
