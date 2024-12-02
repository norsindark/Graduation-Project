import React, { useEffect, useState } from 'react';
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
  Tag,
  Space,
} from 'antd';
import { SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { RcFile } from 'antd/es/upload';
import {
  callGetAllNameAndIdBlog,
  callCreateThumbnailBlogUrl,
  callUpdateBlog,
} from '../../../services/serverApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { modules, formats } from '../../../utils/config-reactquill';

const { TextArea } = Input;
const { Option } = Select;

interface BlogEditProps {
  currentBlog: {
    id: string;
    title: string;
    thumbnail: string | null;
    categoryBlogName: string;
    categoryBlogId: string;
    author: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    content: string;
    tags: string;
    seoTitle: string;
    seoDescription: string;
  };
  setShowBlogEdit: (value: boolean) => void;
  onEditSuccess: () => void;
}

interface CategoryOption {
  categoryBlogId: string;
  categoryBlogName: string;
}

const BlogEdit: React.FC<BlogEditProps> = ({
  currentBlog,
  setShowBlogEdit,
  onEditSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const userId = useSelector((state: RootState) => state.account.user?.id);

  // Khởi tạo giá trị form từ currentBlog

  useEffect(() => {
    if (currentBlog) {
      form.setFieldsValue({
        title: currentBlog.title,
        categoryId: currentBlog.categoryBlogId,
        status: currentBlog.status === 'PUBLISHED',
        seoTitle: currentBlog.seoTitle,
        seoDescription: currentBlog.seoDescription,
        content: currentBlog.content,
      });
      setTags(currentBlog.tags ? currentBlog.tags.split(',') : []);

      // Khởi tạo fileList với ảnh hiện tại
      if (currentBlog.thumbnail) {
        setFileList([
          {
            uid: '-1',
            name: 'Current Image',
            status: 'done',
            url: currentBlog.thumbnail,
          },
        ]);
      }
    }
  }, [currentBlog, form]);

  // Fetch danh mục
  useEffect(() => {
    const fetchData = async () => {
      const response = await callGetAllNameAndIdBlog();
      if (response?.status === 200) {
        setCategoryOptions(response.data);
      }
    };
    fetchData();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      form.setFieldsValue({ tags: newTags });
    }
    setInputValue('');
  };

  const handleTagClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    form.setFieldsValue({ tags: newTags });
  };

  const handleUploadImage = async (
    event: UploadChangeParam<UploadFile<any>>
  ) => {
    const selectedFile = event.fileList[0]?.originFileObj;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      let thumbnailUrl = currentBlog.thumbnail;

      // Nếu có file mới được upload
      if (file) {
        const newForm = new FormData();
        newForm.append('thumbnailUrl', file as Blob);
        const thumbnailResponse = await callCreateThumbnailBlogUrl(newForm);
        if (thumbnailResponse?.status !== 200) {
          throw new Error('Error uploading image');
        }
        thumbnailUrl = thumbnailResponse.data.message;
      }

      const tagsString = tags.join(',');

      const response = await callUpdateBlog(
        currentBlog.id,
        thumbnailUrl || '',
        values.title,
        values.content,
        values.seoTitle,
        values.seoDescription,
        tagsString,
        userId || '',
        values.status ? 'PUBLISHED' : 'DRAFT',
        values.categoryId
      );

      if (response?.status === 200) {
        notification.success({
          message: 'Success!',
          description: 'Blog has been updated successfully.',
          duration: 5,
          showProgress: true,
        });

        onEditSuccess();
        setShowBlogEdit(false);
      }
    } catch (error: any) {
      notification.error({
        message: 'Error!',
        description:
          error.message || 'An error occurred while updating the blog.',
        duration: 5,
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Return JSX giống như BlogNew nhưng với các giá trị được điền sẵn
  return (
    <>
      <h4 className="text-center text-xl font-semibold mb-4">Edit blog</h4>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* Phần upload ảnh */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="Blog thumbnail"
              name="image"
              className="font-medium"
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                beforeUpload={(file) => {
                  const isJpgOrPng =
                    file.type === 'image/jpeg' ||
                    file.type === 'image/png' ||
                    file.type === 'image/webp';
                  if (!isJpgOrPng) {
                    message.error('Only JPG/PNG/WEBP files are allowed!');
                    return false;
                  }
                  handleImageUpload(file);
                  return false;
                }}
                onChange={handleUploadImage}
                onPreview={handlePreview}
                onRemove={() => setFileList([])}
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          {/* Phần title và category */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="Title"
              name="title"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter a title!' },
                { min: 10, message: 'Title must be at least 10 characters!' },
              ]}
            >
              <Input placeholder="Enter a title" />
            </Form.Item>

            <Form.Item label="Tags" name="tags" className="font-medium">
              <div className="tags-input border rounded-md p-2">
                <Space wrap className="mb-2">
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleTagClose(tag)}
                      className="bg-blue-50 text-blue-700"
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
                <Input
                  placeholder="Enter tag and press Enter"
                  value={inputValue}
                  onChange={handleInputChange}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    handleInputConfirm();
                  }}
                  onBlur={handleInputConfirm}
                  className="mt-2"
                />
              </div>
            </Form.Item>

            <Form.Item
              label="Category"
              name="categoryId"
              className="font-medium"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select placeholder="Select a category">
                {categoryOptions.map((category) => (
                  <Option
                    key={category.categoryBlogId}
                    value={category.categoryBlogId}
                  >
                    {category.categoryBlogName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Phần content */}
          <Col xs={24} sm={24}>
            <Form.Item
              label="Content"
              name="content"
              className="font-medium"
              rules={[
                { required: true, message: 'Please enter content!' },
                {
                  min: 100,
                  message: 'Content must be at least 100 characters!',
                },
              ]}
            >
              <ReactQuill
                theme="snow"
                className="h-[480px] max-h-[1200px] w-full bg-white"
                modules={modules}
                formats={formats}
              />
            </Form.Item>
          </Col>

          {/* Phần SEO và status */}
          <Col xs={24} sm={12}>
            <Form.Item
              label="SEO Title"
              name="seoTitle"
              className="font-medium mt-5"
              rules={[
                { required: true, message: 'Please enter SEO title!' },
                {
                  max: 80,
                  message: 'SEO title must be less than 80 characters!',
                },
              ]}
            >
              <Input placeholder="Enter SEO title" />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              valuePropName="checked"
              className="font-medium"
            >
              <Switch checkedChildren="Published" unCheckedChildren="Draft" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="SEO Description"
              name="seoDescription"
              className="font-medium mt-5"
              rules={[
                { required: true, message: 'Please enter SEO description!' },
                {
                  max: 160,
                  message: 'SEO description must be less than 160 characters!',
                },
              ]}
            >
              <TextArea
                placeholder="Enter SEO description"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Col>

          {/* Buttons */}
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
              Update Blog
            </Button>
            <Button
              danger
              shape="round"
              onClick={() => setShowBlogEdit(false)}
              icon={<CloseOutlined />}
              size="large"
              className="w-full sm:w-auto"
            >
              Cancel
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
