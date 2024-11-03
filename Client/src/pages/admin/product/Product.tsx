import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Space,
  Tag,
  Image,
  Popconfirm,
  Card,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { callDeleteDish, callGetAllDishes } from '../../../services/serverApi';
import ProductNew from './ProductNew';
import ProductEdit from './ProductEdit';
import ProductDetail from './ProductDetail';

import { Dish } from './TypeProduct';

const Product: React.FC = () => {
  const [dataSource, setDataSource] = useState<Dish[]>([]);
  const [currentDish, setCurrentDish] = useState<Dish | null>(null);

  const [showProductNew, setShowProductNew] = useState(false);
  const [showProductEdit, setShowProductEdit] = useState(false);

  const [sortQuery, setSortQuery] = useState<string>('');
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [isDishDetailVisible, setIsDishDetailVisible] = useState(false);

  useEffect(() => {
    fetchDishes();
  }, [current, pageSize]);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=dishName&order=asc`;
      }
      const response = await callGetAllDishes(query);
      if (
        response.status === 200 &&
        response.data._embedded?.dishResponseList
      ) {
        setDataSource(response.data._embedded.dishResponseList);
        setTotal(response.data.page.totalElements);
        setCurrent(response.data.page.number + 1);
      } else {
        setDataSource([]);
        setTotal(0);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading list dishes',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    fetchDishes();
    setShowProductNew(false);
  };

  const handleEditClick = (record: Dish) => {
    setCurrentDish(record);
    setShowProductEdit(true);
  };

  const handleEditSuccess = () => {
    fetchDishes();
    setShowProductEdit(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await callDeleteDish(id);
      if (res?.status === 200) {
        notification.success({
          message: 'Dish deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchDishes();
      } else if (res?.status === 400) {
        notification.error({
          message: 'Error deleting dish: This dish has been used.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error deleting dish.',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting dish.',
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

  const handleViewDetail = (record: Dish) => {
    setSelectedDishId(record.dishId);
    setIsDishDetailVisible(true);
  };

  const columns = [
    {
      title: 'Dish name',
      dataIndex: 'dishName',
      key: 'dishName',
      sorter: (a: Dish, b: Dish) => a.dishName.localeCompare(b.dishName),
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbImage',
      key: 'thumbImage',
      render: (thumbImage: string) => <Image src={thumbImage} width={70} />,
    },
    {
      title: 'Original price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VNĐ`,
      sorter: (a: Dish, b: Dish) => a.price - b.price,
    },
    {
      title: 'Offer price',
      dataIndex: 'offerPrice',
      key: 'offerPrice',
      render: (offerPrice: number) =>
        offerPrice ? `${offerPrice.toLocaleString()} VNĐ` : 'N/A',
      sorter: (a: Dish, b: Dish) => a.offerPrice - b.offerPrice,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a: Dish, b: Dish) =>
        a.categoryName.localeCompare(b.categoryName),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'AVAILABLE' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Dish) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            shape="round"
            onClick={() => handleViewDetail(record)}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            shape="round"
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this dish?"
            onConfirm={() => handleDelete(record.dishId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              shape="round"
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
        title="Manage dishes"
        extra={
          !showProductNew &&
          !showProductEdit && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              shape="round"
              onClick={() => setShowProductNew(true)}
            >
              Create new dish
            </Button>
          )
        }
      >
        {showProductNew ? (
          <ProductNew
            onAddSuccess={handleAddSuccess}
            setShowProductNew={setShowProductNew}
          />
        ) : showProductEdit && currentDish ? (
          <ProductEdit
            currentDish={currentDish}
            onEditSuccess={handleEditSuccess}
            setShowProductEdit={setShowProductEdit}
          />
        ) : isDishDetailVisible && selectedDishId ? (
          <ProductDetail
            dishId={selectedDishId}
            visible={isDishDetailVisible}
            onClose={() => setIsDishDetailVisible(false)}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="dishId"
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

export default Product;
