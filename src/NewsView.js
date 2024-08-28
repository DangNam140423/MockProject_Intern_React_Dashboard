import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { decryptToken } from './hashToken';

import 'react-quill/dist/quill.snow.css';
function NewsView() {
    const params = useParams();
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const token = decryptToken(localStorage.getItem('token'));

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const data = await axios.get(`http://localhost:8081/api/news/${params.id}`, {
                headers: {
                    Authorization: token
                }
            });
            setData(data.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }






    return (
        <>
            <h3>Bản Tin: {params.id}</h3>
            <div className='container'>

                <div className='row'>
                    <div class="row">
                        <div class="col-lg-12">

                            <article>

                                <header class="mb-4">

                                    <h1 class="fw-bolder mb-1">{data.title}</h1>

                                    <div class="text-muted fst-italic mb-2">Thời gian: {data.createdDate ? data.createdDate.split("T")[1] : ""}</div>
                                    <div class="text-muted fst-italic mb-2">Ngày: {data.createdDate ? data.createdDate.split("T")[0] : ""}</div>


                                </header>

                                <figure class="mb-4"><img class="img-fluid rounded" src={data.image} alt="..." /></figure>

                                <section class="mb-5">
                                    <p class="fs-5 mb-4">{data.content}</p>

                                </section>
                            </article>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default NewsView;
