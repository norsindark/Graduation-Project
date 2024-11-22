import React, { useEffect, useState } from 'react';
import {
  callDeleteLocation,
  callGetLocationRestaurant,
} from '../../../services/serverApi';
import {
  Table,
  Space,
  Typography,
  notification,
  Button,
  Col,
  Row,
  Input,
  Upload,
  message,
  Popconfirm,
  Card,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import axios from 'axios';
const { Text } = Typography;
import LocationNew from './location/LocationNew';
import LocationEdit from './location/LocationEdit';

interface Location {
  id: string;
  street: string;
  commune: string;
  district: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  feePerKm: number;
  createdAt: string;
  updatedAt: string;
}

interface LogoSettings {
  currentLogo: string;
}

function Setting() {
  const [location, setLocation] = useState<Location | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<string>('location');
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    currentLogo: 'logo.png',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showLocationNew, setShowLocationNew] = useState<boolean>(false);
  const [showLocationEdit, setShowLocationEdit] = useState<boolean>(false);
  const fetchLocations = async (
    type: 'cities' | 'states' | 'communes',
    parentCode?: string
  ) => {
    const endpoints = {
      cities: 'https://api.mysupership.vn/v1/partner/areas/province',
      states: (provinceCode: string) =>
        `https://api.mysupership.vn/v1/partner/areas/district?province=${provinceCode}`,
      communes: (districtCode: string) =>
        `https://api.mysupership.vn/v1/partner/areas/commune?district=${districtCode}`,
    };

    try {
      const url =
        type === 'states' || type === 'communes'
          ? endpoints[type](parentCode || '')
          : endpoints[type];
      const response = await axios.get(url);
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const response = await callGetLocationRestaurant();

      if (response.status === 200) {
        setLocation(response.data);
      } else if (response.status === 400) {
        setLocation(null);
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch location',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingClick = (setting: string) => {
    setSelectedSetting(setting);
  };

  const handleEditClick = (record: Location) => {};

  const handleDeleteClick = async (id: string) => {
    try {
      const res = await callDeleteLocation(id);
      if (res?.status === 200) {
        notification.success({
          message: 'Location deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchLocation(); // Gọi lại fetchLocation để cập nhật dữ liệu sau khi xóa thành công
      } else if (res?.status === 400) {
        notification.error({
          message: 'Error deleting location.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error deleting location.',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting location.',
        duration: 5,
        showProgress: true,
      });
    }
  };

  const locationColumns: ColumnsType<Location> = [
    {
      title: 'Street',
      dataIndex: 'street',
      key: 'street',
      sorter: (a: Location, b: Location) => a.street.localeCompare(b.street),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a: Location, b: Location) => a.city.localeCompare(b.city),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      sorter: (a: Location, b: Location) => a.state.localeCompare(b.state),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a: Location, b: Location) => a.country.localeCompare(b.country),
    },
    {
      title: 'Fee Per Km',
      dataIndex: 'feePerKm',
      key: 'feePerKm',
      render: (fee) => `${fee.toLocaleString()} VNĐ`,
      sorter: (a: Location, b: Location) => a.feePerKm - b.feePerKm,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Location) => (
        <Space>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            onClick={() => {
              setShowLocationEdit(true);
              setLocation(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this location?"
            onConfirm={() => handleDeleteClick(record.id)}
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
      ),
    },
  ];

  const handleAddSuccess = () => {
    fetchLocation();
    setShowLocationNew(false);
  };

  const handleEditSuccess = () => {
    fetchLocation();
    setShowLocationEdit(false);
  };

  const renderSettingContent = () => {
    switch (selectedSetting) {
      // case 'logo':
      //   return (
      //     <div>
      //       <h2 className="text-xl font-semibold mb-2">Logo Settings</h2>
      //       <p>Current Logo: {logoSettings.currentLogo}</p>
      //       <Upload
      //         beforeUpload={() => false}
      //         onChange={(info) => {
      //           if (info.file.status !== 'uploading') {
      //             message.success(
      //               `${info.file.name} file uploaded successfully`
      //             );
      //             setLogoSettings({
      //               ...logoSettings,
      //               currentLogo: info.file.name,
      //             });
      //           }
      //         }}
      //       >
      //         <Button icon={<UploadOutlined />}>Click to Upload</Button>
      //       </Upload>
      //     </div>
      //   );
      case 'location':
        return (
          <div className="w-full">
            <Card
              title={
                !showLocationNew && (
                  <Row>
                    <Col span={19}>
                      <h2 className="text-xl font-semibold mb-2">
                        Restaurant Location
                      </h2>
                    </Col>
                    {/* Only show Add New Location button if no location exists */}
                    {!location && (
                      <Col span={4}>
                        <Button
                          type="primary"
                          shape="round"
                          className="mb-2 mr-2"
                          onClick={() => setShowLocationNew(true)}
                          icon={<PlusOutlined />}
                        >
                          Add New Location
                        </Button>
                      </Col>
                    )}
                  </Row>
                )
              }
            >
              {showLocationNew ? (
                <LocationNew
                  onAddSuccess={handleAddSuccess}
                  setShowAddressNew={setShowLocationNew}
                  fetchLocations={fetchLocations}
                />
              ) : showLocationEdit && location ? (
                <LocationEdit
                  currentLocation={location}
                  onEditSuccess={handleEditSuccess}
                  setShowLocationEdit={setShowLocationEdit}
                  fetchLocations={fetchLocations}
                />
              ) : (
                <Table
                  columns={locationColumns}
                  dataSource={location ? [location] : []}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  bordered
                  loading={loading}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                  }
                />
              )}
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="layout-content">
      <div className="container mx-auto p-4">
        <Row gutter={[16, 16]}>
          {[
            // 'logo',
            'location',
          ].map((setting) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={setting}>
              <Button
                type={selectedSetting === setting ? 'primary' : 'default'}
                className="mb-3"
                size="large"
                shape="round"
                block
                onClick={() => handleSettingClick(setting)}
              >
                {setting.charAt(0).toUpperCase() + setting.slice(1)}
              </Button>
            </Col>
          ))}
        </Row>

        <div className="flex">{renderSettingContent()}</div>
      </div>
    </div>
  );
}

export default Setting;
