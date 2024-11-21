import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  notification,
  Modal,
  Switch,
  Row,
  Col,
} from 'antd';
import { SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { callAddNewCategoryBlog } from '../../../services/serverApi';

interface CategoryNewProps {
  onAddSuccess: () => void;
  setShowCategoryBlogNew: (value: boolean) => void;
}

const CategoryBlogNew: React.FC<CategoryNewProps> = ({
  onAddSuccess,
  setShowCategoryBlogNew,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const { categoryBlogName, status, displayOrder } = values;
    console.log('status', status);
    setIsSubmit(true);
    try {
      const response = await callAddNewCategoryBlog(
        categoryBlogName,
        status,
        displayOrder
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Category has been created successfully',
          duration: 5,
          showProgress: true,
        });
        onAddSuccess();
        setShowCategoryBlogNew(false);
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
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">
        Create new category blog
      </h4>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'ACTIVE' }}
      >
        <Row gutter={16}>
          <Col md={24} sm={24}>
            <Form.Item
              label="Display order"
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
              onClick={() => setShowCategoryBlogNew(false)}
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

export default CategoryBlogNew;
