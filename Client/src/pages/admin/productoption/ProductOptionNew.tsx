import React, { useState } from 'react';
import { Form, Input, Button, notification, Space } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { callAddNewDishOptionGroup } from '../../../services/serverApi';

interface ProductOptionNewProps {
  onAddSuccess: () => void;
  setShowCategoryNew: (value: boolean) => void;
}

const ProductOptionNew: React.FC<ProductOptionNewProps> = ({
  onAddSuccess,
  setShowCategoryNew,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { groupName, description, options } = values;

      const formattedOptions =
        options?.map((option: any) => ({
          optionName: option.name,
        })) || [];

      const response = await callAddNewDishOptionGroup(
        groupName,
        description,
        formattedOptions
      );
      if (response?.status === 200) {
        notification.success({
          message: 'Success!',
          description: 'Group option product created successfully.',
          duration: 5,
          showProgress: true,
        });
        onAddSuccess();
        setShowCategoryNew(false);
      } else {
        notification.error({
          message: 'Error creating group option product',
          description: response.data.errors?.error || 'Please try again later',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error creating group option product',
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
      <h4 className="text-center text-xl font-semibold mb-4">
        Create new group option product
      </h4>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Group name"
          name="groupName"
          className="font-medium"
          rules={[{ required: true, message: 'Please enter group name!' }]}
        >
          <Input placeholder="Group name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          className="font-medium"
        >
          <Input.TextArea rows={2} placeholder="Description" />
        </Form.Item>

        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              <label className="block text-lg font-medium mb-2">Option</label>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  className="mb-4 flex flex-wrap gap-4"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    className="flex-1"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter option name!',
                      },
                    ]}
                  >
                    <Input placeholder="Option name" />
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
                  className="w-full font-medium"
                >
                  Create option
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
            Save group option
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

export default ProductOptionNew;
