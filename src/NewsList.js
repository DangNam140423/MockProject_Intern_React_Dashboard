import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { decryptToken } from './hashToken';
import { jwtDecode } from 'jwt-decode';


function NewsList() {

  const [dataList, setDataList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const token = decryptToken(localStorage.getItem('token'));
  const decodedToken = jwtDecode(token);
  let url = ""
  if (decodedToken.authorities == "ROLE_MANAGER") {
    url = "http://localhost:8081/api/news";
  } else if (decodedToken.authorities == "ROLE_STAFF") {
    url = "http://localhost:8081/api/news/list";
  }
  useEffect(() => {
    //On Load
    getDatas();

  }, []);

  let getDatas = async () => {

    try {
      console.log(url);

      const datas = await axios.get(url + "?size=20", {
        headers: {
          Authorization: token
        }
      });
      setDataList(datas.data.data);
      console.log(datas.data.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  let handleDelete = async (id) => {


    try {
      const confirmDelete = window.confirm("Are you sure do you want to delete the data?");
      if (confirmDelete) {
        console.log(url + "/" + id);

        await axios.delete("http://localhost:8081/api/news/" + id, {
          headers: {
            Authorization: token
          }


        }

        ).then((res) => {
          console.log(res);
        });
        getDatas();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Bản Tin</h1>
        <Link to="/portal/create-news" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <FontAwesomeIcon icon={faUser} className="creatinguser mr-2" />
          Tạo Bản Tin
        </Link>
      </div>
      {/* <!-- DataTables --> */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Dữ Liệu Bảng</h6>
        </div>
        <div className="card-body">
          {
            isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' />
              : <div className="table-responsive">
                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tiêu đề</th>
                      <th>Nội Dung</th>
                      <th>Tạo Bởi</th>
                      <th>Chỉnh Sửa Bởi</th>

                      <th>Hành Động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataList.map((data, index) => {

                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{data.title}</td>
                          <td>{data.content}</td>
                          <td>{data.createdBy}</td>
                          <td>{data.modifiedBy}</td>


                          <th>
                            <Link to={`/portal/news-view/${data.newsId}`} className='btn btn-primary btn-sm mr-1'>View</Link>
                            <Link to={`/portal/news-edit/${data.newsId}`} className='btn btn-info btn-sm mr-1'>Edit</Link>
                            <button onClick={() => handleDelete(data.newsId)} className='btn btn-danger btn-sm mr-1'>Delete</button>
                          </th>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
          }

        </div>
      </div>
    </>
  )
}

export default NewsList