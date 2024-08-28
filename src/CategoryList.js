import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { decryptToken } from './hashToken';

function CategoryList() {

  const [dataList, setDataList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const token = decryptToken(localStorage.getItem('token'));


  useEffect(() => {
    //On Load
    getDatas();

  }, []);

  let getDatas = async () => {
    try {
      const datas = await axios.get("http://localhost:8081/category/list?page=&pageSize=20", {
        headers: {
          Authorization: token
        }
      });
      setDataList(datas.data.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  let handleDelete = async (id) => {
    let data = []
    data.push(id)
    console.log(data);

    try {
      const confirmDelete = window.confirm("Are you sure do you want to delete the data?");
      if (confirmDelete) {
        await axios.delete(`http://localhost:8081/category/${id}`, {
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
        <h1 className="h3 mb-0 text-gray-800">Loại Tòa Nhà</h1>
        <Link to="/portal/create-category" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <FontAwesomeIcon icon={faUser} className="creatinguser mr-2" />
          Tạo Loại Tòa Nhà
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
                      <th>Mã</th>
                      <th>Mô tả</th>
                      <th>Người tạo</th>

                      <th>Hành Động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataList.map((data, index) => {

                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{data.categoryCode}</td>
                          <td>{data.categoryDes}</td>
                          <td>{data.createdBy}</td>


                          <th>
                            <Link to={`/portal/category-edit/${data.categoryId}`} className='btn btn-info btn-sm mr-1'>Sửa</Link>
                            <button onClick={() => handleDelete(data.categoryId)} className='btn btn-danger btn-sm mr-1'>Xóa</button>
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

export default CategoryList