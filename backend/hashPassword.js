// hashPassword.js
import bcrypt from 'bcryptjs';

const hashPassword = async () => {
  const plainPassword = "your_password_here";
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log(`Hashed Password: ${hashed}`);
};

hashPassword();
