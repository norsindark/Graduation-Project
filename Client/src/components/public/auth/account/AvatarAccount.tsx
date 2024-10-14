import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Slider, notification } from 'antd';
import Cropper, { Area } from 'react-easy-crop';
import { RootState } from '../../../../redux/store';
import { callUpdateAvatar } from '../../../../services/clientApi';
import { updateUser } from '../../../../redux/account/accountSlice';
import getCroppedImg from '../../../../utils/getCroppedImg';

const AvatarAccount: React.FC = () => {
  const user = useSelector((state: RootState) => state.account.user);
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setPreviewImage(previewUrl);
      setPreviewVisible(true);
    }
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCancel = () => {
    setPreviewVisible(false);
    setFile(null);
    setPreviewImage('');
  };

  const handleUpload = async () => {
    if (file && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          previewImage,
          croppedAreaPixels
        );
        const formData = new FormData();
        formData.append('file', croppedImage, file.name);

        setIsUploading(true);
        const response = await callUpdateAvatar(formData);
        if (response.status === 200) {
          dispatch(updateUser({ avatar: response.data.message }));
          notification.success({
            message: 'Avatar updated successfully!',
            duration: 5,
            showProgress: true,
          });
        } else {
          notification.error({
            message: 'Failed to update avatar',
            description: response.data.errors?.error || 'Something went wrong!',
            duration: 5,
            showProgress: true,
          });
        }
      } catch (error) {
        notification.error({
          message:
            'Error: ' +
            (error instanceof Error ? error.message : 'Unknown error'),
          duration: 5,
          showProgress: true,
        });
      } finally {
        setIsUploading(false);
        handleCancel();
      }
    }
  };

  return (
    <div className="dasboard_header">
      <div className="dasboard_header_img">
        <img
          src={user?.avatar || 'images/comment_img_2.jpg'}
          alt="user"
          className="img-fluid w-100"
        />
        <label htmlFor="upload">
          <i className="far fa-camera"></i>
        </label>
        <input
          type="file"
          id="upload"
          hidden
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
      <h2>{user?.fullName || 'User'}</h2>
      <Modal
        open={previewVisible}
        title="Crop Avatar"
        onCancel={handleCancel}
        onOk={handleUpload}
        okText="Upload"
        cancelText="Cancel"
        confirmLoading={isUploading}
        width={450}
      >
        <div style={{ position: 'relative', width: '100%', height: 300 }}>
          <Cropper
            image={previewImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <Slider
          value={zoom}
          min={1}
          max={5}
          step={0.1}
          onChange={(value) => setZoom(value)}
        />
      </Modal>
    </div>
  );
};

export default AvatarAccount;
