import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://i.pinimg.com/originals/4d/2e/0a/4d2e0a694015f3d2f840873d01aa5fd4.jpg",
    },
}, { timestap: true });

const User = mongoose.model("User", userSchema);

export default User;