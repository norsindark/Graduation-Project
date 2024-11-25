import React, { useState, useEffect, Children } from 'react';
import { Table, Button, notification, Card, Space, Popconfirm } from 'antd';
import ProductOptionNew from './ProductOptionNew';
import ProductOptionEdit from './ProductOptionEdit';
import {
  callGetAllDishOptionGroup,
  callDeleteDishOptionGroup,
  callDeleteDishOption,
} from '../../../services/serverApi';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface DishOptionItem {
  optionId: string;
  optionName: string;
}

interface DishOptionGroupItem {
  groupId: string;
  groupName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  options: DishOptionItem[];
  displayOrder?: string;
  children?: DishOptionGroupItem[];
}

const ProductOption: React.FC = () => {
  const [dataSource, setDataSource] = useState<DishOptionGroupItem[]>([]);
  const [showCategoryNew, setShowCategoryNew] = useState<boolean>(false);
  const [showCategoryEdit, setShowCategoryEdit] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] =
    useState<DishOptionGroupItem | null>(null);
  const [sortQuery, setSortQuery] = useState<string>('');
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProductOptions();
  }, [current, pageSize]);

  const fetchProductOptions = async () => {
    setLoading(true);
    try {
      let query = `pageNo=${current - 1}&pageSize=${pageSize}`;
      if (sortQuery) {
        query += `&sortBy=${sortQuery}`;
      } else {
        query += `&sortBy=groupName&sortDir=asc`;
      }
      const response = await callGetAllDishOptionGroup(query);
      if (
        response?.status === 200 &&
        response.data._embedded?.dishOptionGroupResponseList
      ) {
        const dishOptionGroups =
          response.data._embedded.dishOptionGroupResponseList;
        setDataSource(buildProductOptionTree(dishOptionGroups));
        setTotal(response.data.page.totalElements);
        setCurrent(response.data.page.number + 1);
      } else {
        setDataSource([]);
        setTotal(0);
      }
    } catch {
      notification.error({
        message: 'Error loading list group option products',
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const buildProductOptionTree = (
    dishOptionGroups: DishOptionGroupItem[]
  ): DishOptionGroupItem[] => {
    let rootOrder = 1;

    const assignDisplayOrder = (
      group: DishOptionGroupItem,
      parentOrder: string = ''
    ) => {
      if (!group.displayOrder) {
        group.displayOrder = parentOrder
          ? `${parentOrder}-${rootOrder++}`
          : `${rootOrder++}`;
      }

      if (group.options && group.options.length > 0) {
        group.children = group.options.map((option, index) => ({
          groupId: option.optionId,
          groupName: option.optionName,
          description: '',
          createdAt: '',
          updatedAt: '',
          options: [],
          displayOrder: `${group.displayOrder}-${index + 1}`,
        }));
      } else {
        group.children = undefined;
      }
    };

    dishOptionGroups.forEach((group) => assignDisplayOrder(group));

    return dishOptionGroups;
  };

  const handleAddSuccess = () => {
    fetchProductOptions();
    setShowCategoryNew(false);
  };

  const handleEditClick = (record: DishOptionGroupItem) => {
    setCurrentCategory(record);
    setShowCategoryEdit(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const res = await callDeleteDishOptionGroup(id);

      if (res?.status === 200) {
        notification.success({
          message: 'Group option product deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchProductOptions();
      } else if (res?.status === 400) {
        notification.error({
          message:
            'Error deleting group option product: This group has subcategories.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error deleting group option product.',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting group option product.',
        duration: 5,
        showProgress: true,
      });
    }
  };
  const handleDeleteClickOption = async (id: string) => {
    try {
      const res = await callDeleteDishOption(id);
      if (res?.status === 200) {
        notification.success({
          message: 'Option product deleted successfully!',
          duration: 5,
          showProgress: true,
        });
        fetchProductOptions();
      } else if (res?.status === 400) {
        notification.error({
          message:
            'Error deleting option product: This option has subcategories.',
          duration: 5,
          showProgress: true,
        });
      } else {
        notification.error({
          message: 'Error deleting option product.',
          description: res.data.errors?.error || 'Error during delete process!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error deleting option product.',
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

  const columns = [
    {
      title: 'Display order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      render: (displayOrder: string) => displayOrder,
      sorter: (a: DishOptionGroupItem, b: DishOptionGroupItem) =>
        a.displayOrder!.localeCompare(b.displayOrder!),
    },
    {
      title: 'Group name',
      dataIndex: 'groupName',
      key: 'groupName',
      sorter: (a: DishOptionGroupItem, b: DishOptionGroupItem) =>
        a.groupName.localeCompare(b.groupName),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) =>
        description ? description : 'No description',
    },
    {
      title: 'Action',
      key: 'actions',
      render: (_: any, record: DishOptionGroupItem) => {
        const isChildOption = record.displayOrder?.includes('-');
        const isOption = !Array.isArray(record.options) || isChildOption;

        return (
          <Space>
            {!isOption && (
              <Button
                type="primary"
                shape="round"
                icon={<EditOutlined />}
                onClick={() => handleEditClick(record)}
              >
                Edit
              </Button>
            )}
            <Popconfirm
              title={
                isOption
                  ? 'Delete this option product?'
                  : 'Delete this group option product?'
              }
              onConfirm={() =>
                isOption
                  ? handleDeleteClickOption(record.groupId)
                  : handleDeleteClick(record.groupId)
              }
            >
              <Button
                type="primary"
                danger
                shape="round"
                icon={<DeleteOutlined />}
              >
                {isOption ? 'Delete Option' : 'Delete'}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="layout-content">
      <Card
        title="Manage group option products"
        extra={
          !showCategoryNew &&
          !showCategoryEdit && (
            <Button
              type="primary"
              onClick={() => setShowCategoryNew(true)}
              shape="round"
              icon={<PlusOutlined />}
            >
              Create new group option product
            </Button>
          )
        }
      >
        {showCategoryNew ? (
          <ProductOptionNew
            onAddSuccess={handleAddSuccess}
            setShowCategoryNew={setShowCategoryNew}
          />
        ) : showCategoryEdit && currentCategory ? (
          <ProductOptionEdit
            currentCategory={currentCategory}
            onEditSuccess={() => fetchProductOptions()}
            setShowCategoryEdit={setShowCategoryEdit}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="groupId"
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
              onChange: (page) => {
                setCurrent(page);
              },
            }}
            scroll={{ x: 'max-content' }}
            bordered
            expandable={{ childrenColumnName: 'children' }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        )}
      </Card>
    </div>
  );
};

export default ProductOption;
