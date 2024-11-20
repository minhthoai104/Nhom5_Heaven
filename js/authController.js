const crypto = require("crypto");
const nodemailer = require("nodemailer");

const jwt = require('jsonwebtoken');

// Tạo token JWT
const payload = { username: minhthoai }; // Ví dụ payload
const token = jwt.sign(payload, 'Xgq87@39f3MddjZ%2#yV&kHh5J2YxL56a1j1b9yC0', { expiresIn: '1h' });
console.log(token);

// Xác minh token JWT
jwt.verify(token, 'Xgq87@39f3MddjZ%2#yV&kHh5J2YxL56a1j1b9yC0', (err, decoded) => {
  if (err) {
    console.log('Token không hợp lệ');
  } else {
    console.log('Decoded payload:', decoded);
  }
});

// Thiết lập cấu hình email bằng nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "thoaitran.111117@gmail.com",
    pass: "Thoai123",
  },
});


const ACCOUNTS = [
  { ID: "user1", email: "user1@example.com", password: "old_password" },
  // Các tài khoản khác
];

// Tạo và gửi link reset mật khẩu
// Tạo và gửi link reset mật khẩu
exports.sendResetLink = (req, res) => {
    const { email } = req.body;
  
    const user = ACCOUNTS.find(account => account.email === email);
    if (!user) {
      return res.json({ success: false, message: "Email không tồn tại." });
    }
  
    const token = jwt.sign({ userID: user.ID }, 'Xgq87@39f3MddjZ%2#yV&kHh5J2YxL56a1j1b9yC0', { expiresIn: '1h' });
    const resetLink = `http://your_website/reset-password?token=${token}`;
  
    transporter.sendMail({
      from: "thoaitran.11117@gmail.com",  // Đây là email cố định của hệ thống
      to: email,  // Gửi tới email người dùng đã nhập
      subject: "Đặt lại mật khẩu",
      html: `<p>Click vào link dưới đây để đặt lại mật khẩu:</p><a href="${resetLink}">Đặt lại mật khẩu</a>`,
    }, (error, info) => {
      if (error) {
        return res.json({ success: false, message: "Không thể gửi email." });
      } else {
        return res.json({ success: true, message: "Email đặt lại mật khẩu đã được gửi." });
      }
    });
  };
  

exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userID = decoded.userID;

    const user = ACCOUNTS.find(account => account.ID === userID);
    if (!user) {
      return res.json({ success: false, message: "Người dùng không tồn tại." });
    }

    user.password = newPassword; 
    return res.json({ success: true, message: "Mật khẩu đã được đặt lại thành công!" });
  } catch (error) {
    return res.json({ success: false, message: "Liên kết không hợp lệ hoặc đã hết hạn." });
  }
};
