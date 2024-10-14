import React, { useState, useEffect } from 'react';
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
} from '../../../services/serverApi';

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
  thumbImage: string;
  images: Array<{
    imageFile: string;
  }>;
  offerPrice: number;
  price: number;
  categoryId: string;
  categoryName: string;
  recipes: Array<{
    ingredientId: string;
    ingredientName: string;
    quantityUsed: number;
    unit: string;
  }>;
  optionSelections: Array<{
    optionId: string;
    optionName: string;
    additionalPrice: number;
  }>;
}

interface Category {
  categoryId: string;
  categoryName: string;
}

interface Ingredient {
  ingredientId: string;
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
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    console.log('formData', formData);
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
                  }
                  return isJpgOrPng;
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
                <Option value="available">Available</Option>
                <Option value="unavailable">Unavailable</Option>
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
              name="ingredients"
              rules={[
                {
                  validator: (_, value) =>
                    value && value.length > 0
                      ? Promise.resolve()
                      : Promise.reject('Please enter ingredient!'),
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
                        name={[name, 'name']}
                        className="mb-0 flex-1"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter ingredient name!',
                          },
                        ]}
                      >
                        <Input placeholder="Ingredient name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantityUsed']}
                        className="mb-0 flex-1 mx-2"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter quantity used!',
                          },
                        ]}
                      >
                        <Input placeholder="Quantity used" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'unit']}
                        className="mb-0 flex-1"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter unit!',
                          },
                        ]}
                      >
                        <Input placeholder="Unit" />
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
                  validator: (_, value) =>
                    value && value.length > 0
                      ? Promise.resolve()
                      : Promise.reject('Please enter option selection!'),
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
                        name={[name, 'name']}
                        className="mb-0 w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter option name!',
                          },
                        ]}
                      >
                        <Input placeholder="Option name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'additionalPrice']}
                        className="mb-0 w-full mx-2"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter additional price!',
                          },
                        ]}
                      >
                        <Input placeholder="Additional price" />
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
                className=" h-[250px] w-full bg-white"
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
    </>
  );
};

export default ProductNew;
