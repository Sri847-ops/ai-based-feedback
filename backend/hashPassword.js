// hashPassword.js
import bcrypt from 'bcryptjs';

const hashPassword = async () => {
  const plainPassword = "root";
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log(`Hashed Password: ${hashed}`);
};

hashPassword();
