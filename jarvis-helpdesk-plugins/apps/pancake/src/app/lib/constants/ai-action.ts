import { AIAction } from '../types/types';

export enum ToolType {
  DRAFT = 'draft',
  CORRECTNESS = 'correctness',
  CASUAL = 'casual',
  PROFESSION = 'profession',
  SHORTENING = 'shortening',
  LENGTHENING = 'lengthening',
  SIMPLIFICATION = 'simplification',
}

export const AI_ACTIONS: Record<ToolType, AIAction> = {
  [ToolType.DRAFT]: {
    title: 'Draft response',
    OnWorking: 'Drafting response...',
    OnSuccess: 'Response drafted successfully',
    OnFailed: 'Failed to draft response',
  },

  [ToolType.CORRECTNESS]: {
    title: 'Correct spelling',
    OnWorking: 'Correcting spelling...',
    OnSuccess: 'Spelling corrected successfully',
    OnFailed: 'Failed to correct spelling',
  },

  [ToolType.CASUAL]: {
    title: 'Make it more casual',
    OnWorking: 'Making it more casual...',
    OnSuccess: 'Response made more casual successfully',
    OnFailed: 'Failed to make response more casual',
  },

  [ToolType.PROFESSION]: {
    title: 'Make it more professional',
    OnWorking: 'Making it more professional...',
    OnSuccess: 'Response made more professional successfully',
    OnFailed: 'Failed to make response more professional',
  },

  [ToolType.SHORTENING]: {
    title: 'Shorten response',
    OnWorking: 'Shortening response...',
    OnSuccess: 'Response shortened successfully',
    OnFailed: 'Failed to shorten response',
  },

  [ToolType.LENGTHENING]: {
    title: 'Lengthen response',
    OnWorking: 'Lengthening response...',
    OnSuccess: 'Response lengthened successfully',
    OnFailed: 'Failed to lengthen response',
  },

  [ToolType.SIMPLIFICATION]: {
    title: 'Simplify words',
    OnWorking: 'Simplifying words...',
    OnSuccess: 'Words simplified successfully',
    OnFailed: 'Failed to simplify words',
  },
};
