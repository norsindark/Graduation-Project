import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
// import { callUpdateAvatar } from "../../../../services/clientApi";
// import { updateUser } from "../../../../redux/account/accountSlice"; // Uncommented this line
import { notification } from "antd";

const AvatarAccount: React.FC = () => {
    const user = useSelector((state: RootState) => state.account.user);
    //const dispatch = useDispatch(); // Uncommented this line
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('file', file); // Correctly append the file to formData
                console.log(file);

                // const res = await callUpdateAvatar(formData); // Pass formData to the API call

                // if (res?.status === 200) {
                //     dispatch(updateUser({
                //         ...user,
                //         avatar: res.data.avatar // Update the user's avatar in Redux store
                //     }));
                //     notification.success({
                //         message: 'Avatar updated successfully!',
                //         duration: 5,
                //     });
                // } else {
                //     notification.error({
                //         message: 'Failed to update avatar',
                //         description: res?.data?.message || "Something went wrong!",
                //         duration: 5,
                //     });
                // }
            } catch (error) {
                notification.error({
                    message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
                    duration: 5,
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="dasboard_header">
            <div className="dasboard_header_img">
                <img src={user?.avatar || "default-avatar.png"} alt="user" className="img-fluid w-100" />
                <label htmlFor="upload">
                    <i className="far fa-camera"></i>
                </label>
                <input
                    type="file"
                    id="upload"
                    hidden
                    onChange={handleFileChange}
                    accept="image/*" // Accept only images
                />
            </div>
            <h2>{user?.fullName || "User Name"}</h2>
            {isLoading && <p>Updating avatar...</p>}
        </div>
    );
}

export default AvatarAccount;
