import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  notification,
  Switch,
  Upload,
  message,
  Modal,
} from 'antd';
import { SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface CategoryEditProps {
  currentCategory: {
    id: string;
    name: string;
    image: string;
    status: string;
    displayOrder: string;
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (currentCategory) {
      form.setFieldsValue({
        name: currentCategory.name,
        status: currentCategory.status === 'ACTIVE',
        displayOrder: currentCategory.displayOrder,
      });

      if (currentCategory.image) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: currentCategory.image,
          },
        ]);
      }
    }
  }, [currentCategory, form]);

  const validateDisplayOrder = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập thứ tự hiển thị!');
    }
    const number = parseInt(value);
    if (isNaN(number) || number < 1) {
      return Promise.reject('Thứ tự hiển thị phải là số dương!');
    }
    return Promise.resolve();
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || '');
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => setPreviewVisible(false);

  const handleThumbImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newFile: UploadFile = {
        uid: '-1',
        name: file.name,
        status: 'done',
        url: reader.result as string,
      };
      setFileList([newFile]);
    };
    reader.readAsDataURL(file);
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    try {
      const { name, status, displayOrder } = values;
      const thumbImage = fileList[0]?.url || '';

      if (!thumbImage) {
        message.error('Vui lòng tải lên hình ảnh danh mục!');
        setIsSubmit(false);
        return;
      }

      const updatedCategory = {
        id: currentCategory.id,
        name,
        status: status ? 'ACTIVE' : 'INACTIVE',
        displayOrder,
        image: thumbImage,
        updatedAt: new Date().toISOString(),
      };

      console.log('Updating:', updatedCategory);

      // Giả lập API call thành công
      notification.success({
        message: 'Thành công!',
        description: 'Cập nhật danh mục thành công.',
        duration: 5,
      });

      onEditSuccess();
      setShowCategoryBlogEdit(false);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi cập nhật',
        description: error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">
        Chỉnh Sửa Danh Mục Blog
      </h4>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="Thứ tự hiển thị"
          name="displayOrder"
          className="font-medium"
          rules={[{ validator: validateDisplayOrder }]}
        >
          <Input placeholder="Nhập thứ tự hiển thị" type="number" min={1} />
        </Form.Item>

        <Form.Item
          label="Hình ảnh danh mục"
          name="thumbImage"
          className="font-medium"
        >
          <Upload
            name="thumbImage"
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            beforeUpload={(file) => {
              const isJpgOrPng =
                file.type === 'image/jpeg' || file.type === 'image/png';
              if (!isJpgOrPng) {
                message.error('Chỉ chấp nhận file JPG/PNG!');
                return false;
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error('Hình ảnh phải nhỏ hơn 2MB!');
                return false;
              }
              handleThumbImageUpload(file);
              return false;
            }}
            onPreview={handlePreview}
            onRemove={() => setFileList([])}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Tên danh mục"
          name="name"
          className="font-medium"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { min: 3, message: 'Tên danh mục phải có ít nhất 3 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          valuePropName="checked"
          className="font-medium"
        >
          <Switch
            loading={isSubmit}
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        </Form.Item>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            shape="round"
            size="large"
            className="w-full sm:w-auto"
            icon={<SaveOutlined />}
          >
            Lưu Thay Đổi
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowCategoryBlogEdit(false)}
            className="w-full sm:w-auto"
            icon={<CloseOutlined />}
          >
            Hủy
          </Button>
        </div>
      </Form>

      <Modal
        visible={previewVisible}
        title="Xem trước"
        footer={null}
        onCancel={handleCancelPreview}
      >
        <img
          alt="Xem trước hình ảnh"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default CategoryBlogEdit;
