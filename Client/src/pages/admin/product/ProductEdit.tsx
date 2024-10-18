import {
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Upload,
  Select,
  notification,
  Space,
  message,
  Modal,
} from 'antd';

import { Button } from 'antd';
import { Category, Dish, Ingredient, OptionSelection } from './TypeProduct';
import { useCallback, useEffect, useState } from 'react';
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CloseOutlined } from '@ant-design/icons';
import { formats, modules } from '../../../utils/config-reactquill';
import {
  callGetAllCategoriesName,
  callGetAllIngredients,
  callGetAllOptionSelections,
  callUpdateDish,
} from '../../../services/serverApi';
import { RcFile, UploadFile } from 'antd/es/upload';
const { Option } = Select;

interface ProductEditProps {
  currentDish: Dish;
  onEditSuccess: () => void;
  setShowProductEdit: (showProductEdit: boolean) => void;
}

const ProductEdit: React.FC<ProductEditProps> = ({
  currentDish,
  onEditSuccess,
  setShowProductEdit,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [optionSelectionList, setOptionSelectionList] = useState<
    OptionSelection[]
  >([]);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    const fetchList = async () => {
      const [responseCategory, responseIngredient, responseOptionSelection] =
        await Promise.all([
          callGetAllCategoriesName(),
          callGetAllIngredients(),
          callGetAllOptionSelections(),
        ]);

      setCategoryList(responseCategory.data);
      setIngredientList(responseIngredient.data);
      setOptionSelectionList(responseOptionSelection.data);
      console.log('optionSelectionList', optionSelectionList);
      if (currentDish) {
        form.setFieldsValue({
          dishName: currentDish.dishName,
          description: currentDish.description,
          price: currentDish.price,
          offerPrice: currentDish.offerPrice,
          status: currentDish.status,
          categoryId: currentDish.categoryId,
          recipes: currentDish.recipes.map((recipe) => ({
            ingredientId: recipe.warehouseId,
            quantityUsed: recipe.quantityUsed,
            unit: recipe.unit,
          })),
          thumbImage: currentDish.thumbImage
            ? [
                {
                  uid: '-1',
                  name: 'thumbImage.png',
                  status: 'done',
                  url: currentDish.thumbImage,
                },
              ]
            : [],
          images:
            currentDish.images?.map((img: any, index: number) => ({
              uid: `-${index + 2}`,
              name: `image${index + 1}.png`,
              status: 'done',
              url: img.imageUrl,
            })) || [],
          optionSelections: currentDish.listOptions[0]?.options.map(
            (option) => ({
              optionId: option.optionName, // Store the ID
              optionName: option.optionName, // Store the name for display
              additionalPrice: option.additionalPrice,
            })
          ),
          longDescription: currentDish.longDescription,
        });
      }
    };
    fetchList();
  }, [form, currentDish]);
  console.log('currentDish', currentDish);
  const onFinish = async (values: any) => {
    const {
      thumbImage,
      images,
      dishName,
      description,
      longDescription,
      status,
      offerPrice,
      price,
      categoryId,
      recipes,
      optionSelections,
    } = values;
    console.log('values', values);
    setIsSubmit(true);
    const formData = new FormData();

    formData.append('dishId', currentDish.dishId);

    formData.append('dishName', dishName);
    formData.append('description', description);
    formData.append('longDescription', longDescription);
    formData.append('status', status);
    formData.append('offerPrice', offerPrice.toString());
    formData.append('price', price.toString());
    formData.append('categoryId', categoryId);
    if (thumbImage && thumbImage.fileList && thumbImage.fileList.length > 0) {
      const thumbImageFile = thumbImage.fileList[0].originFileObj;
      if (thumbImageFile) {
        formData.append('thumbImage', thumbImageFile);
      }
    }

    if (images && Array.isArray(images)) {
      images.forEach((file: any, index: number) => {
        if (file.originFileObj) {
          formData.append(`images[${index}].imageFile`, file.originFileObj);
        }
      });
    }

    recipes.forEach((recipe: any, index: number) => {
      formData.append(`recipes[${index}].warehouseId`, recipe.ingredientId);
      formData.append(
        `recipes[${index}].quantityUsed`,
        recipe.quantityUsed.toString()
      );
      formData.append(`recipes[${index}].unit`, recipe.unit);
    });

    optionSelections.forEach((option: any, index: number) => {
      formData.append(`optionSelections[${index}].optionId`, option.optionId);
      formData.append(
        `optionSelections[${index}].additionalPrice`,
        option.additionalPrice.toString()
      );
    });

    try {
      const response = await callUpdateDish(formData);
      if (response.status === 200) {
        notification.success({
          message: 'Dish updated successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
        setShowProductEdit(false);
      } else {
        notification.error({
          message: 'Error updating dish',
          description: response.data.errors?.error || 'Something went wrong',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error updating dish',
        description: error.message,
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const normFile = useCallback((e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e && e.fileList) {
      return e.fileList.map((file: any) => ({
        ...file,
        originFileObj: file.originFileObj || file,
      }));
    }
    return [];
  }, []);

  const handleThumbImageUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
    const previewUrl = URL.createObjectURL(file);
    const thumbImageFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      url: previewUrl,
      originFileObj: file,
    };

    form.setFieldsValue({
      thumbImage: {
        file: thumbImageFile,
        fileList: [thumbImageFile],
      },
    });
    return false;
  };

  const handleImagesOtherUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
    const currentFileList = form.getFieldValue('images') || [];

    const isFileAlreadyExist = currentFileList.some(
      (existingFile: any) =>
        existingFile.uid === file.uid || existingFile.name === file.name
    );

    if (!isFileAlreadyExist) {
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: URL.createObjectURL(file),
        originFileObj: file,
      };
      const newFileList = [...currentFileList, newFile];
      form.setFieldsValue({ images: newFileList });
    }

    return false;
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

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
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: 'Please upload thumbnail image!' },
              ]}
            >
              <Upload
                name="thumbImage"
                listType="picture-card"
                maxCount={1}
                fileList={form.getFieldValue('thumbImage') || []}
                beforeUpload={(file) => {
                  const isJpgOrPng =
                    file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG files!');
                  } else {
                    handleThumbImageUpload(file);
                  }
                  return false;
                }}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
                onPreview={handlePreview}
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
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="images"
                listType="picture-card"
                maxCount={10}
                multiple
                fileList={form.getFieldValue('images') || []}
                beforeUpload={(file) => {
                  const isJpgOrPng =
                    file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG files!');
                    return false;
                  }
                  handleImagesOtherUpload(file);
                  return false;
                }}
                onChange={({ fileList }) => {
                  const updatedFileList = fileList.map((file) => ({
                    ...file,
                    status: 'done',
                  }));
                  form.setFieldsValue({ images: updatedFileList });
                }}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
                onPreview={handlePreview}
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
                            message: 'Please select an option!',
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
                              value={option.optionId} // Use ID as value
                              label={option.optionName} // Use name as label
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
                onClick={() => setShowProductEdit(false)}
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
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        width={800}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ProductEdit;
