import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { decryptToken } from './hashToken';
import { htmlToText } from 'html-to-text';
function NewsEdit() {
    const params = useParams();

    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({

    });
    const navigate = useNavigate();
    const token = decryptToken(localStorage.getItem('token'));
    useEffect(() => {
        getData();
    }, []);
    // Convert HTML to plain text
    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    const handleContentChange = (value) => {
        setFormData({
            ...formData,
            content: value // Lưu nội dung không chứa thẻ HTML
        });

    };


    const handleImageUpload = async (e) => {
        const files = e.target.files;
        const uploadPromises = [];
        setLoading(true);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'cloudinaryApp');

            const uploadPromise = axios.post(
                'https://api.cloudinary.com/v1_1/dt0kv3yml/image/upload',
                formData
            ).then(response => response.data.secure_url);

            uploadPromises.push(uploadPromise);
        }

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            setFormData((prevFormData) => ({
                ...prevFormData,
                image: uploadedUrls.join(', '),
            }));
            setLoading(false);
        } catch (error) {
            console.error('Error uploading files:', error);
            setLoading(false);
        }
    };



    const getData = async () => {
        try {
            const user = await axios.get(`http://localhost:8081/api/news/${params.id}`, {
                headers: {
                    Authorization: token
                }
            });
            setFormData(user.data.data);

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

        await axios.post(`http://localhost:8081/api/news`, formData, {
            headers: {
                Authorization: token
            }
        }).then(res => console.log(res.data))
        navigate("/portal/news-list");
    }

    return (
        <>
            <h3>Chỉnh Sửa Bản Tin: {params.id}</h3>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Tiêu đề</label>
                            <input
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                type="text"
                                className='form-control'
                            />
                        </div>

                        <div className="col-lg-6">
                            <label>Hình ảnh</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleImageUpload}
                                multiple
                            />
                        </div>
                        <div className="col-lg-12">
                            <label>Nội dung</label>
                            <ReactQuill value={formData.content} onChange={handleContentChange} />
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

export default NewsEdit;
