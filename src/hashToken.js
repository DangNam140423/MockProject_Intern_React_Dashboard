import CryptoJS from 'crypto-js';

// Khóa bí mật để mã hóa và giải mã (bạn nên giữ khóa này an toàn)
const SECRET_KEY = "quanghuy123"

// Hàm mã hóa token
export const hashToken = (token) => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Hàm giải mã token
export const decryptToken = (hashToken) => {
    const bytes = CryptoJS.AES.decrypt(hashToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};
