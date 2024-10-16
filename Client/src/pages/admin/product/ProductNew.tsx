import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  notification,
  Space,
  Row,
  Col,
  Modal,
  Slider,
} from 'antd';
import { Upload, message } from 'antd';
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  callAddNewDish,
  callGetAllCategoriesName,
  callGetAllIngredients,
  callGetAllOptionSelections,
} from '../../../services/serverApi';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '../../../utils/getCroppedImg';

const { Option } = Select;

interface ProductNewProps {
  onAddSuccess: () => void;
  setShowProductNew: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Dish {
  dishName: string;
  description: string;
  longDescription: string;
  status: string;
  thumbImage: File;
  images: File[];
  offerPrice: number;
  price: number;
  categoryId: string;
  recipes: RecipeDto[];
  optionSelections: OptionSelection[];
}

interface RecipeDto {
  warehouseId: string;
  quantityUsed: number;
  ingredientId: string;
  unit: string;
}

interface Category {
  categoryId: string;
  categoryName: string;
}

interface Ingredient {
  warehouseId: string;
  ingredientName: string;
  quantityUsed: number;
  unit: string;
}

interface OptionSelection {
  optionId: string;
  optionName: string;
  additionalPrice: number;
}

const ProductNew: React.FC<ProductNewProps> = ({
  onAddSuccess,
  setShowProductNew,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [optionSelectionList, setOptionSelectionList] = useState<
    OptionSelection[]
  >([]);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    const fetchCategoryList = async () => {
      const responseCategory = await callGetAllCategoriesName();
      setCategoryList(responseCategory.data);
    };
    fetchCategoryList();

    const fetchIngredientList = async () => {
      const responseIngredient = await callGetAllIngredients();

      setIngredientList(responseIngredient.data);
    };
    fetchIngredientList();

    const fetchOptionSelectionList = async () => {
      const responseOptionSelection = await callGetAllOptionSelections();
      setOptionSelectionList(responseOptionSelection.data);
    };
    fetchOptionSelectionList();
  }, []);

