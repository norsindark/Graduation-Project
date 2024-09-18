import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
        children: currentCategory.children || [],
      });
    }
  }, [currentCategory, form]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      // Call API to update category
      // const response = await callEditCategory(currentCategory.key, values);
      // Mock response
      const response = { status: 200 };
      if (response.status === 200) {
        notification.success({
          message: 'Category updated successfully!',
          duration: 5,
        });
        onEditSuccess();
      } else {
        notification.error({
          message: 'Category update failed',
          description: 'Something went wrong!',
          duration: 5,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error updating category',
        description: error.message,
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow rounded-md">
      <h4 className="text-center text-xl font-semibold mb-4">Edit Category</h4>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: 'Please input the category name!' },
          ]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea rows={2} placeholder="Description" />
        </Form.Item>

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
                        message: 'Please input the subcategory name!',
                      },
                    ]}
                    className="flex-1"
                  >
                    <Input placeholder="Subcategory Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    rules={[
                      {
                        required: true,
                        message: 'Please input the subcategory description!',
                      },
                    ]}
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
                  Add Subcategory
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
          >
            Save Changes
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowCategoryEdit(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CategoryEdit;
