import { Type, Schema } from '@google/genai';

export const burdenAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    burdens: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'Unique identifier for this burden',
          },
          type: {
            type: Type.STRING,
            enum: ['claim', 'simple_question', 'counter_claim'],
            description: 'Type of burden',
          },
          status: {
            type: Type.STRING,
            enum: ['active', 'fulfilled', 'challenged', 'abandoned'],
            description: 'Current status of the burden',
          },
          claimText: {
            type: Type.STRING,
            description: 'The text of the claim',
          },
          claimMessageIndex: {
            type: Type.NUMBER,
            description: 'Message index where the claim was made',
          },
          claimant: {
            type: Type.STRING,
            enum: ['user', 'ai'],
            description: 'Who made the claim',
          },
          burdenHolder: {
            type: Type.STRING,
            enum: ['user', 'ai'],
            description: 'Who holds the burden of proof',
          },
          evidenceMessageIndices: {
            type: Type.ARRAY,
            items: {
              type: Type.NUMBER,
            },
            description: 'Message indices containing evidence for this burden',
          },
          isCriticalQuestion: {
            type: Type.BOOLEAN,
            description: 'Whether this burden involves a critical question',
          },
          criticalQuestionText: {
            type: Type.STRING,
            description: 'The text of the critical question (if applicable)',
            nullable: true,
          },
          criticalQuestionIndex: {
            type: Type.NUMBER,
            description: 'Message index of the critical question',
            nullable: true,
          },
          explanation: {
            type: Type.STRING,
            description: 'Explanation of why this burden exists',
          },
          assessment: {
            type: Type.STRING,
            description: 'Assessment of whether the burden has been fulfilled',
            nullable: true,
          },
          createdAt: {
            type: Type.NUMBER,
            description: 'Message index when this burden was created',
          },
          resolvedAt: {
            type: Type.NUMBER,
            description: 'Message index when this burden was resolved',
            nullable: true,
          },
        },
        required: [
          'id',
          'type',
          'status',
          'claimText',
          'claimMessageIndex',
          'claimant',
          'burdenHolder',
          'evidenceMessageIndices',
          'isCriticalQuestion',
          'explanation',
          'createdAt',
        ],
      },
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        userActiveBurdens: {
          type: Type.NUMBER,
          description: 'Number of active burdens held by the user',
        },
        aiActiveBurdens: {
          type: Type.NUMBER,
          description: 'Number of active burdens held by AI',
        },
        totalResolved: {
          type: Type.NUMBER,
          description: 'Total number of resolved burdens',
        },
        criticalQuestionsCount: {
          type: Type.NUMBER,
          description: 'Total number of critical questions',
        },
      },
      required: ['userActiveBurdens', 'aiActiveBurdens', 'totalResolved', 'criticalQuestionsCount'],
    },
  },
  required: ['burdens', 'summary'],
};