  const onFinish = async (values: Dish) => {
    console.log('values', values);
    setIsSubmit(true);
    const formData = new FormData();

    formData.append('dishName', values.dishName);
    formData.append('description', values.description);
    formData.append('longDescription', values.longDescription);
    formData.append('status', values.status);
    formData.append('offerPrice', values.offerPrice.toString());
    formData.append('price', values.price.toString());
    formData.append('categoryId', values.categoryId);

    if (values.thumbImage) {
      formData.append('thumbImage', values.thumbImage);
    }

    if (values.images && values.images.length > 0) {
      values.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    values.recipes.forEach((recipe, index, ingredientList) => {
      formData.append(`recipes[${index}].warehouseId`, recipe.ingredientId);
      formData.append(
        `recipes[${index}].quantityUsed`,
        recipe.quantityUsed.toString()
      );
      formData.append(`recipes[${index}].unit`, recipe.unit);
    });

    values.optionSelections.forEach((option, index) => {
      formData.append(`optionSelections[${index}].optionId`, option.optionId);
      formData.append(
        `optionSelections[${index}].additionalPrice`,
        option.additionalPrice.toString()
      );
    });

    try {
      const response = await callAddNewDish(formData);
      console.log('response', response);
      if (response.status === 200) {
        notification.success({
          message: 'Dish added successfully!',
          duration: 5,
          showProgress: true,
        });
        onAddSuccess();
        setShowProductNew(false);
      } else {
        notification.error({
          message: 'Error when adding new dish',
          description: response.data.errors?.error || 'Something went wrong',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error when adding new dish',
        description: error.message,
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [
        {
          font: [],
        },
      ],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['code-block'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
    'code-block',
  ];

  const handleImageUpload = (file: File, fieldName: string) => {
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setPreviewVisible(true);
    form.setFieldsValue({ [fieldName]: file });
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropCancel = () => {
    setPreviewVisible(false);
    setPreviewImage('');
  };

  const handleCropConfirm = async () => {
    if (previewImage && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(previewImage, croppedAreaPixels);
      form.setFieldsValue({ thumbImage: croppedImage });
      setPreviewVisible(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">
        Create new dish
      </h4>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="dishName"
              className="font-medium"
              label="Dish name"
              rules={[{ required: true, message: 'Please enter dish name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="description"
              label="Short description"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter short description!' },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {' '}
            <Form.Item
              name="price"
              label="Original price"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter original price!' },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {' '}
            <Form.Item
              name="offerPrice"
              label="Offer price"
              className="font-medium"
              // rules={[
              //   { required: true, message: 'Vui lòng nhập giá khuyến mãi!' },
              // ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="thumbImage"
              label="Thumbnail image"
              className="font-medium"
              rules={[
                { required: true, message: 'Please upload thumbnail image!' },
              ]}
            >
              <Upload
                name="thumbImage"
                listType="picture-card"
                maxCount={1}
                beforeUpload={(file) => {
                  const isJpgOrPng =
                    file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG files!');
                  } else {
                    handleImageUpload(file, 'thumbImage');
                  }
                  return false;
                }}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>{' '}
            <Form.Item
              name="images"
              label="Other images"
              className="font-medium"
            >
              <Upload
                name="images"
                listType="picture-card"
                maxCount={10}
                multiple
                beforeUpload={(file) => {
                  const isJpgOrPng =
                    file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG files!');
                  }
                  return isJpgOrPng;
                }}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label="Status"
              className="font-medium"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select>
                <Option value="AVAILABLE">Available</Option>
                <Option value="UNAVAILABLE">Unavailable</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="Category"
              className="font-medium"
              rules={[{ required: true, message: 'Please select category!' }]}
            >
              <Select>
                {categoryList.map((category) => (
                  <Option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.List
              name="recipes"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || value.length === 0) {
                      notification.error({
                        message: 'Error',
                        description: 'Please enter ingredients!',
                        duration: 5,
                        showProgress: true,
                      });
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  <label className="flex justify-center text-lg font-medium mb-2">
                    Ingredient
                  </label>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      align="baseline"
                      className="mb-4 flex items-center w-full"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'ingredientId']}
                        className="mb-0 flex-1"
                      >
                        <Select
                          placeholder="Select ingredient"
                          showSearch
                          style={{ width: '180px' }}
                          filterOption={(input, option) =>
                            !!(
                              (option?.label as string)
                                ?.toLowerCase()
                                .includes(input.toLowerCase()) ||
                              (option?.value as string)
                                ?.toLowerCase()
                                ?.includes(input.toLowerCase())
                            )
                          }
                        >
                          {ingredientList.map((ingredient) => (
                            <Option
                              key={ingredient.warehouseId}
                              value={ingredient.warehouseId}
                            >
                              {ingredient.ingredientName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantityUsed']}
                        className="mb-0 flex-1 mx-2 "
                      >
                        <InputNumber
                          min={0}
                          placeholder="Quantity used"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'unit']}
                        className="mb-0 flex-1"
                      >
                        <Select
                          placeholder="Select unit"
                          style={{ width: '150px' }}
                        >
                          <Option value="kg">Kilogram</Option>
                          <Option value="g">Gram</Option>
                          <Option value="l">Liter</Option>
                          <Option value="ml">Milliliter</Option>
                          <Option value="piece">Piece</Option>
                        </Select>
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="text-red-500 ml-2"
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      className="w-full font-medium"
                    >
                      Add ingredient
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>

          <Col xs={24} sm={12}>
            <Form.List
              name="optionSelections"
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || value.length === 0) {
                      setTimeout(() => {
                        notification.error({
                          message: 'Error',
                          description: 'Please enter option selection!',
                          duration: 5,
                          showProgress: true,
                        });
                      }, 800);
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  <label className="flex justify-center text-lg font-medium mb-2">
                    Option selection
                  </label>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      align="baseline"
                      className="mb-4 flex items-center justify-center w-full"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'optionId']}
                        className="mb-0 w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter option name!',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select option"
                          showSearch
                          style={{ width: '200px' }}
                          filterOption={(input, option) =>
                            !!(
                              (option?.label as string)
                                ?.toLowerCase()
                                .includes(input.toLowerCase()) ||
                              (option?.value as string)
                                ?.toLowerCase()
                                ?.includes(input.toLowerCase())
                            )
                          }
                        >
                          {optionSelectionList.map((option) => (
                            <Option
                              key={option.optionId}
                              value={option.optionId}
                            >
                              {option.optionName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'additionalPrice']}
                        className="mb-0 w-full mx-2"
                      >
                        <InputNumber
                          min={0}
                          style={{ width: '100%' }}
                          formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        className="text-red-500 ml-4"
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      className="w-full font-medium"
                    >
                      Add option selection
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              name="longDescription"
              label="Long description"
              className="font-medium"
              // rules={[
              //   { required: true, message: 'Vui lòng nhập mô tả chi tiết!' },
              // ]}
            >
              <ReactQuill
                className=" h-[250px] max-h-[1200px] w-full bg-white"
                theme="snow"
                modules={modules}
                formats={formats}
              />
            </Form.Item>
          </Col>
          <div className="flex flex-col sm:flex-row gap-2 mt-8">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmit}
                size="large"
                shape="round"
                className="w-full sm:w-auto"
                icon={<PlusOutlined />}
              >
                Create new
              </Button>
              <Button
                danger
                size="large"
                shape="round"
                onClick={() => setShowProductNew(false)}
                className="w-full sm:w-auto ml-4"
                icon={<CloseOutlined />}
              >
                Cancel
              </Button>
            </Form.Item>
          </div>
        </Row>
      </Form>
      <Modal
        open={previewVisible}
        title="Crop Image"
        onCancel={handleCropCancel}
        onOk={handleCropConfirm}
        okText="Confirm"
        cancelText="Cancel"
        width={450}
      >
        <div style={{ position: 'relative', width: '100%', height: 300 }}>
          <Cropper
            image={previewImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <Slider
          value={zoom}
          min={1}
          max={5}
          step={0.1}
          onChange={(value) => setZoom(value)}
        />
      </Modal>
    </>
  );
};

export default ProductNew;
