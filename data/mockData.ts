import { Objective, User, Team } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=u1', teamId: 't1' },
  { id: 'u2', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=u2', teamId: 't1' },
  { id: 'u3', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=u3', teamId: 't2' },
  { id: 'u4', name: 'Bob Williams', avatarUrl: 'https://i.pravatar.cc/150?u=u4', teamId: 't2' },
  { id: 'ceo', name: 'Sarah Chen (CEO)', avatarUrl: 'https://i.pravatar.cc/150?u=ceo' },
];

export const mockTeams: Team[] = [
  { id: 't1', name: 'Product & Engineering' },
  { id: 't2', name: 'Marketing & Sales' },
];

export const mockObjectives: Objective[] = [
  {
    id: 'o1',
    title: 'Achieve Product-Market Fit and Accelerate Growth',
    ownerId: 'ceo',
    ownerType: 'User',
    type: 'Company',
    level: 'Aspirational',
    parentId: null,
    cycle: 'Q3 2024',
    keyResults: [
      { id: 'kr1-1', description: 'Increase North American MAU from 50k to 100k', currentValue: 65000, targetValue: 100000, unit: 'users' },
      { id: 'kr1-2', description: 'Achieve a Net Promoter Score (NPS) of 45', currentValue: 38, targetValue: 45, unit: 'points' },
      { id: 'kr1-3', description: 'Generate $1M in new Annual Recurring Revenue (ARR)', currentValue: 650000, targetValue: 1000000, unit: '$' },
    ],
  },
  {
    id: 'o2',
    title: 'Launch Version 2.0 of the Platform',
    ownerId: 't1',
    ownerType: 'Team',
    type: 'Team',
    level: 'Committed',
    parentId: 'o1',
    cycle: 'Q3 2024',
    keyResults: [
      { id: 'kr2-1', description: 'Reduce average API response time to under 150ms', currentValue: 145, targetValue: 150, unit: 'ms' },
      { id: 'kr2-2', description: 'Achieve 95% test coverage for the new microservices', currentValue: 96, targetValue: 95, unit: '%' },
      { id: 'kr2-3', description: 'Complete beta testing with 10 enterprise clients', currentValue: 8, targetValue: 10, unit: 'clients' },
    ],
    reflection: 'The team did an amazing job on performance and test coverage. We fell short on beta testers because of delays in the sales pipeline, which is a key dependency to manage better next quarter. The platform is stable and feedback is positive.'
  },
  {
    id: 'o3',
    title: 'Increase Marketing Qualified Leads (MQLs)',
    ownerId: 't2',
    ownerType: 'Team',
    type: 'Team',
    level: 'Committed',
    parentId: 'o1',
    cycle: 'Q3 2024',
    keyResults: [
      { id: 'kr3-1', description: 'Generate 5,000 new MQLs from organic search', currentValue: 2100, targetValue: 5000, unit: 'leads' },
      { id: 'kr3-2', description: 'Achieve a 4% conversion rate on the new landing page', currentValue: 2.5, targetValue: 4, unit: '%' },
    ],
  },
  {
    id: 'o4',
    title: 'Refactor the Authentication Service',
    ownerId: 'u1',
    ownerType: 'User',
    type: 'Individual',
    level: 'Committed',
    parentId: 'o2',
    cycle: 'Q3 2024',
    keyResults: [
        { id: 'kr4-1', description: 'Migrate all endpoints to the new authentication JWT standard', currentValue: 100, targetValue: 100, unit: '%' },
        { id: 'kr4-2', description: 'Reduce login-related support tickets by 50%', currentValue: 40, targetValue: 50, unit: '%' },
    ],
  },
   {
    id: 'o5',
    title: 'Develop Q3 Content Marketing Plan',
    ownerId: 'u3',
    ownerType: 'User',
    type: 'Individual',
    level: 'Aspirational',
    parentId: 'o3',
    cycle: 'Q3 2024',
    keyResults: [
        { id: 'kr5-1', description: 'Publish 4 high-quality blog posts driving 10k views', currentValue: 2, targetValue: 4, unit: 'posts' },
        { id: 'kr5-2', description: 'Launch one new e-book and get 500 downloads', currentValue: 412, targetValue: 500, unit: 'downloads' },
    ],
  },
];