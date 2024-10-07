import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Card,
  Space,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import WarehouseNew from './WarehouseNew';
import WarehouseEdit from './WarehouseEdit';
import {
  callDeleteWarehouse,
  callGetAllWarehouse,
} from '../../../services/serverApi';
import dayjs from 'dayjs';
import WarehouseInport from './data/WarehouseInport';

interface WarehouseItem {
  warehouseId: string;
  ingredientName: string;
  importedQuantity: number;
  availableQuantity: number;
  quantityUsed: number;
  unit: string;
  expiredDate: string;
  importedDate: string;
  importedPrice: number;
  supplierName: string;
  description: string;
  categoryId: string;
  categoryName: string;
}

const Warehouse: React.FC = () => {
  const [dataSource, setDataSource] = useState<WarehouseItem[]>([]);
  const [showWarehouseNew, setShowWarehouseNew] = useState<boolean>(false);
  const [showWarehouseEdit, setShowWarehouseEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<WarehouseItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [sortQuery, setSortQuery] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [openModalImportExcelWarehouse, setOpenModalImportExcelWarehouse] =
    useState<boolean>(false);

  useEffect(() => {
    fetchItemsWarehouse();
  }, [currentPage, pageSize, sortQuery]);

  const fetchItemsWarehouse = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${currentPage - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=importedDate&sortDir=desc`;
      }
      const response = await callGetAllWarehouse(query);
      if (
        response?.status === 200 &&
        response.data._embedded?.warehouseResponseList
      ) {
        const items = response.data._embedded.warehouseResponseList;
        setDataSource(items);
        setTotalItems(response.data.page.totalElements);
        setCurrentPage(response.data.page.number + 1);
      } else {
        setDataSource([]);
        setTotalItems(0);
      }
    } catch (error) {
      notification.error({
        message: 'Error loading warehouse list',
        description: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowWarehouseNew(false);
    fetchItemsWarehouse();
  };

  const columns = [
    {
      title: 'Ingredient Name',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        a.ingredientName.localeCompare(b.ingredientName), // Add sorting functionality
    },
    {
      title: 'Imported Quantity',
      dataIndex: 'importedQuantity',
      key: 'importedQuantity',
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        a.importedQuantity - b.importedQuantity, // Add sorting functionality
    },
    {
      title: 'Available Quantity',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        a.availableQuantity - b.availableQuantity, // Add sorting functionality
    },
    {
      title: 'Quantity Used',
      dataIndex: 'quantityUsed',
      key: 'quantityUsed',
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        a.quantityUsed - b.quantityUsed, // Add sorting functionality
    },
    {
      title: 'Imported Price',
      dataIndex: 'importedPrice',
      key: 'importedPrice',
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        a.importedPrice - b.importedPrice, // Add sorting functionality
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        a.categoryName.localeCompare(b.categoryName), // Add sorting functionality
    },
    {
      title: 'Imported Date',
      dataIndex: 'importedDate',
      key: 'importedDate',
      render: (importedDate: string) =>
        dayjs(importedDate).format('DD/MM/YYYY'),
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        new Date(a.importedDate).getTime() - new Date(b.importedDate).getTime(), // Add sorting functionality
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      render: (expiredDate: string) => dayjs(expiredDate).format('DD/MM/YYYY'),
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime(), // Add sorting functionality
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      sorter: (a: WarehouseItem, b: WarehouseItem) =>
        a.supplierName.localeCompare(b.supplierName), // Add sorting functionality
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: WarehouseItem) => (
        <Space
          size="small"
          className="flex justify-center items-center flex-col"
        >
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => handleDelete(record.warehouseId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
              loading={loading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditClick = (item: WarehouseItem) => {
    setCurrentItem(item);
    setShowWarehouseEdit(true);
  };
  const handleEditSuccess = () => {
    setShowWarehouseEdit(false);
    setCurrentItem(null);
    fetchItemsWarehouse();
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await callDeleteWarehouse(id);
      if (response?.status === 200) {
        notification.success({
          message: 'Item deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchItemsWarehouse();
      } else {
        notification.error({
          message: 'Cannot delete the item',
          description: response.data.errors?.error || 'Please try again later.',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Cannot delete the item',
        description:
          'An error occurred while deleting the item. Please try again.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (pagination: any, sortDir: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    if (sortDir && sortDir.field) {
      const order = sortDir.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`${sortDir.field},${order}`);
    } else {
      setSortQuery('');
    }
  };
  return (
    <div className="layout-content">
      <Card
        title="Warehouse Management"
        extra={
          !showWarehouseNew &&
          !showWarehouseEdit && (
            <Row
              gutter={[8, 8]}
              className="flex justify-center items-center flex-col	mt-4"
            >
              <Col span={24} md={24}>
                <Button
                  type="primary"
                  onClick={() => setShowWarehouseNew(true)}
                  shape="round"
                  icon={<PlusOutlined />}
                >
                  Create Item Warehouse
                </Button>
              </Col>
              <Col span={24} md={24}>
                <Button
                  type="primary"
                  shape="round"
                  icon={<UploadOutlined />}
                  className="mr-4"
                  onClick={() => setOpenModalImportExcelWarehouse(true)}
                >
                  Import Excel
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  icon={<DownloadOutlined />}
                  // onClick={() => setShowExportExcelWarehouse(true)}
                >
                  Export Excel
                </Button>
              </Col>
            </Row>
          )
        }
      >
        <WarehouseInport
          openModalImportExcelWarehouse={openModalImportExcelWarehouse}
          setOpenModalImportExcelWarehouse={setOpenModalImportExcelWarehouse}
          fetchItemsWarehouse={fetchItemsWarehouse}
        />

        {showWarehouseNew ? (
          <WarehouseNew
            onAddSuccess={handleAddSuccess}
            setShowWarehouseNew={setShowWarehouseNew}
          />
        ) : showWarehouseEdit && currentItem ? (
          <WarehouseEdit
            currentItem={currentItem}
            onEditSuccess={handleEditSuccess}
            setShowWarehouseEdit={setShowWarehouseEdit}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="warehouseId"
            loading={loading}
            onChange={onChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              onShowSizeChange: (_, size) => {
                setCurrentPage(1);
                setPageSize(size);
              },
              onChange: (page) => {
                setCurrentPage(page);
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

export default Warehouse;
