const UserAvatar = ({ username, avatar }) => (
    <img
        src={avatar}
        alt={username}
        class="rounded-full  object-cover shadow-lg block bg-gray-100 dark:bg-gray-800 w-6 h-6 mr-3 inline-flex"
    />
  );
  
  export default UserAvatar;