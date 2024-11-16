import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Drawer,
  Row,
  Col,
  Typography,
  Avatar,
  Tag,
} from 'antd';
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import ProductOfferDailyNew from './ProductOfferDailyNew';
import ProductOfferDailyEdit from './ProductOfferDailyEdit';
import {
  callGetAllProductOfferDaily,
  callGetOfferById,
  callDeleteOffers,
} from '../../../services/serverApi';

import dayjs from 'dayjs';
import { ColumnType, TableRowSelection } from 'antd/es/table/interface';
interface OfferItem {
  id: string;
  offerType: string;
  discountPercentage: number;
  availableQuantityOffer: number;
  startDate: string;
  endDate: string;
  dish: {
    dishId: string;
    dishName: string;
    status: string;
    thumbImage: string;
    offerPrice: number;
    price: number;
    categoryName: string;
  };
}

interface DishDetail {
  id: string;
  offerType: string;
  discountPercentage: number;
  availableQuantityOffer: number;
  startDate: string;
  endDate: string;
  dish: {
    dishId: string;
    dishName: string;
    availableQuantity: number;
    slug: string;
    description: string;
    longDescription: string;
    status: string;
    thumbImage: string;
    offerPrice: number;
    price: number;
    categoryId: string;
    categoryName: string;
    images: string[] | null;
    recipes: any[] | null;
    listOptions: any[] | null;
  };
}

