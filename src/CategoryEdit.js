import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { decryptToken } from './hashToken';

function CategoryEdit() {
    const params = useParams();
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        "categoryId": 1,
        "categoryCode": "",
        "categoryDes": ""
    });
    const navigate = useNavigate();
    const token = decryptToken(localStorage.getItem('token'));

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const user = await axios.get(`http://localhost:8081/category/${params.id}`, {
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(token);
        console.log(formData);

        await axios.post(`http://localhost:8081/category`, formData, {
            headers: {
                Authorization: token
            }
        }).then(res => console.log(res.data))
        navigate("/portal/category-list");
    }


    return (
        <>
            <h3>Chỉnh Sửa Loại Tòa Nhà: {params.id}</h3>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Id</label>
                            <input
                                name='categoryId'
                                value={formData.categoryId}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                        </div>

                        <div className="col-lg-6">
                            <label>Mã</label>
                            <input
                                name='categoryCode'
                                value={formData.categoryCode}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                        </div>

                        <div className="col-lg-6">
                            <label>Mô Tả</label>
                            <input
                                name='categoryDes'
                                value={formData.categoryDes}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
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

export default CategoryEdit;
