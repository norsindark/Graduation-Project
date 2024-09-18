import React, { useState } from 'react';
import { Form, Input, Button, notification, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface CategoryNewProps {
  onAddSuccess: () => void;
  setShowCategoryNew: (value: boolean) => void;
}

const CategoryNew: React.FC<CategoryNewProps> = ({
  onAddSuccess,
  setShowCategoryNew,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      // Call API to add category with values including children
      // const response = await callAddCategory(values);
      // Mock response
      const response = { status: 200 };
      if (response.status === 200) {
        notification.success({
          message: 'Category created successfully!',
          duration: 5,
        });
        onAddSuccess();
      } else {
        notification.error({
          message: 'Category creation failed',
          description: 'Something went wrong!',
          duration: 5,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error creating category',
        description: error.message,
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow rounded-md">
      <h4 className="text-center text-xl font-semibold mb-4">
        Create New Category
      </h4>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          className="font-medium"
          label="Category Name"
          name="name"
          rules={[
            { required: true, message: 'Please input the category name!' },
          ]}
        >
          <Input className="" placeholder="Category Name" />
        </Form.Item>
        <Form.Item
          className="font-medium"
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
            Save Category
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowCategoryNew(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CategoryNew;
