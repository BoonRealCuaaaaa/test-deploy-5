export enum DraftResponseDefaultRules {
  ALWAYS_APOLOGIZE = 'Always say sorry when customers are angry, do not blame them',
  NO_REFERENCE_SOURCES = 'Must not add reference source to your response',
}

export enum Topic {
  CONSULT_TO_CHOOSE_DELIVERY_OPTIONS = 'Consult to choose delivery options',
  COMPLIMENT = 'Compliment',
  COMPLAINT = 'Complaint',
  NOT_DETERMINED = 'Not determined',
  ISSUE = 'Issue',
  CONSULT_TO_CHOOSE_PRODUCT = 'Consult to choose a product',
}
export const DRAFT_RESPONSE_QUESTIONS_BASED_ON_TOPIC: { [key in Topic]?: string[] } = {
  [Topic.CONSULT_TO_CHOOSE_DELIVERY_OPTIONS]: [
    'When does the customer want to receive the delivery?',
    "What is the customer's detailed address?'",
  ],
  [Topic.CONSULT_TO_CHOOSE_PRODUCT]: ['Do you have any requirements for your desired product? '],
  [Topic.COMPLIMENT]: ['What feedback does the customer want to provide?'],
  [Topic.COMPLAINT]: ['What is the reason of the complaint?'],
  [Topic.NOT_DETERMINED]: ['What specific assistance does the customer require?'],
  [Topic.ISSUE]: ['What are the details of the issue the customer is facing?'],
};
