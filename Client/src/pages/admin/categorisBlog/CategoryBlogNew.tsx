import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  notification,
  Upload,
  Modal,
  Switch,
  message,
} from 'antd';
import { SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';

interface CategoryNewProps {
  onAddSuccess: () => void;
  setShowCategoryBlogNew: (value: boolean) => void;
}

const CategoryBlogNew: React.FC<CategoryNewProps> = ({
  onAddSuccess,
  setShowCategoryBlogNew,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();

  const handleThumbImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileList([
        {
          uid: '-1',
          name: file.name,
          status: 'done',
          url: reader.result as string,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => setPreviewVisible(false);

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

      // Giả lập API call
      const newCategory = {
        id: Date.now().toString(),
        name,
        status: status ? 'ACTIVE' : 'INACTIVE',
        displayOrder,
        image: thumbImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Submitting:', newCategory);

      notification.success({
        message: 'Thành công!',
        description: 'Danh mục đã được tạo thành công.',
        duration: 5,
      });

      onAddSuccess();
      setShowCategoryBlogNew(false);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi khi tạo danh mục',
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
        Tạo Danh Mục Blog Mới
      </h4>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: true }}
      >
        <Form.Item
          label="Thứ tự hiển thị"
          name="displayOrder"
          className="font-medium"
          rules={[{ validator: validateDisplayOrder }]}
        >
          <Input placeholder="Nhập thứ tự hiển thị" type="number" min={1} />
        </Form.Item>

        <Form.Item
          name="thumbImage"
          label="Hình ảnh danh mục"
          className="font-medium"
          rules={[
            { required: true, message: 'Vui lòng tải lên hình ảnh danh mục!' },
          ]}
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
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
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
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        </Form.Item>

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
            Lưu Danh Mục
          </Button>
          <Button
            danger
            size="large"
            shape="round"
            onClick={() => setShowCategoryBlogNew(false)}
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

export default CategoryBlogNew;
