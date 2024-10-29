import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Space } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { callUpdateDishOptionGroup } from '../../../services/serverApi';

interface ProductOptionEditProps {
  currentCategory: any;
  onEditSuccess: () => void;
  setShowCategoryEdit: (value: boolean) => void;
}

interface OptionItem {
  dishOptionId?: string;
  optionName: string;
}

const ProductOptionEdit: React.FC<ProductOptionEditProps> = ({
  currentCategory,
  onEditSuccess,
  setShowCategoryEdit,
}) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      form.setFieldsValue({
        groupName: currentCategory.groupName,
        description: currentCategory.description,
        options: currentCategory.options.map((option: any) => ({
          dishOptionId: option.optionId,
          optionName: option.optionName,
        })),
      });
    }
  }, [currentCategory, form]);

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { groupName, description, options } = values;
      const formattedOptions = options.map((option: OptionItem) => ({
        dishOptionId: option.dishOptionId,
        optionName: option.optionName,
      }));

      const response = await callUpdateDishOptionGroup(
        currentCategory.groupId,
        groupName,
        description,
        formattedOptions
      );

      if (response?.status === 200) {
        notification.success({
          message: 'Product option group updated successfully!',
          duration: 5,
          showProgress: true,
        });
        onEditSuccess();
        setShowCategoryEdit(false);
      } else {
        notification.error({
          message: 'Error updating group option product',
          description: response?.data.errors?.error || 'Please try again later',
          duration: 5,
          showProgress: true,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error updating group option product',
        description: error.message || 'An error occurred while updating!',
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
        Edit group option product
      </h4>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          className="font-medium"
          label="Tên nhóm"
          name="groupName"
          rules={[{ required: true, message: 'Please enter group name!' }]}
        >
          <Input placeholder="Group name" />
        </Form.Item>
        <Form.Item
          className="font-medium"
          label="Description"
          name="description"
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
                    name={[name, 'optionName']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter option name!',
                      },
                    ]}
                    className="flex-1"
                  >
                    <Input placeholder="Option name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'dishOptionId']}
                    hidden
                  >
                    <Input />
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

export default ProductOptionEdit;
