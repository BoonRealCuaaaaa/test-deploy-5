export interface ITeam {
  role: string;
  team: {
    displayName: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  totalMembers: number;
}
