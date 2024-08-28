import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decryptToken } from './hashToken';

function UserCreate() {

    const [isLoading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        fullName: "",
        isActive: "",
        phone: "",
        roleId: 0
    });
    const navigate = useNavigate();
    const token = decryptToken(localStorage.getItem('token'));

    const validateForm = () => {
        let errors = {};

        if (!formData.userName) {
            errors.userName = "Tên tài khoản là bắt buộc.";
        }
        if (!formData.email) {
            errors.email = "Email là bắt buộc.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = "Email không hợp lệ.";
            }
        }
        if (!formData.password || formData.password.length < 6) {
            errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        }
        if (!formData.fullName) {
            errors.fullName = "Họ tên là bắt buộc.";
        }
        if (!formData.phone) {
            errors.phone = "Số điện thoại là bắt buộc.";
        } else {
            const phoneRegex = /^\d{10,}$/;
            if (!phoneRegex.test(formData.phone)) {
                errors.phone = "Số điện thoại không hợp lệ (ít nhất 10 chữ số).";
            }
        }
        if (!formData.roleId) {
            errors.roleId = "Vui lòng chọn vai trò.";
        }
        if (formData.isActive === "") {
            errors.isActive = "Vui lòng chọn trạng thái.";
        }

        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    }

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
        try {
            console.log(formData);

            // setLoading(true);
            await axios.post(`http://localhost:8081/user-manage`,
                formData
                , {
                    headers: {
                        'Authorization': token,

                    }
                }).then((res) => {

                    if (res.data.statusCode == 201) {
                        navigate("/portal/user-list");
                    }
                })
            //navigate("/portal/user-list");


        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <>
            <h3>Tạo Tài Khoản Người Dùng</h3>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Tên Tài Khoản</label>
                            <input
                                name='userName'
                                value={formData.userName}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.userName && <span className="text-danger">{errorMessages.userName}</span>}
                        </div>

                        <div className="col-lg-6">
                            <label>E-Mail</label>
                            <input
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                className='form-control'
                            />
                            {errorMessages.email && <span className="text-danger">{errorMessages.email}</span>}
                        </div>

                        <div className="col-lg-6">
                            <label>Số Điện Thoại</label>
                            <input
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                type="number"
                                className='form-control'
                            />
                            {errorMessages.phone && <span className="text-danger">{errorMessages.phone}</span>}
                        </div>

                        <div className="col-lg-6">
                            <label>Họ Tên</label>
                            <input
                                name='fullName'
                                value={formData.fullName}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                            {errorMessages.fullName && <span className="text-danger">{errorMessages.fullName}</span>}
                        </div>
                        <div className="col-lg-6">
                            <label>Mật Khẩu</label>
                            <input
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                className='form-control'
                            />
                            {errorMessages.password && <span className="text-danger">{errorMessages.password}</span>}
                        </div>

                        <div className="col-lg-6">
                            <label>Vai Trò</label>
                            <select
                                name='roleId'
                                value={formData.roleId}
                                onChange={handleChange}
                                className='form-control'
                            >
                                <option value="">----Chọn----</option>
                                <option value="1">Quản Lý</option>
                                <option value="2">Nhân Viên</option>
                                <option value="3">Khách Hàng</option>
                            </select>
                            {errorMessages.roleId && <span className="text-danger">{errorMessages.roleId}</span>}
                        </div>

                        <div className='col-lg-4'>
                            <label>Kích Hoạt</label>
                            <select
                                name='isActive'
                                value={formData.isActive}
                                onChange={handleChange}
                                className='form-control'
                            >
                                <option value="">----Select----</option>
                                <option value="true">Hoạt Động</option>
                                <option value="false">Ngừng Hoạt Động</option>
                            </select>
                            {errorMessages.isActive && <span className="text-danger">{errorMessages.isActive}</span>}
                        </div>

                        <div className='col-lg-4 mt-3'>
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

export default UserCreate;
