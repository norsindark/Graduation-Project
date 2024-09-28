import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Space, Switch } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  callUpdateCategory,
  callAddNewCategory,
} from '../../../services/serverApi';

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
        children: currentCategory.children || [],
      });
    }
  }, [currentCategory, form]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { name, description, status, children } = values;
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

      const response = await callUpdateCategory(
        currentCategory.id,
        name,
        slug,
        status ? 'ACTIVE' : 'INACTIVE',
        currentCategory.parentId,
        description
      );

      if (response?.status === 200) {
        notification.success({
          message: 'Update category successfully!',
          duration: 5,
          showProgress: true,
        });

        if (children && children.length > 0) {
          for (const child of children) {
            if (!child.id) {
              const childSlug = child.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-');

              await callAddNewCategory(
                child.name,
                childSlug,
                status ? 'ACTIVE' : 'INACTIVE',
                currentCategory.id,
                child.description
              );
            }
          }
        }
        onEditSuccess();
        setShowCategoryEdit(false);
      } else {
        notification.error({
          message: 'Update category failed',
          description: 'An error occurred while updating the category!',
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
          label="Tên danh mục"
          name="name"
          rules={[
            { required: true, message: 'Please enter the category name!' },
          ]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>
        <Form.Item
          className="font-medium"
          label="Mô tả"
          name="description"
          // rules={[{ required: true, message: 'Please enter the description!' }]}
        >
          <Input.TextArea rows={2} placeholder="Mô tả" />
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
        <Form.List name="children">
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
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please enter the subcategory description!',
                    //   },
                    // ]}
                    className="flex-1"
                  >
                    <Input placeholder="Subcategory Description" />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    className="text-red-500"
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  className="w-full"
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
