import MemberTable from './components/table';
import MemberTitle from './components/title';

const MemberPage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-5 px-10">
      <div className="w-full max-w-content">
        <MemberTitle />
      </div>
      <div className="w-full max-w-content">
        <MemberTable />
      </div>
    </div>
  );
};

export default MemberPage;
