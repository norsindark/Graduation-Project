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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
const { Text } = Typography;

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

interface HeaderSettings {
  title: string;
  subtitle: string;
}

interface FolderSettings {
  uploadPath: string;
  maxSize: number;
}

interface LogoSettings {
  currentLogo: string;
}

function Setting() {
  const [location, setLocation] = useState<Location | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<string>('header');
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>({
    title: 'Restaurant Name',
    subtitle: 'Delicious Food',
  });
  const [folderSettings, setFolderSettings] = useState<FolderSettings>({
    uploadPath: '/uploads',
    maxSize: 10,
  });
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    currentLogo: 'logo.png',
  });
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleEditClick = (record: Location) => {
    console.log(record);
  };

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
            onClick={() => handleEditClick(record)}
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

  const renderSettingContent = () => {
    switch (selectedSetting) {
      //   case 'header':
      //     return (
      //       <div>
      //         <h2 className="text-xl font-semibold mb-2">Header Settings</h2>
      //         <Input
      //           placeholder="Title"
      //           value={headerSettings.title}
      //           onChange={(e) =>
      //             setHeaderSettings({ ...headerSettings, title: e.target.value })
      //           }
      //           className="mb-2"
      //         />
      //         <Input
      //           placeholder="Subtitle"
      //           value={headerSettings.subtitle}
      //           onChange={(e) =>
      //             setHeaderSettings({
      //               ...headerSettings,
      //               subtitle: e.target.value,
      //             })
      //           }
      //         />
      //       </div>
      //     );
      //   case 'folder':
      //     return (
      //       <div>
      //         <h2 className="text-xl font-semibold mb-2">Folder Settings</h2>
      //         <Input
      //           placeholder="Upload Path"
      //           value={folderSettings.uploadPath}
      //           onChange={(e) =>
      //             setFolderSettings({
      //               ...folderSettings,
      //               uploadPath: e.target.value,
      //             })
      //           }
      //           className="mb-2"
      //         />
      //         <Input
      //           type="number"
      //           placeholder="Max Size (MB)"
      //           value={folderSettings.maxSize}
      //           onChange={(e) =>
      //             setFolderSettings({
      //               ...folderSettings,
      //               maxSize: Number(e.target.value),
      //             })
      //           }
      //         />
      //       </div>
      //     );
      case 'logo':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Logo Settings</h2>
            <p>Current Logo: {logoSettings.currentLogo}</p>
            <Upload
              beforeUpload={() => false}
              onChange={(info) => {
                if (info.file.status !== 'uploading') {
                  message.success(
                    `${info.file.name} file uploaded successfully`
                  );
                  setLogoSettings({
                    ...logoSettings,
                    currentLogo: info.file.name,
                  });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
        );
      case 'location':
        return (
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-2">Restaurant Location</h2>
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
            // 'header',
            // 'folder',
            'logo',
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
