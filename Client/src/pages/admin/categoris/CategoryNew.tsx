import React, { useState } from 'react';
import { Form, Input, Button, notification, Space, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { callAddNewCategory } from '../../../services/serverApi';

interface CategoryNewProps {
  onAddSuccess: () => void;
  setShowCategoryNew: (value: boolean) => void;
}

interface SubCategory {
  name: string;
  description: string;
  status: string;
}

const CategoryNew: React.FC<CategoryNewProps> = ({
  onAddSuccess,
  setShowCategoryNew,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { name, description, status, subCategories } = values;

      const formattedSubCategories: SubCategory[] = subCategories?.map((child: any) => ({
        name: child.name,
        description: child.description,
        status: child.status ? 'ACTIVE' : 'INACTIVE',
      })) || [];
      const categoryStatus = status ? 'ACTIVE' : 'INACTIVE';

      await callAddNewCategory(
        name,
        name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        categoryStatus,
        null,
        description,
        formattedSubCategories
      );

      notification.success({
        message: 'Success!',
        description: 'The category has been created successfully.',
      });

      onAddSuccess();
      setShowCategoryNew(false);
    } catch (error: any) {
      notification.error({
        message: 'Error while creating category',
        description: error.message,
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">Create New Category</h4>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: true }}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: 'Please input the category name!' }]}
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
        <Form.Item label="Status" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
        </Form.Item>

        <Form.List name="subCategories">
          {(fields, { add, remove }) => (
            <>
              <label className="block text-lg font-medium mb-2">Subcategories</label>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" className="mb-4 flex flex-wrap gap-4">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    className="flex-1"
                    rules={[{ required: true, message: 'Please input the subcategory name!' }]}
                  >
                    <Input placeholder="Subcategory Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    className="flex-1"
                    rules={[{ required: true, message: 'Please input the subcategory description!' }]}
                  >
                    <Input placeholder="Subcategory Description" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'status']} valuePropName="checked" className="flex-1">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500" />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} className="w-full">
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
            icon={<SaveOutlined />}
          >
            Save Category
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowCategoryNew(false)}
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

export default CategoryNew;