import React from 'react';

import SignUp from "../../SignOut/SignOut";

export default function SettingsPopup({data}) {
  return <div className='settingspopup absolute w-full md:w-80 bg-gray-500 p-5 left-0 md:left-auto md:right-4 top-[65px]'>
    {data.fullname}
    <SignUp />
  </div>
}
