import { faFaceLaughWink, faTachographDigital, faUsers, faHouse, faBuilding, faNewspaper, faSignOut, faCashRegister } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import { hashToken, decryptToken } from './hashToken';
function Sidebar() {

    const token = decryptToken(localStorage.getItem('token'));
    console.log(token);

    const decodedToken = jwtDecode(token);
    const role = decodedToken.authorities;
    const navigate = useNavigate();
    console.log(role);
    function logOut() {
        localStorage.removeItem('token');
        window.location.href('/');
    }
    // role decodedToken.authorities
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            {/* <!-- Sidebar - Brand --> */}
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                <div className="sidebar-brand-icon rotate-n-15">

                </div>
                <div className="sidebar-brand-text mx-3">Admin</div>
            </a>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />

            {/* <!-- Nav Item - Dashboard --> */}

            {/* {role == "ROLE_MANAGER" ? (<li className="nav-item active">
                <Link className="nav-link" to="/portal/dashboard">
                    <FontAwesomeIcon icon={faTachographDigital} style={{ marginRight: "0.5rem" }} />
                    <span>Dashboard</span>
                </Link>
            </li>) : (<li></li>)} */}
            {/* <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />

            {/* <!-- Nav Item - Users --> */}
            {role == "ROLE_MANAGER" ? (
                <li className="nav-item active">
                    <Link className="nav-link" to="/portal/user-list">
                        <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
                        <span>Quản lý người dùng</span>
                    </Link>
                </li>
            ) : (<li></li>)}

            <li className="nav-item active">
                <Link className="nav-link" to="/portal/building-list">
                    <FontAwesomeIcon icon={faBuilding} style={{ marginRight: "0.5rem" }} />
                    <span>Quản lý tòa nhà</span>
                </Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="/portal/news-list">

                    <FontAwesomeIcon icon={faNewspaper} style={{ marginRight: "0.5rem" }} />
                    <span>Tin tức</span>
                </Link>

            </li>
            {role == "ROLE_MANAGER" ? (
                <li className="nav-item active">
                    <Link className="nav-link" to="/portal/category-list">

                        <FontAwesomeIcon icon={faHouse} style={{ marginRight: "0.5rem" }} />
                        <span>Loại nhà đất</span>
                    </Link>

                </li>
            ) : (<li></li>)}
            <li className="nav-item active">
                <Link className="nav-link" to="/portal/trantision-list" >

                    <FontAwesomeIcon icon={faCashRegister} style={{ marginRight: "0.5rem" }} />
                    <span>Giao dịch</span>
                </Link>

            </li>
            <li className="nav-item active">
                <Link className="nav-link" to="" onClick={logOut}>

                    <FontAwesomeIcon icon={faSignOut} style={{ marginRight: "0.5rem" }} />
                    <span>Đăng xuất</span>
                </Link>

            </li>

        </ul>
    )
}

export default Sidebar