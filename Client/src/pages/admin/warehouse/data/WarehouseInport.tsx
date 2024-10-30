import { Modal, notification, Table, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import {
  callGetAllCategoriesName,
  callImportExcelWarehouse,
} from '../../../../services/serverApi';
import templateFile from './template.xlsx?url';

const { Dragger } = Upload;

interface WarehouseImportProps {
  openModalImportExcelWarehouse: boolean;
  setOpenModalImportExcelWarehouse: (value: boolean) => void;
  fetchItemsWarehouse: () => void;
}

interface Category {
  categoryId: string;
  categoryName: string;
}

const WarehouseImport = (props: WarehouseImportProps) => {
  const {
    openModalImportExcelWarehouse,
    setOpenModalImportExcelWarehouse,
    fetchItemsWarehouse,
  } = props;

  const [dataExcel, setDataExcel] = useState<any[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  useEffect(() => {
    const fetchCategoryList = async () => {
      const responseCategory = await callGetAllCategoriesName();
      setCategoryList(responseCategory.data);
    };
    fetchCategoryList();
  }, []);

  const propsUpload: UploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 1,
    accept:
      '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    customRequest: dummyRequest,
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          if (file) {
            setUploadedFile(file);
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function () {
              const data = new Uint8Array(reader.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: 'array' });
              const sheet = workbook.Sheets[workbook.SheetNames[0]];
              const json = XLSX.utils.sheet_to_json(sheet, {
                header: [
                  'ingredientName',
                  'importedQuantity',
                  'unit',
                  'expiredDate',
                  'importedDate',
                  'importedPrice',
                  'supplierName',
                  'description',
                  'categoryName',
                ],
                range: 1,
              });
              if (json && json.length > 0) {
                setDataExcel(json);
                setTotalItems(json.length);
              }
            };
          }
        }
        notification.success({
          message: `${info.file.name} Uploaded successfully!`,
          duration: 5,
          showProgress: true,
        });
      } else if (status === 'error') {
        notification.error({
          message: `${info.file.name} Upload failed!`,
          duration: 5,
          showProgress: true,
        });
      }
    },
    onDrop(e: any) {
      
    },
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      notification.error({
        message: 'Please select a file before uploading',
        duration: 5,
        showProgress: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);

    setLoading(true);
    try {
      const res = await callImportExcelWarehouse(formData);
      if (res.status === 200) {
        notification.success({
          message: 'Import data successfully',
          duration: 5,
          showProgress: true,
        });
        setDataExcel([]);
        setUploadedFile(null);
        setOpenModalImportExcelWarehouse(false);
        fetchItemsWarehouse();
      } else {
        notification.error({
          message: 'Error in importing data',
          description: res.data.errors?.error || 'Error in importing data',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        description: 'Error in importing data',
        message: 'Error in importing data',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ingredient Name',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
      sorter: (a: any, b: any) =>
        a.ingredientName.localeCompare(b.ingredientName),
    },
    {
      title: 'Imported Quantity',
      dataIndex: 'importedQuantity',
      key: 'importedQuantity',
      sorter: (a: any, b: any) => a.importedQuantity - b.importedQuantity,
    },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    {
      title: 'Expired Date',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      sorter: (a: any, b: any) =>
        new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime(),
    },
    {
      title: 'Imported Date',
      dataIndex: 'importedDate',
      key: 'importedDate',
      sorter: (a: any, b: any) =>
        new Date(a.importedDate).getTime() - new Date(b.importedDate).getTime(),
    },
    {
      title: 'Imported Price',
      dataIndex: 'importedPrice',
      key: 'importedPrice',
      sorter: (a: any, b: any) => a.importedPrice - b.importedPrice,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      sorter: (a: any, b: any) => a.supplierName.localeCompare(b.supplierName),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a: any, b: any) => a.categoryName.localeCompare(b.categoryName),
      render: (text: string) => {
        const category = categoryList.find(
          (category) => category.categoryId === text
        );
        return category ? category.categoryName : 'Not found';
      },
    },
  ];

  return (
    <Modal
      title={
        <span className="font-medium text-xl text-center">
          Import warehouse data
        </span>
      }
      centered
      width={'90vw'}
      open={openModalImportExcelWarehouse}
      onOk={handleSubmit}
      onCancel={() => {
        setOpenModalImportExcelWarehouse(false);
        setDataExcel([]);
        setUploadedFile(null);
      }}
      closeIcon={
        <div className="fp__menu_cart_header">
          <span
            className="close_cart-client"
            onClick={() => setOpenModalImportExcelWarehouse(false)}
          >
            <i className="fal fa-times"></i>
          </span>
        </div>
      }
      okText="Import data"
      okButtonProps={{ disabled: dataExcel.length < 1 }}
      maskClosable={false}
    >
      <Dragger {...propsUpload} showUploadList={dataExcel.length > 0}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file here to upload</p>
        <p className="ant-upload-hint">
          Support uploading a single file. Only accept .csv, .xls, .xlsx or
          &nbsp;{' '}
          <a
            className="font-medium"
            onClick={(e) => e.stopPropagation()}
            href={templateFile}
            download
          >
            Download template
          </a>
        </p>
      </Dragger>
      <div style={{ paddingTop: 20 }}>
        <Table
          dataSource={dataExcel}
          title={() => <span className="font-medium">Uploaded data:</span>}
          columns={columns}
          rowKey={(record) => record.ingredientName}
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
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: 'max-content' }}
          bordered
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </div>
    </Modal>
  );
};

export default WarehouseImport;
