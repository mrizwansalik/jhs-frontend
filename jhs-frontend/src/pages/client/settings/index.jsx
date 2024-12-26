/* eslint-disable */
import React, {useEffect} from 'react';

import BasicSetting from './BasicSetting';
import ChangeUserPassword from './ChangeUserPassword';
import NotificationsSetting from './NotificationsSetting';
import DeleteAccount from './DeleteAccount';

const Settings = () => {

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
        {/* Basic info*/}
        <BasicSetting />
        {/* Password*/}
        <ChangeUserPassword />
        {/* Notifications*/}
        <NotificationsSetting />
        {/* Delete account*/}
        <DeleteAccount />
      </div>
    </>
  );
};

export default Settings;