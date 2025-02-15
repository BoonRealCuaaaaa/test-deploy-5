import { Outlet } from 'react-router-dom';

import AiSettingTabs from './components/tabs';

const AiSettingPage = () => {
  return (
    <div className="flex w-full flex-col items-center gap-y-5">
      <div className="w-full max-w-content">
        <AiSettingTabs />
        <Outlet />
      </div>
    </div>
  );
};

export default AiSettingPage;
