import React from "react";
import DaumPostcode from "react-daum-postcode";
import '../styles/daumpostcode.module.css';

const Post = ({ setAddress, handleClose }) => {

    const handlePostCode  = (data) =>{
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setAddress(fullAddress);
        handleClose();
    }

    return (
        <div >
            <DaumPostcode
                className="postmodal"
                autoClose
                onComplete={handlePostCode} />
        </div>
    );
};

export default Post;