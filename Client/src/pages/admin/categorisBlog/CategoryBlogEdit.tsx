import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Switch, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { callUpdateCategoryBlog } from '../../../services/serverApi';

interface CategoryEditProps {
  currentCategory: {
    categoryBlogId: string;
    categoryName: string;
    slug: string;
    status: string;
    displayOrder: number;
    createdDate: string;
    updatedDate: string;
  };
  onEditSuccess: () => void;
  setShowCategoryBlogEdit: (value: boolean) => void;
}

const CategoryBlogEdit: React.FC<CategoryEditProps> = ({
  currentCategory,
  onEditSuccess,
  setShowCategoryBlogEdit,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      form.setFieldsValue({
        categoryBlogName: currentCategory.categoryName,
        status: currentCategory.status === 'ACTIVE',
        displayOrder: currentCategory.displayOrder,
      });
    }
  }, [currentCategory, form]);

  const onFinish = async (values: any) => {
    const { categoryBlogName, status, displayOrder } = values;
    setIsSubmit(true);
    try {
      const response = await callUpdateCategoryBlog(
        currentCategory.categoryBlogId,
        categoryBlogName,
        status ? 'ACTIVE' : 'INACTIVE',
        displayOrder
      );

      if (response?.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Update category successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
        setShowCategoryBlogEdit(false);
      } else {
        notification.error({
          message: 'Error',
          description:
            response.data.errors?.error ||
            'An error occurred. Please try again.',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message || 'An error occurred. Please try again.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">
        Edit Category Blog
      </h4>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Row gutter={16}>
          <Col md={24} sm={24}>
            <Form.Item
              label="Display Order"
              name="displayOrder"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter display order!' },
              ]}
            >
              <Input placeholder="Enter display order" type="number" min={1} />
            </Form.Item>
            <Form.Item
              label="Category name"
              name="categoryBlogName"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter category name!' },
                {
                  min: 3,
                  message: 'Category name must be at least 3 characters!',
                },
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              valuePropName="checked"
              className="font-medium"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
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
              Save
            </Button>
            <Button
              danger
              size="large"
              shape="round"
              onClick={() => setShowCategoryBlogEdit(false)}
              className="w-full sm:w-auto"
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
          </div>
        </Row>
      </Form>
    </>
  );
};

export default CategoryBlogEdit;
