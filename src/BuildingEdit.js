import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decryptToken } from './hashToken';

function BuildingEdit() {
    const params = useParams();
    const [isLoading, setLoading] = useState(false);
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
        categoryId: 1,
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
    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const user = await axios.get(`http://localhost:8081/api/building/${params.id}`, {
                headers: {
                    Authorization: token
                }
            });
            setFormData(user.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(token);
        console.log(formData);

        await axios.post(`http://localhost:8081/api/building`, formData, {
            headers: {
                Authorization: token
            }
        }).then(res => console.log(res.data))
        navigate("/portal/building-list");
    }


    return (
        <>
            <h3>Chỉnh Sửa Thông Tin Tòa Nhà - Id: {params.id}</h3>
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
                        </div>

                        <div className="col-lg-6">
                            <label >Quận</label>
                            <select
                                className='form-control'
                                name='district'
                                onChange={handleChange}
                                value={formData.district}
                            >
                                <option value="">{formData.district}</option>
                                <option value="THANH_KHE">THANH KHE</option>
                                <option value="NGU_HANH_SON">NGU HANH SON</option>
                                <option value="HAI_CHAU">HAI CHAU</option>
                                <option value="SON_TRA">SON TRA</option>
                                <option value="HOA_VANG">HOA VANG</option>
                                <option value="HOANG_SA">HOANG SA</option>
                            </select>
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
                        </div>
                        <div className="col-lg-3">
                            <label>Hướng Nhà</label>
                            <select name='direction'
                                value={formData.direction}
                                onChange={handleChange}
                                className='form-control'>
                                <option value="">{formData.direction}</option>
                                <option value="east">Đông</option>
                                <option value="west">Tây</option>
                                <option value="south">Nam</option>
                                <option value="north">Bắc</option>
                                <option value="northeast">Đông Bắc</option>
                                <option value="southeast">Đông Nam</option>
                                <option value="northwest">Tây Nam</option>
                                <option value="southwest">Tây bắc</option>
                            </select>
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
                        </div>
                        <div className='col-lg-3'>
                            <label>Loại</label>
                            <select
                                name='categoryId'
                                value={formData.categoryId}
                                onChange={handleChange}
                                className='form-control'
                            >
                                <option value="">----Select----</option>
                                {categoryData.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryDes}
                                    </option>
                                ))}
                            </select>
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

export default BuildingEdit;
