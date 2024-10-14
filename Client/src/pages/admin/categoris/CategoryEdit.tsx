import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Space, Switch } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { callUpdateCategory } from '../../../services/serverApi';

interface CategoryEditProps {
  currentCategory: any;
  onEditSuccess: () => void;
  setShowCategoryEdit: (value: boolean) => void;
}

const CategoryEdit: React.FC<CategoryEditProps> = ({
  currentCategory,
  onEditSuccess,
  setShowCategoryEdit,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      form.setFieldsValue({
        name: currentCategory.name,
        description: currentCategory.description,
        status: currentCategory.status === 'ACTIVE',
        subCategories: currentCategory.subCategories || [],
      });
    }
  }, [currentCategory, form]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { name, description, status, subCategories } = values;
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
      const payload = {
        id: currentCategory.id,
        name,
        slug,
        status: status ? 'ACTIVE' : 'INACTIVE',
        description,
        subCategories: subCategories.map((child: any) => ({
          id: child.id || undefined,
          name: child.name,
          slug: child.slug,
          status: child.status ? 'ACTIVE' : 'INACTIVE',
          description: child.description,
        })),
      };

      const response = await callUpdateCategory(payload);

      if (response?.status === 200) {
        notification.success({
          message: 'Update category successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
        setShowCategoryEdit(false);
      } else {
        notification.error({
          message: 'Update category failed',
          description:
            response.data.errors?.error ||
            'An error occurred while updating the category!',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error updating category',
        description: error.message,
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">Edit Category</h4>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          className="font-medium"
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter the category name!' },
          ]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>
        <Form.Item
          className="font-medium"
          label="Description"
          name="description"
        >
          <Input.TextArea rows={2} placeholder="Description" />
        </Form.Item>
        <Form.Item
          className="font-medium"
          label="Status"
          name="status"
          valuePropName="checked"
        >
          <Switch
            loading={isSubmit}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </Form.Item>
        <h4 className="text-center text-xl font-semibold mb-2">
          Create new subcategories
        </h4>
        <Form.List name="subCategories">
          {(fields, { add, remove }) => (
            <>
              <label className="block text-lg font-medium mb-2">
                Subcategories
              </label>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  className="mb-4 flex flex-wrap gap-4"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the subcategory name!',
                      },
                    ]}
                    className="flex-1"
                  >
                    <Input placeholder="Subcategory Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    className="flex-1"
                  >
                    <Input placeholder="Subcategory Description" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'status']}
                    valuePropName="checked"
                    className="flex-1"
                  >
                    <Switch
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                      defaultChecked
                    />
                  </Form.Item>
                  {/* <MinusCircleOutlined
                    onClick={() => remove(name)}
                    className="text-red-500"
                  /> */}
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="w-full font-medium"
                >
                  Create Subcategory
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            size="large"
            loading={isSubmit}
            className="w-full sm:w-auto"
            icon={<SaveOutlined />}
          >
            Save changes
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowCategoryEdit(false)}
            className="w-full sm:w-auto"
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CategoryEdit;
