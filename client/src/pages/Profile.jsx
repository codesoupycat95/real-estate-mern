import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase.js";
import { Link } from "react-router-dom";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice.js";

export const Profile = () => {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();

    // Firebase Image Storage Rules::
    // allow read;
    // allow write: if
    // request.resource.size < 2 * 1024 * 1024 &&
    // request.resource.contentType.matches('images/.*')

    // Firebase issue still persists and for now the rule has changed to only read and write and it works for now
    // It will scan anything and will store anything as there's the issue with the firebase rules.

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state changed', (snapshot) => {                // snapshot here is a piece of information which we get on each state change
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePercentage(Math.round(progress));
        },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) =>
                        setFormData({ ...formData, avatar: downloadURL })
                    );
            });
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();     // preventDefault() prevents the default behaviour which is refresh of the page here during submission.
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        }
        catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    }

    const handleDeleteUser = async (e) => {
        try {
            dispatch(deleteUserStart());
            const response = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }

            dispatch(deleteUserSuccess(data));
        }
        catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignOut = async (e) => {
        try {
            dispatch(signOutUserStart());
            const response = await fetch(`/api/auth/signout`);   // default method is GET so we don't need to mention anything
            const data = await response.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        }
        catch (error) {
            dispatch(signOutUserFailure(error.message));
        }
    }

    return (
        <>
            <div className="p-3 max-w-lg mx-auto">
                <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
                    <img
                        onClick={() => fileRef.current.click()}
                        src={formData.avatar || currentUser.avatar} alt="profile"
                        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                    />
                    <p className="text-sm self-center">    {/* "text-center" class also works here */}
                        {fileUploadError ? (
                            <span className="text-red-700">Error Image Upload
                                (Image must be less than 2 megabytes)</span>
                        ) : filePercentage > 0 && filePercentage < 100 ? (
                            <span className="text-slate-700">
                                {`Uploading ${filePercentage}`}
                            </span>
                        ) : filePercentage === 100 ? (
                            <span className="text-green-700">Image Successfully Uploaded!</span>
                        ) : (
                            ""
                        )
                        }
                    </p>
                    <input type="text" placeholder="username" id="username" defaultValue={currentUser.username} onChange={handleChange} className="boder p-2 rounded-lg " />
                    <input type="email" placeholder="email" id="email" defaultValue={currentUser.email} onChange={handleChange} className="boder p-2 rounded-lg " />
                    <input type="password" placeholder="password" id="password" defaultValue={currentUser.password} onChange={handleChange} className="boder p-2 rounded-lg " />
                    <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 ">
                        {loading ? "Loading..." : "Update"}
                    </button>
                    <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
                        Create Listing
                    </Link>
                </form>
                <div className="flex justify-between mt-5">
                    <span onClick={handleDeleteUser} className="text-red-700 capitalize cursor-pointer">delete account</span>
                    <span onClick={handleSignOut} className="text-red-700 capitalize cursor-pointer">sign out</span>
                </div>

                <p className="text-red-700 mt-5">{error ? error : ""}</p>
                <p className="text-green-700 mt-5">{updateSuccess ? "User is updated successfully!" : ""}</p>
            </div >
        </>
    );
}