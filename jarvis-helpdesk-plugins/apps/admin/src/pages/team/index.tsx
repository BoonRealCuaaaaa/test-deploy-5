import TeamList from './components/list';
import TeamEmptyPlaceholder from './components/list/empty-placeholder';
import TeamTitle from './components/title';

const TeamPage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-5 px-10">
      <div className="mb-5 w-full max-w-content">
        <TeamTitle />
      </div>
      <div className="w-full max-w-content">
        <TeamList emptyPlaceholder={<TeamEmptyPlaceholder />} />
      </div>
    </div>
  );
};

export default TeamPage;
