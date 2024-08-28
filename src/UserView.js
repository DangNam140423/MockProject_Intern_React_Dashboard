import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { decryptToken } from './hashToken';

function UserView() {
    const params = useParams();
    const [userList, setUserList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const token = decryptToken(localStorage.getItem('token'));

    useEffect(() => {
        //On Load

        getUsers();
        console.log("welcome to userview");
    }, []);

    let getUsers = async () => {
        try {

            const user = await axios.get('http://localhost:8081/user-manage/' + params.id, {
                headers: {
                    Authorization: token
                }
            });
            console.log(user.data);
            setUserList(user.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    return (
        <>
            <div>UserView - {params.id}</div>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">UserView</h6>
                </div>
                <div className="card-body">
                    {
                        isLoading ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' />
                            :
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Full Name</th>
                                            <th>E-Mail</th>
                                            <th>phone</th>
                                            <th>role</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <td>{userList.userId}</td>
                                        <td>{userList.userName}</td>
                                        <td>{userList.fullName}</td>
                                        <td>{userList.email}</td>
                                        <td>{userList.phone}</td>
                                        <td>{userList.roleId}</td>
                                    </tbody>
                                </table>
                            </div>
                    }
                </div>
            </div>
        </>

    )
}

export default UserView