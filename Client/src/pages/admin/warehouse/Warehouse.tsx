import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Row,
  Col,
  Card,
  Input,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import WarehouseNew from './WarehouseNew';
import WarehouseEdit from './WarehouseEdit';
import axios from 'axios';
import { callGetAllWarehouse } from '../../../services/serverApi';

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
  categoryName: string;
}

const Warehouse: React.FC = () => {
  const [dataSource, setDataSource] = useState<WarehouseItem[]>([]);
  const [showWarehouseNew, setShowWarehouseNew] = useState<boolean>(false);
  const [showWarehouseEdit, setShowWarehouseEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<WarehouseItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchItems();
  }, [currentPage, pageSize, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const query = `pageNo=${currentPage - 1}&pageSize=${pageSize}&searchTerm=${searchTerm}`;
      const response = await callGetAllWarehouse(query);
      if (response?.status === 200 && response.data._embedded?.warehouseResponseList) {
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
    notification.success({
      message: 'Item added successfully!',
      duration: 5,
    });
    fetchItems();
  };

  const handleEditSuccess = () => {
    setShowWarehouseEdit(false);
    setCurrentItem(null);
    notification.success({
      message: 'Item updated successfully!',
      duration: 5,
    });
    fetchItems();
  };

  const columns = [
    {
      title: 'Ingredient Name',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
      sorter: (a: WarehouseItem, b: WarehouseItem) => a.ingredientName.localeCompare(b.ingredientName), // Add sorting functionality
    },
    {
      title: 'Imported Quantity',
      dataIndex: 'importedQuantity',
      key: 'importedQuantity',
      sorter: (a: WarehouseItem, b: WarehouseItem) => a.importedQuantity - b.importedQuantity, // Add sorting functionality
    },
    {
      title: 'Available Quantity',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
      sorter: (a: WarehouseItem, b: WarehouseItem) => a.availableQuantity - b.availableQuantity, // Add sorting functionality
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a: WarehouseItem, b: WarehouseItem) => a.categoryName.localeCompare(b.categoryName), // Add sorting functionality
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      sorter: (a: WarehouseItem, b: WarehouseItem) => new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime(), // Add sorting functionality
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      sorter: (a: WarehouseItem, b: WarehouseItem) => a.supplierName.localeCompare(b.supplierName), // Add sorting functionality
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: WarehouseItem) => (
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Button type="primary" onClick={() => handleEdit(record)}>
              Edit
            </Button>
          </Col>
          <Col xs={24} sm={12}>
            <Button type="primary" danger onClick={() => handleDelete(record.warehouseId)}>
              Delete
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  const handleEdit = (item: WarehouseItem) => {
    setCurrentItem(item);
    setShowWarehouseEdit(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/warehouse-items/${id}`);
      notification.success({
        message: 'Item deleted successfully!',
        duration: 5,
      });
      fetchItems();
    } catch (error) {
      notification.error({
        message: 'Cannot delete the item',
        description: 'Please try again later.',
      });
    }
  };

  return (
    <div className="layout-content">
      <Card
        title="Warehouse Management"
        extra={
          !showWarehouseNew && !showWarehouseEdit && (
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Input.Search
                  value={searchTerm}
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onSearch={() => fetchItems()} // Perform search on Enter
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => setShowWarehouseNew(true)}
                  shape="round"
                  icon={<PlusOutlined />}
                >
                  Add New
                </Button>
              </Col>
            </Row>
          )
        }
      >
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
          />
        )}
      </Card>
    </div>
  );
};

export default Warehouse;