const ProductOfferDaily: React.FC = () => {
  const [listOffers, setListOffers] = useState<OfferItem[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const [filter, setFilter] = useState('');
  const [sortQuery, setSortQuery] = useState('');

  const [showOfferNew, setShowOfferNew] = useState<boolean>(false);
  const [showOfferEdit, setShowOfferEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<OfferItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [showDishDetail, setShowDishDetail] = useState<boolean>(false);
  const [dishDetail, setDishDetail] = useState<DishDetail | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    fetchItems();
  }, [current, pageSize, filter, sortQuery, refreshKey]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=createdAt&sortDir=desc`;
      }

      const response = await callGetAllProductOfferDaily(query);
      if (response?.status === 200) {
        const offerList = response?.data?._embedded?.offerResponseList || [];

        if (offerList.length === 0 && current > 1) {
          setCurrent((prev) => prev - 1);
          return;
        }

        setListOffers(offerList);
        setTotal(response.data.page.totalElements);
      } else {
        setListOffers([]);
        setTotal(0);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error during loading data!',
        duration: 5,
        showProgress: true,
      });
      setListOffers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowOfferNew(false);
    fetchItems();
  };

  const handleEditSuccess = () => {
    setShowOfferEdit(false);
    setCurrentItem(null);
    fetchItems();
  };

  const handleEditClick = (item: OfferItem) => {
    setCurrentItem(item);
    setShowOfferEdit(true);
  };

  const handleDeleteMultipleOffers = async () => {
    if (!selectedRowKeys.length) {
      notification.warning({
        message: 'Warning',
        description: 'Please select offers to delete!',
        duration: 5,
        showProgress: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await callDeleteOffers(selectedRowKeys);
      if (res?.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Selected offers deleted successfully!',
          duration: 5,
          showProgress: true,
        });

        setSelectedRowKeys([]);

        if (listOffers.length === selectedRowKeys.length) {
          if (current > 1) {
            setCurrent((prev) => prev - 1);
          } else {
            setRefreshKey((prev) => prev + 1);
          }
        } else {
          setRefreshKey((prev) => prev + 1);
        }
      } else {
        notification.error({
          message: 'Error',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error during delete process!',
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

  const handleDetailClick = async (id: string) => {
    setLoading(true);
    try {
      const response = await callGetOfferById(id);
      if (response.status === 200) {
        setDishDetail(response.data);
        setShowDishDetail(true);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Error during loading data!',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderOfferDetail = () => {
    if (!dishDetail) return null;

    return (
      <Drawer
        title={<Typography.Title level={4}>Offer Detail</Typography.Title>}
        width={720}
        placement="right"
        onClose={() => setShowDishDetail(false)}
        open={showDishDetail}
      >
        <div style={{ padding: '20px 0' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card>
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <img
                      alt={dishDetail.dish.dishName}
                      src={dishDetail.dish.thumbImage}
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  </Col>
                  <Col span={16}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {dishDetail.dish.dishName}
                    </Typography.Title>
                    <Tag color="blue" style={{ marginTop: 8 }}>
                      {dishDetail.dish.categoryName}
                    </Tag>
                    <Tag color="warning" style={{ marginTop: 8 }}>
                      Dish code: {dishDetail.dish.dishId}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={12}>
              <Table
                pagination={false}
                dataSource={[
                  {
                    key: '1',
                    label: 'Offer type',
                    value: dishDetail.offerType,
                  },
                  {
                    key: '2',
                    label: 'Discount percentage',
                    value: (
                      <Tag color="red">{dishDetail.discountPercentage}%</Tag>
                    ),
                  },
                  {
                    key: '3',
                    label: 'Available quantity',
                    value: (
                      <Tag color="green">
                        {dishDetail.availableQuantityOffer}
                      </Tag>
                    ),
                  },
                  {
                    key: '4',
                    label: 'Original price',
                    value: (
                      <Typography.Text delete type="danger">
                        {dishDetail.dish.price}
                      </Typography.Text>
                    ),
                  },
                ]}
                columns={[
                  {
                    title: 'Information',
                    dataIndex: 'label',
                    key: 'label',
                    width: '40%',
                    render: (text) => (
                      <Typography.Text strong>{text}</Typography.Text>
                    ),
                  },
                  {
                    title: 'Detail',
                    dataIndex: 'value',
                    key: 'value',
                  },
                ]}
                bordered
                size="small"
              />
            </Col>

            <Col span={12}>
              <Table
                pagination={false}
                dataSource={[
                  {
                    key: '5',
                    label: 'Offer price',
                    value: (
                      <Typography.Text type="success" strong>
                        {dishDetail.dish.offerPrice}
                      </Typography.Text>
                    ),
                  },
                  {
                    key: '6',
                    label: 'Start date',
                    value: dayjs(dishDetail.startDate).format('DD-MM-YYYY'),
                  },
                  {
                    key: '7',
                    label: 'End date',
                    value: dayjs(dishDetail.endDate).format('DD-MM-YYYY'),
                  },
                  {
                    key: '8',
                    label: 'Description',
                    value: dishDetail.dish.description,
                  },
                ]}
                columns={[
                  {
                    title: 'Information',
                    dataIndex: 'label',
                    key: 'label',
                    width: '40%',
                    render: (text) => (
                      <Typography.Text strong>{text}</Typography.Text>
                    ),
                  },
                  {
                    title: 'Detail',
                    dataIndex: 'value',
                    key: 'value',
                  },
                ]}
                bordered
                size="small"
              />
            </Col>

            {dishDetail.dish.images && dishDetail.dish.images.length > 0 && (
              <Col span={24}>
                <Typography.Title level={5}>Other images</Typography.Title>
                <Row gutter={[8, 8]}>
                  {dishDetail.dish.images.map((image, index) => (
                    <Col span={6} key={index}>
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        style={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
            )}
          </Row>
        </div>
      </Drawer>
    );
  };

  const columns = [
    {
      title: 'Dish',
      dataIndex: ['dish', 'dishName'],
      key: 'dishName',
      render: (text: string, record: OfferItem) => (
        <Space>
          <Avatar src={record.dish.thumbImage} />
          <span>{text}</span>
        </Space>
      ),
      sorter: (a: OfferItem, b: OfferItem) =>
        a.dish.dishName.localeCompare(b.dish.dishName),
    },
    {
      title: 'Category',
      dataIndex: ['dish', 'categoryName'],
      key: 'categoryName',
      sorter: (a: OfferItem, b: OfferItem) =>
        a.dish.categoryName.localeCompare(b.dish.categoryName),
    },
    {
      title: 'Discount percentage',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (value: number) => `${value}%`,
      sorter: (a: OfferItem, b: OfferItem) =>
        a.discountPercentage - b.discountPercentage,
    },
    {
      title: 'Available quantity',
      dataIndex: 'availableQuantityOffer',
      key: 'availableQuantityOffer',
      sorter: (a: OfferItem, b: OfferItem) =>
        a.availableQuantityOffer - b.availableQuantityOffer,
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value: string) => dayjs(value).format('DD-MM-YYYY'),
      sorter: (a: OfferItem, b: OfferItem) =>
        dayjs(a.startDate).diff(dayjs(b.startDate)),
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (value: string) => dayjs(value).format('DD-MM-YYYY'),
      sorter: (a: OfferItem, b: OfferItem) =>
        dayjs(a.endDate).diff(dayjs(b.endDate)),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: OfferItem) => (
        <Space size="small">
          <Button
            type="default"
            shape="round"
            icon={<EyeOutlined />}
            onClick={() => handleDetailClick(record.id)}
          >
            View
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: string[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: OfferItem) => ({
      disabled: loading,
    }),
  };

  return (
    <div className="layout-content">
      <Card
        title="Manage daily offers"
        extra={
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Delete selected offers"
                description={`Are you sure to delete ${selectedRowKeys.length} selected offers?`}
                onConfirm={handleDeleteMultipleOffers}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  shape="round"
                  danger
                  icon={<DeleteOutlined />}
                >
                  Delete Selected ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            {!showOfferNew && !showOfferEdit && (
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                onClick={() => setShowOfferNew(true)}
              >
                Create new offer
              </Button>
            )}
          </Space>
        }
      >
        {showOfferNew ? (
          <ProductOfferDailyNew
            onAddSuccess={handleAddSuccess}
            setShowOfferNew={setShowOfferNew}
          />
        ) : showOfferEdit && currentItem ? (
          <ProductOfferDailyEdit
            currentItem={currentItem}
            onEditSuccess={handleEditSuccess}
            setShowOfferEdit={setShowOfferEdit}
          />
        ) : (
          <Table
            rowSelection={rowSelection as TableRowSelection<OfferItem>}
            dataSource={listOffers}
            rowKey="id"
            columns={columns as ColumnType<OfferItem>[]}
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
      {renderOfferDetail()}
    </div>
  );
};

export default ProductOfferDaily;
