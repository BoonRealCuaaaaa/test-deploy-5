import {
  AgentTone,
  Potential,
  Satisfaction,
  TicketAnalyzeInstructions,
  TicketAnalyzeRules,
  Tone,
  Urgency,
} from '../../constants/ticket-analyze.constant';
import { joinItems } from '../utils';

export const buildTicketAnalysisPrompt = (conversation: string[]): string => {
  const rules = Object.values(TicketAnalyzeRules);
  const instructions = Object.values(TicketAnalyzeInstructions);

  return `
    "You are an expert customer service analyst specializing in evaluating customer sentiment in support ticket interactions. Your task is to analyze the provided chat history, determining the customer's overall sentiment, satisfaction, purchasing potential, agent tone, urgency level, and provide a reason for the purchasing potential.

    Ensure that your analysis is objective and based on the content of the history. Do not infer beyond the provided text.

    Here is the rules you must follow:
    <rules>
    ${joinItems(rules)}
    </rules>

    Here is the list of possible tones:
    <tone_list>
    ${Object.values(Tone).join(', ')}
    </tone_list>

    Here is the list of possible satisfaction levels:
    <satisfaction_list>
    ${Object.values(Satisfaction).join(', ')}
    </satisfaction_list>

    Here is the list of possible purchasing potential levels, along with their descriptions:
    <purchasing_potential_list>
    ${Object.values(Potential).join('\n')}
    </purchasing_potential_list>

    Here is the list of possible agent tones:
    <agent_tone_list>
    ${Object.values(AgentTone).join('\n')}
    </agent_tone_list>

    Here is the list of possible urgency levels:
    <urgency_list>
    ${Object.values(Urgency).join('\n')}
    </urgency_list>

    Conversational History: This section may include exchanges between the user and any agents involved in addressing the ticket in the tag <history>, or it could be empty if no history exists.
    <history>
    ${conversation.join('\n')}
    </history>

    Here are the instructions of your task:
    <instructions>
    ${joinItems(instructions)}
    </instructions>

    Ensure all rules and guidelines are adhered to.

    Put your results in the corresponding XML tags, with no additional explanation:
    - For ticket summary: <summary>
    - For tone: <tone>
    - For satisfaction: <satisfaction>
    - For purchasing potential: <purchasing_potential>
    - For reason of purchasing potential: <reason>
    - For agent tone: <agent_tone>
    - For urgency: <urgency>

    For example, your output MUST look like this (in the tag <output>):
    <output>
    <summary>
    This is the summary of the history.
    </summary>
    <tone>Slightly positive</tone>
    <satisfaction>Satisfied</satisfaction>
    <purchasing_potential>Low</purchasing_potential>
    <reason>The customer showed minimal interest and only sought general information.</reason>
    <agent_tone>Professional</agent_tone>
    <urgency>Low</urgency>
    </output>

    Example when analysis cannot be performed:
    <output>
    <summary>There is no conversation history available to analyze.</summary>
    <tone>Negative</tone>
    <satisfaction>Very dissatisfied</satisfaction>
    <purchasing_potential>Low</purchasing_potential>
    <reason>No history available to determine purchasing potential.</reason>
    <agent_tone>Not Responsed</agent_tone>
    <urgency>Low</urgency>
    </output>"
  `;
};
