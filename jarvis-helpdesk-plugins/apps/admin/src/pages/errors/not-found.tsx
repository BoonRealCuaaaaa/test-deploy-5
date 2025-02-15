import { useNavigate } from 'react-router-dom';

import { Button } from '@/src/components/button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-4">
      <div className="text-5xl font-bold">Not found Page</div>
      <Button variant={'primary'} onClick={() => navigate('/')}>
        Go back
      </Button>
    </div>
  );
};

export default NotFoundPage;
