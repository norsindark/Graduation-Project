import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  Switch,
  notification,
  message,
  Modal,
} from 'antd';
import { SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;
const { Option } = Select;

interface BlogNewProps {
  setShowBlogNew: (value: boolean) => void;
  onAddSuccess: () => void;
}

// Data mẫu cho danh mục
const categoryOptions = [
  { value: '1', label: 'Công Nghệ' },
  { value: '2', label: 'Lập Trình' },
  { value: '3', label: 'Đánh Giá' },
  { value: '4', label: 'Tin Tức' },
];

const BlogNew: React.FC<BlogNewProps> = ({ setShowBlogNew, onAddSuccess }) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [description, setDescription] = useState('');

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || '');
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => setPreviewVisible(false);

  const handleImageUpload = (file: File) => {
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
      const image = fileList[0]?.url || '';
      if (!image) {
        message.error('Vui lòng tải lên hình ảnh bài viết!');
        setIsSubmit(false);
        return;
      }

      const blogData = {
        ...values,
        image,
        description,
        createdAt: new Date().toISOString(),
        status: values.status ? 'PUBLISHED' : 'DRAFT',
      };

      console.log('Submitting:', blogData);

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notification.success({
        message: 'Thành công!',
        description: 'Bài viết đã được tạo thành công.',
        duration: 5,
      });

      onAddSuccess();
      setShowBlogNew(false);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi!',
        description: error.message || 'Đã xảy ra lỗi khi tạo bài viết.',
        duration: 5,
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">
        Tạo Bài Viết Mới
      </h4>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: true }}
        className="max-w-4xl mx-auto"
      >
        <Form.Item
          label="Hình ảnh bài viết"
          name="image"
          rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
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
              handleImageUpload(file);
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
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề!' },
            { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="categoryId"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select placeholder="Chọn danh mục">
            {categoryOptions.map((category) => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Nội dung" required>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            style={{ height: '200px', marginBottom: '50px' }}
          />
        </Form.Item>

        <Form.Item
          label="SEO Title"
          name="seoTitle"
          rules={[
            { required: true, message: 'Vui lòng nhập SEO title!' },
            { max: 60, message: 'SEO title không được vượt quá 60 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập SEO title" />
        </Form.Item>

        <Form.Item
          label="SEO Description"
          name="seoDescription"
          rules={[
            { required: true, message: 'Vui lòng nhập SEO description!' },
            {
              max: 160,
              message: 'SEO description không được vượt quá 160 ký tự!',
            },
          ]}
        >
          <TextArea
            placeholder="Nhập SEO description"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch checkedChildren="Xuất bản" unCheckedChildren="Bản nháp" />
        </Form.Item>

        <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            icon={<SaveOutlined />}
            size="large"
            className="w-full sm:w-auto"
          >
            Lưu Bài Viết
          </Button>
          <Button
            danger
            onClick={() => setShowBlogNew(false)}
            icon={<CloseOutlined />}
            size="large"
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </div>
      </Form>

      <Modal
        visible={previewVisible}
        title="Xem trước hình ảnh"
        footer={null}
        onCancel={handleCancelPreview}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default BlogNew;
