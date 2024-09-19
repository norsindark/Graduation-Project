import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  notification,
  Row,
  Col,
  Modal,
  Input,
  InputNumber,
} from 'antd';
import WarehouseNew from './WarehouseNew';
import WarehouseEdit from './WarehouseEdit';
import axios from 'axios';
import moment from 'moment';

interface WarehouseItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  minThreshold: number;
  expirationDate: string;
  supplier: string;
}

interface InventoryLog {
  id: number;
  itemId: number;
  type: 'import' | 'export';
  quantity: number;
  date: string;
}

const sampleData: WarehouseItem[] = [
  {
    id: 1,
    name: 'Gạo',
    quantity: 1000,
    unit: 'kg',
    category: 'Thực phẩm',
    minThreshold: 100,
    expirationDate: moment().add(6, 'months').format('YYYY-MM-DD'),
    supplier: 'Công ty A',
  },
  {
    id: 2,
    name: 'Dầu ăn',
    quantity: 500,
    unit: 'lít',
    category: 'Thực phẩm',
    minThreshold: 50,
    expirationDate: moment().add(1, 'year').format('YYYY-MM-DD'),
    supplier: 'Công ty B',
  },
  // ... thêm các mặt hàng mẫu khác nếu cần
];

const Warehouse: React.FC = () => {
  const [dataSource, setDataSource] = useState<WarehouseItem[]>(sampleData);
  const [showWarehouseNew, setShowWarehouseNew] = useState<boolean>(false);
  const [showWarehouseEdit, setShowWarehouseEdit] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<WarehouseItem | null>(null);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importExportQuantity, setImportExportQuantity] = useState(1);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      // Uncomment the following lines when you have a real API
      // const response = await axios.get('/api/warehouse-items');
      // if (Array.isArray(response.data)) {
      //   setDataSource(response.data);
      // } else {
      //   console.error('Dữ liệu nhận được không phải là mảng:', response.data);
      //   setDataSource([]);
      // }

      // For now, we'll use the sample data
      setDataSource(sampleData);
    } catch (error) {
      console.error('Lỗi khi tải danh sách mặt hàng:', error);
      notification.error({
        message: 'Không thể tải danh sách mặt hàng',
        duration: 5,
      });
    }
    setLoading(false);
  };

  const handleAddSuccess = () => {
    setShowWarehouseNew(false);
    notification.success({
      message: 'Mặt hàng đã được thêm thành công!',
      duration: 5,
    });
    fetchItems();
  };

  const handleEditSuccess = () => {
    setShowWarehouseEdit(false);
    setCurrentItem(null);
    notification.success({
      message: 'Mặt hàng đã được cập nhật thành công!',
      duration: 5,
    });
    fetchItems();
  };

  const handleEditClick = (item: WarehouseItem) => {
    setCurrentItem(item);
    setShowWarehouseEdit(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await axios.delete(`/api/warehouse-items/${id}`);
      notification.success({
        message: 'Mặt hàng đã được xóa thành công!',
        duration: 5,
      });
      fetchItems();
    } catch (error) {
      notification.error({
        message: 'Không thể xóa mặt hàng',
        duration: 5,
      });
    }
  };

  const handleImport = async (item: WarehouseItem, quantity: number) => {
    try {
      const updatedItem = { ...item, quantity: item.quantity + quantity };
      await axios.put(`/api/warehouse-items/${item.id}`, updatedItem);
      addInventoryLog(item.id, 'import', quantity);
      notification.success({
        message: 'Nhập kho thành công!',
        duration: 5,
      });
      fetchItems();
    } catch (error) {
      notification.error({
        message: 'Lỗi khi nhập kho',
        duration: 5,
      });
    }
  };

  const handleExport = async (item: WarehouseItem, quantity: number) => {
    if (item.quantity < quantity) {
      notification.error({
        message: 'Số lượng xuất kho vượt quá số lượng hiện có',
        duration: 5,
      });
      return;
    }
    try {
      const updatedItem = { ...item, quantity: item.quantity - quantity };
      await axios.put(`/api/warehouse-items/${item.id}`, updatedItem);
      addInventoryLog(item.id, 'export', quantity);
      notification.success({
        message: 'Xuất kho thành công!',
        duration: 5,
      });
      fetchItems();
    } catch (error) {
      notification.error({
        message: 'Lỗi khi xuất kho',
        duration: 5,
      });
    }
  };

  const addInventoryLog = async (
    itemId: number,
    type: 'import' | 'export',
    quantity: number
  ) => {
    const newLog: Omit<InventoryLog, 'id'> = {
      itemId,
      type,
      quantity,
      date: new Date().toISOString(),
    };
    try {
      await axios.post('/api/inventory-logs', newLog);
      setInventoryLogs([...inventoryLogs, { ...newLog, id: Date.now() }]);
    } catch (error) {
      console.error('Lỗi khi thêm log:', error);
    }
  };

  const handleViewInventoryLog = async (itemId: number) => {
    try {
      const response = await axios.get(`/api/inventory-logs/${itemId}`);
      const itemLogs = response.data;
      Modal.info({
        title: 'Lịch sử nhập/xuất kho',
        content: (
          <Table
            dataSource={itemLogs}
            columns={[
              { title: 'Loại', dataIndex: 'type', key: 'type' },
              { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
              { title: 'Ngày', dataIndex: 'date', key: 'date' },
            ]}
            pagination={false}
          />
        ),
        width: 600,
      });
    } catch (error) {
      notification.error({
        message: 'Không thể tải lịch sử nhập/xuất kho',
        duration: 5,
      });
    }
  };

  const filteredDataSource = dataSource.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    {
      title: 'Ngưỡng tối thiểu',
      dataIndex: 'minThreshold',
      key: 'minThreshold',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
    },
    { title: 'Nhà cung cấp', dataIndex: 'supplier', key: 'supplier' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: WarehouseItem) => (
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
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Button
              type="default"
              shape="round"
              block
              onClick={() => handleViewInventoryLog(record.id)}
            >
              Xem lịch sử
            </Button>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Button
              type="default"
              shape="round"
              block
              onClick={() => handleImport(record, importExportQuantity)}
            >
              Nhập kho
            </Button>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
            <Button
              type="default"
              shape="round"
              block
              onClick={() => handleExport(record, importExportQuantity)}
            >
              Xuất kho
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Input
            placeholder="Tìm kiếm mặt hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <InputNumber
            min={1}
            value={importExportQuantity}
            onChange={(value) => setImportExportQuantity(value as number)}
            placeholder="Số lượng nhập/xuất"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          {!showWarehouseNew && !showWarehouseEdit && (
            <Button
              type="primary"
              onClick={() => setShowWarehouseNew(true)}
              size="large"
              shape="round"
              block
            >
              Thêm mặt hàng mới
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col span={24}>
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
              dataSource={filteredDataSource}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                total: filteredDataSource.length,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Warehouse;
