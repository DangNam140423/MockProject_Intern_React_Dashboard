import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { decryptToken } from './hashToken';

function Userlist() {

  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const token = decryptToken(localStorage.getItem('token'));
  useEffect(() => {
    //On Load
    getUsers();

  }, []);

  let getUsers = async () => {
    try {
      const users = await axios.get("http://localhost:8081/user-manage/list?page=&pageSize=20", {
        headers: {
          Authorization: token
        }
      });
      setUserList(users.data.data);
      console.log(users.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  let handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure do you want to delete the data?");
      if (confirmDelete) {
        await axios.delete(`http://localhost:8081/user-manage/${id}`, {
          headers: {
            Authorization: token
          }
        }).then((res) => {
          console.log(res);
        });
        getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Quản Lý Tài Khoản</h1>
        <Link to="/portal/create-user" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <FontAwesomeIcon icon={faUser} className="creatinguser mr-2" />
          Tạo Tài Khoản
        </Link>
      </div>
      {/* <!-- DataTables --> */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Bảng Dữ Liệu</h6>
        </div>
        <div className="card-body">
          {
            isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' />
              : <div className="table-responsive">
                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên Đăng Nhập</th>
                      <th>Họ Tên</th>
                      <th>E-Mail</th>
                      <th>Số Điện Thoại</th>
                      <th>Vai Trò</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {userList.map((user, index) => {
                      switch (user.roleId) {
                        case 1:
                          user.roleId = "Quản Lý";
                          break;
                        case 2:
                          user.roleId = "Nhân Viên";
                          break;
                        case 3:
                          user.roleId = "Khách Hàng";
                          break;
                        default:
                          user.roleId = "Unknown";
                          break;
                      }
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{user.userName}</td>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.roleId}</td>

                          <th>

                            <Link to={`/portal/user-edit/${user.userId}`} className='btn btn-info btn-sm mr-1'>Sửa</Link>
                            <button onClick={() => handleDelete(user.userId)} className='btn btn-danger btn-sm mr-1'>Xóa</button>
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

export default Userlist