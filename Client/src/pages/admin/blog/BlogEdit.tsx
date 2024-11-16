import React, { useState, useEffect } from 'react';
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
  Row,
  Col,
} from 'antd';
import { SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { RcFile } from 'antd/es/upload';

const { TextArea } = Input;
const { Option } = Select;

interface BlogEditProps {
  currentBlog: {
    id: string;
    title: string;
    image: string;
    category: string;
    author: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    createdAt: string;
    description: string;
    seoTitle?: string;
    seoDescription?: string;
  };
  setShowBlogEdit: (value: boolean) => void;
  onEditSuccess: () => void;
}

// Data mẫu cho danh mục (giống BlogNew)
const categoryOptions = [
  { value: '1', label: 'Công Nghệ' },
  { value: '2', label: 'Lập Trình' },
  { value: '3', label: 'Đánh Giá' },
  { value: '4', label: 'Tin Tức' },
];

const BlogEdit: React.FC<BlogEditProps> = ({
  currentBlog,
  setShowBlogEdit,
  onEditSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // Khởi tạo giá trị form từ currentBlog
  useEffect(() => {
    if (currentBlog) {
      form.setFieldsValue({
        title: currentBlog.title,
        categoryId: categoryOptions.find(
          (cat) => cat.label === currentBlog.category
        )?.value,
        status: currentBlog.status === 'PUBLISHED',
        seoTitle: currentBlog.seoTitle,
        seoDescription: currentBlog.seoDescription,
      });
      setDescription(currentBlog.description || '');

      // Khởi tạo fileList với ảnh hiện tại
      if (currentBlog.image) {
        setFileList([
          {
            uid: '-1',
            name: 'Current Image',
            status: 'done',
            url: currentBlog.image,
          },
        ]);
      }
    }
  }, [currentBlog, form]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
  };

  const handleCancelPreview = () => setPreviewVisible(false);

  const handleImageUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewImage(base64);
    };
    reader.readAsDataURL(file);
    const previewUrl = URL.createObjectURL(file);
    const newFile: UploadFile = {
      uid: '-1',
      name: file.name,
      status: 'done',
      url: previewUrl,
      originFileObj: file,
    };
    setFileList([newFile]);
    return false;
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const image = fileList[0]?.url || '';
      if (!image) {
        message.error('Vui lòng tải lên hình ảnh bài viết!');
        setLoading(false);
        return;
      }

      const blogData = {
        ...values,
        id: currentBlog.id,
        image,
        description,
        status: values.status ? 'PUBLISHED' : 'DRAFT',
        author: currentBlog.author,
        category: categoryOptions.find((cat) => cat.value === values.categoryId)
          ?.label,
        updatedAt: new Date().toISOString(),
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
      };

      console.log('Updating:', blogData);

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notification.success({
        message: 'Thành công!',
        description: 'Bài viết đã được cập nhật thành công.',
        duration: 5,
      });

      onEditSuccess();
      setShowBlogEdit(false);
    } catch (error: any) {
      notification.error({
        message: 'Lỗi!',
        description: error.message || 'Đã xảy ra lỗi khi cập nhật bài viết.',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">Edit blog</h4>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Hình ảnh bài viết"
              name="image"
              className="font-medium"
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
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              className="font-medium"
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
              className="font-medium"
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
          </Col>

          <Col xs={24} sm={24}>
            <Form.Item
              label="Nội dung"
              name="description"
              className="font-medium"
            >
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className="h-[320px] max-h-[1200px] w-full bg-white"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="SEO Title"
              name="seoTitle"
              className="font-medium mt-5"
              rules={[
                { required: true, message: 'Vui lòng nhập SEO title!' },
                { max: 60, message: 'SEO title không được vượt quá 60 ký tự!' },
              ]}
            >
              <Input placeholder="Nhập SEO title" />
            </Form.Item>
            <Form.Item
              label="Trạng thái"
              name="status"
              valuePropName="checked"
              className="font-medium"
            >
              <Switch checkedChildren="Xuất bản" unCheckedChildren="Bản nháp" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="SEO Description"
              name="seoDescription"
              className="font-medium mt-5"
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
          </Col>

          <div className="flex flex-col sm:flex-row gap-2 mt-8">
            <Button
              type="primary"
              shape="round"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              className="w-full sm:w-auto"
            >
              Cập nhật
            </Button>
            <Button
              danger
              shape="round"
              onClick={() => setShowBlogEdit(false)}
              icon={<CloseOutlined />}
              size="large"
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
          </div>
        </Row>
      </Form>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancelPreview}
        width={800}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default BlogEdit;
