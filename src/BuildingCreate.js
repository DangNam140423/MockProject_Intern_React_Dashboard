import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decryptToken } from './hashToken';

function BuildingCreate() {
    const params = useParams();
    const [isLoading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [formData, setFormData] = useState({
        district: "",
        ward: "",
        street: "",
        map: "",
        price: "",
        buildingName: "",
        bedRoom: 0,
        bathRoom: 0,
        juridical: "",
        area: "",
        categoryId: [],
        image: "",
        direction: "",
        juridical: "",
        priceDescription: "",

    });
    const navigate = useNavigate();
    const token = decryptToken(localStorage.getItem('token'));
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categoryData = await axios.get('http://localhost:8081/category/list', {
                    headers: {
                        Authorization: token
                    }
                });
                setCategoryData(categoryData.data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchCategories();
    }, [token]);
    const validateForm = () => {
        let errors = {};

        // Kiểm tra các trường bắt buộc
        if (!formData.buildingName) errors.buildingName = "Tên tòa nhà là bắt buộc.";
        if (!formData.street) errors.street = "Đường là bắt buộc.";
        if (!formData.ward) errors.ward = "Phường là bắt buộc.";
        if (!formData.district) errors.district = "Quận là bắt buộc.";
        if (!formData.price || isNaN(formData.price)) errors.price = "Giá cả phải là số và không được để trống.";
        if (!formData.area || isNaN(formData.area)) errors.area = "Diện tích phải là số và không được để trống.";
        if (!formData.juridical) errors.juridical = "Giấy tờ pháp lý là bắt buộc.";
        if (formData.categoryId.length === 0) errors.categoryId = "Phải chọn ít nhất một loại.";

        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            // Add selected value to categoryId array
            setFormData({
                ...formData,
                categoryId: [...formData.categoryId, value]
            });
        } else {
            // Remove unselected value from categoryId array
            setFormData({
                ...formData,
                categoryId: formData.categoryId.filter(id => id !== value)
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }


    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!validateForm()) return;
        console.log(formData);


        await axios.post(`http://localhost:8081/api/building`, formData, {
            headers: {
                Authorization: token
            }
        }).then(res => console.log(res.data))
        navigate("/portal/building-list");
    }
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        const uploadPromises = [];
        setLoading(true);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'cloudinaryApp'); // Thay bằng upload preset của bạn từ Cloudinary

            const uploadPromise = axios.post(
                'https://api.cloudinary.com/v1_1/dt0kv3yml/image/upload', // Thay bằng Cloudinary URL của bạn cho image
                formData
            ).then(response => response.data.secure_url);

            uploadPromises.push(uploadPromise);
        }

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            setFormData((prevFormData) => ({
                ...prevFormData,
                image: uploadedUrls.join(', '), // Lưu tất cả URL vào formData, phân tách bằng dấu phẩy
            }));
            setLoading(false);
        } catch (error) {
            console.error('Error uploading files:', error);
            setLoading(false);
        }
    };

    return (
        <>
            <h3>Tạo Tòa Nhà</h3>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Tên Tòa Nhà</label>
                            <input
                                name='buildingName'
                                value={formData.buildingName}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.buildingName && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>

                        <div className="col-lg-6">
                            <label>Đường</label>
                            <input
                                name='street'
                                value={formData.street}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.street && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>

                        <div className="col-lg-6">
                            <label>Phường</label>
                            <input
                                name='ward'
                                value={formData.ward}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.ward && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>

                        <div className="col-lg-6">
                            <label >Quận</label>
                            <select
                                className='form-control'
                                name='district'
                                onChange={handleChange}
                                value={formData.district}
                            >
                                <option value="">Chọn quận</option>
                                <option value="THANH_KHE">THANH KHE</option>
                                <option value="NGU_HANH_SON">NGU HANH SON</option>
                                <option value="HAI_CHAU">HAI CHAU</option>
                                <option value="SON_TRA">SON TRA</option>
                                <option value="HOA_VANG">HOA VANG</option>
                                <option value="HOANG_SA">HOANG SA</option>
                            </select>
                            {errorMessages.district && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>

                        <div className="col-lg-3">
                            <label>Giá cả</label>
                            <input
                                name='price'
                                value={formData.price}
                                onChange={handleChange}
                                type="number"
                                className='form-control'
                            />
                            {errorMessages.price && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className="col-lg-3">
                            <label>Giá bằng chữ</label>
                            <input
                                name='priceDescription'
                                value={formData.priceDescription}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.priceDescription && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className="col-lg-3">
                            <label>Giấy tờ pháp lý</label>
                            <input
                                name='juridical'
                                value={formData.juridical}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.juridical && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>

                        <div className="col-lg-3">
                            <label>Hướng Nhà</label>
                            <select name='direction'
                                value={formData.direction}
                                onChange={handleChange}
                                className='form-control'>
                                <option value="">Chọn quận</option>
                                <option value="east">Đông</option>
                                <option value="west">Tây</option>
                                <option value="south">Nam</option>
                                <option value="north">Bắc</option>
                                <option value="northeast">Đông Bắc</option>
                                <option value="southeast">Đông Nam</option>
                                <option value="northwest">Tây Nam</option>
                                <option value="southwest">Tây bắc</option>
                            </select>
                            {errorMessages.direction && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className="col-lg-3">
                            <label>Phòng Tắm</label>
                            <input
                                name='bathRoom'
                                value={formData.bathRoom}
                                onChange={handleChange}
                                type="number"
                                className='form-control'
                            />
                            {errorMessages.bathRoom && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className="col-lg-3">
                            <label>Phòng Ngủ</label>
                            <input
                                name='bedRoom'
                                value={formData.bedRoom}
                                onChange={handleChange}
                                type="number"
                                className='form-control'
                            />
                            {errorMessages.bedRoom && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className="col-lg-3">
                            <label>Diện tích tổng</label>
                            <input
                                name='area'
                                value={formData.area}
                                onChange={handleChange}
                                type="number"
                                className='form-control'
                            />
                            {errorMessages.area && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className="col-lg-3">
                            <label>Địa chỉ map</label>
                            <input
                                name='map'
                                value={formData.map}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.map && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>

                        <div className='col-lg-3'>
                            <label>Cho thuê</label>
                            <select
                                name='isRent'
                                value={formData.isRent}
                                onChange={handleChange}
                                className='form-control'
                            >
                                <option value="">----Select----</option>
                                <option value="true">true</option>
                                <option value="false">false</option>
                            </select>
                            {errorMessages.isRent && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className='col-lg-3'>
                            <label>Đang Bán</label>
                            <select
                                name='isSell'
                                value={formData.isSell}
                                onChange={handleChange}
                                className='form-control'
                            >
                                <option value="">----Select----</option>
                                <option value="true">true</option>
                                <option value="false">false</option>
                            </select>
                            {errorMessages.isSell && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>
                        <div className="col-lg-6">
                            <label>Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleImageUpload}
                                multiple
                            />

                        </div>
                        <div className='col-lg-12'>
                            <label>Loại</label>
                            <div>
                                {categoryData.map((category) => (
                                    <div key={category.categoryId} className='col-lg-5' >
                                        <input

                                            type="checkbox"
                                            value={category.categoryId}
                                            onChange={handleCheckboxChange}
                                            checked={formData.categoryId.includes(category.categoryId.toString())}
                                        />
                                        <label className='ml-1'> {category.categoryDes}</label>
                                    </div>
                                ))}
                            </div>
                            {errorMessages.categoryId && <span className="text-danger">{errorMessages.buildingName}</span>}
                        </div>

                        <div className='col-lg-3 mt-3'>
                            <input
                                disabled={isLoading}
                                type="submit"
                                value={isLoading ? "Updating..." : "Update"}
                                className='btn btn-primary'
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default BuildingCreate;
