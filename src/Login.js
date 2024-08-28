import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { hashToken, decryptToken } from './hashToken';
function Login() {
    const navigate = useNavigate();  // Sử dụng để chuyển hướng sau khi đăng nhập thành công
    useEffect(() => {
        let token = localStorage.getItem('token');

        if (token != null) {


            navigate('/portal/dashboard');
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());  // Chuyển FormData thành object



        try {
            const response = await axios.post('http://localhost:8081/auth/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            // Giả sử phản hồi trả về token và thông tin người dùng

            const token = response.data.jwtToken;
            const decodedToken = jwtDecode(token);
            // Lưu token vào localStorage (hoặc sessionStorage)
            if (decodedToken.authorities == "ROLE_MANAGER" || decodedToken.authorities == "ROLE_STAFF") {
                localStorage.setItem('token', hashToken(token));
                navigate('/portal/user-list');
            }
            else {
                alert("Bạn không có quyền truy cập");
            }
            // Chuyển hướng đến trang dashboard


        } catch (error) {
            console.error('Login failed:', error);
            //alert('Login failed. Please check your credentials.');
        }
    }

    return (
        <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12 col-md-9">
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                            <div className="col-lg-6">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                    </div>
                                    <form className="user" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="userName"
                                                className="form-control form-control-user"
                                                id="exampleInputEmail"
                                                aria-describedby="emailHelp"
                                                placeholder="Enter Email Address..."
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control form-control-user"
                                                id="exampleInputPassword"
                                                placeholder="Password"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox small">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="customCheck"
                                                    name="rememberMe"
                                                />
                                                <label className="custom-control-label" htmlFor="customCheck">
                                                    Remember Me
                                                </label>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-user btn-block">
                                            Login
                                        </button>
                                        <hr />
                                        <a href="#" className="btn btn-google btn-user btn-block">
                                            <i className="fab fa-google fa-fw"></i> Login with Google
                                        </a>
                                        <a href="#" className="btn btn-facebook btn-user btn-block">
                                            <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                                        </a>
                                    </form>
                                    <hr />
                                    <div className="text-center">
                                        <a className="small" href="forgot-password.html">
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <div className="text-center">
                                        <a className="small" href="register.html">
                                            Create an Account!
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
