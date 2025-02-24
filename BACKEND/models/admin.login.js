// models/Admin.js
import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }, // Role identifier
});



export default mongoose.model('Admin', adminSchema);