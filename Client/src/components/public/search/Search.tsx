import { useState } from 'react';
import {Modal, Input, Button, } from 'antd';


const Search = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        // Xử lý tìm kiếm khi bấm OK
        console.log('Searching for:', searchText);
        setIsModalVisible(false);

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <li>
            <a href="#" className="menu_search" onClick={showModal}>
                <i className="far fa-search"></i>
            </a>
            <Modal
                title="Search"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}

                footer={[
                    <Button  key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Search
                    </Button>,
                ]}
            >

                <Input
                    placeholder="Search . . ."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Modal>
        </li>
    );
};

export default Search;
