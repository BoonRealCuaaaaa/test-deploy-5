export enum GettingStartedTaskName {
  INTEGRATION = 'Integration',
  RULE = 'Rule',
}

export interface IGettingStartedTask {
  id: string;
  title: string;
  link: string;
  name: GettingStartedTaskName;
  createdAt: Date;
  updatedAt: Date;
}
