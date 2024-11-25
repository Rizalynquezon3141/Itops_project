import React from 'react'

const ProfilePicture = ({ user }) => {
    const profileImageUrl = user.profileString
      ? `/profile/${user.profileString}` // If profile image exists, display it
      : "https://openui.fly./openui/100x100.svg?text=👤"; // If no image, display default profile image
  
    return <img src={profileImageUrl} alt="User Profile" className="userProfilePic" />;
  };
  
  export default ProfilePicture;