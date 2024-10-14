import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Image, Carousel, Table, Spin, Tag } from 'antd';
import { callGetDishById } from '../../../services/serverApi';

interface DishDetailProps {
  dishId: string;
  visible: boolean;
  onClose: () => void;
}

interface DishImage {
  imageId: string;
  imageUrl: string;
}

interface Recipe {
  warehouseId: string;
  ingredientName: string;
  quantityUsed: number;
  unit: string;
  recipeId: string;
}
interface Option {
  optionSelectionId: string;
  optionName: string;
  additionalPrice: number;
}

interface OptionGroup {
  optionGroupId: string;
  optionGroupName: string;
  options: Option[];
}

interface Dish {
  dishId: string;
  dishName: string;
  description: string;
  longDescription: string;
  status: string;
  thumbImage: string;
  offerPrice: number;
  price: number;
  categoryId: string;
  categoryName: string;
  images: DishImage[];
  recipes: Recipe[];
  listOptions: OptionGroup[];
}

const ProductDetail: React.FC<DishDetailProps> = ({
  dishId,
  visible,
  onClose,
}) => {
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (visible) {
      fetchDishDetail();
    }
  }, [visible, dishId]);

  const fetchDishDetail = async () => {
    setLoading(true);
    try {
      const response = await callGetDishById(dishId);
      if (response.status === 200) {
        setDish(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error fetching dish details:', error);
    } finally {
      setLoading(false);
    }
  };

  const recipeColumns = [
    {
      title: 'Ingredient',
      dataIndex: 'ingredientName',
      key: 'ingredientName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantityUsed',
      key: 'quantityUsed',
      render: (text: number) => text.toLocaleString(),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
  ];

  const descriptionColumns = [
    {
      title: 'ThumbImage',
      dataIndex: 'thumbImage',
      key: 'thumbImage',

      render: (thumbImage: string) => (
        <Image
          className="flex justify-center items-center flex-row"
          src={thumbImage}
          width={90}
          height={90}
        />
      ),
    },
    {
      title: 'dishImages',
      dataIndex: 'images',
      key: 'images',
      className: 'flex justify-center items-center ',
      render: (dishImages: DishImage[]) => (
        <div className="flex justify-center items-center flex-row gap-4">
          {dishImages.map((image, index) => (
            <Image key={index} src={image.imageUrl} width={100} height={100} />
          ))}
        </div>
      ),
    },
    {
      title: 'List Options',
      dataIndex: 'listOptions',
      key: 'listOptions',
      render: (listOptions: OptionGroup[]) => (
        <div className="flex flex-col gap-2">
          {listOptions.map((group, groupIndex) => (
            <div key={group.optionGroupId}>
              <strong className="text-base">{group.optionGroupName}:</strong>
              <div className="ml-4 ">
                {group.options.map((option, optionIndex) => (
                  <div key={option.optionSelectionId}>
                    <Tag color="blue">
                      {option.optionName} -{' '}
                      {option.additionalPrice.toLocaleString()} đ
                    </Tag>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const renderLongDescriptionColumn = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Long Description',
      dataIndex: 'longDescription',
      key: 'longDescription',
      render: (longDescription: string) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>{longDescription}</div>
      ),
    },
  ];

  return (
    <Modal
      title="Dish Detail"
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={null}
      centered
    >
      {loading ? (
        <Spin tip="Loading dish detail..." />
      ) : dish ? (
        <>
          <h4 className="text-center text-xl font-semibold mb-4">
            Dish Information
          </h4>
          {dish.images.length > 0 ? (
            <Table
              dataSource={[dish]}
              columns={descriptionColumns}
              rowKey="dishId"
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
              bordered
            />
          ) : (
            <p>No image.</p>
          )}
          <h4 className="text-center text-xl font-semibold mb-4 mt-2">
            Description
          </h4>
          {dish.description && (
            <Table
              dataSource={[dish]}
              columns={renderLongDescriptionColumn}
              rowKey="dishId"
              pagination={false}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
              bordered
            />
          )}
          <h4 className="text-center text-xl font-semibold mb-4 mt-2">
            Recipe
          </h4>
          {dish.recipes.length > 0 ? (
            <Table
              dataSource={dish.recipes}
              columns={recipeColumns}
              rowKey="recipeId"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                onShowSizeChange: (_, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                },
              }}
              scroll={{ x: 'max-content' }}
              bordered
              rowClassName={(_, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
            />
          ) : (
            <p>No recipe.</p>
          )}
        </>
      ) : (
        <p>No dish.</p>
      )}
    </Modal>
  );
};

export default ProductDetail;
