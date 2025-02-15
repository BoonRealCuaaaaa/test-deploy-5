import { useLocation } from 'react-router-dom';
interface LocationState {
  errorMessage?: string;
}

const InterruptsPage: React.FC = () => {
  const location = useLocation();

  const state = location.state as LocationState | null;
  const errorMessage = state?.errorMessage;

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-y-4">
      <div className="text-5xl font-bold">Oops, something's off</div>
      <div className="text-2xl font-medium">{errorMessage}</div>
    </div>
  );
};

export default InterruptsPage;
