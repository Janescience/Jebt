import { useEffect, useState } from "react";

const UserAvatar = ({ username }) => {

    const [avatar,setAvatar] = useState('/user.png')

    useEffect(() => {
        fetchAvatar()
    },[username])

    const fetchAvatar = async () => {
        const res = await fetch(`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`);
        if(res.ok){
            setAvatar(res.url);
        }
    };

    return (
        <img
            src={avatar}
            alt={username}
            className="rounded-full object-cover shadow-lg block bg-gray-100 dark:bg-gray-800 w-6 h-6 mr-3 inline-flex"
        />
    )
}
export default UserAvatar;