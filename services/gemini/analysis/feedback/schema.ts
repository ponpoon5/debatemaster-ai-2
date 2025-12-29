import { Type, Schema } from '@google/genai';

// Shared components
export const toulminElementSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING },
    status: { type: Type.STRING, enum: ['strong', 'weak', 'missing'] },
    comment: { type: Type.STRING },
  },
  required: ['text', 'status', 'comment'],
};

export const sessionMetricSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    key: { type: Type.STRING },
    label: { type: Type.STRING },
    rate: {
      type: Type.OBJECT,
      properties: {
        numerator: { type: Type.INTEGER },
        denominator: { type: Type.INTEGER },
      },
      required: ['numerator', 'denominator'],
    },
    score: { type: Type.INTEGER },
  },
  required: ['key', 'label', 'rate', 'score'],
};

export const metricRubricSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    key: { type: Type.STRING },
    label: { type: Type.STRING },
    score: { type: Type.NUMBER },
    weight: { type: Type.NUMBER },
    descriptor: { type: Type.STRING },
  },
  required: ['key', 'label', 'score', 'weight', 'descriptor'],
};

export const exemplarItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    level: { type: Type.STRING, enum: ['Mastery', 'Secure', 'Developing', 'Error'] },
    label: { type: Type.STRING },
    text: { type: Type.STRING },
    explanation: { type: Type.STRING },
    score: { type: Type.NUMBER },
  },
  required: ['level', 'label', 'text', 'explanation', 'score'],
};

export const exemplarMetricSetSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    metricKey: { type: Type.STRING },
    metricLabel: { type: Type.STRING },
    items: { type: Type.ARRAY, items: exemplarItemSchema },
  },
  required: ['metricKey', 'metricLabel', 'items'],
};

export const trainingRecommendationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    label: { type: Type.STRING },
    description: { type: Type.STRING },
    actionType: {
      type: Type.STRING,
      enum: ['open_minigame', 'open_textbook', 'open_thinking_gym', 'start_drill', 'start_study'],
    },
    actionPayload: {
      type: Type.OBJECT,
      properties: {
        minigameType: {
          type: Type.STRING,
          enum: [
            'EVIDENCE_FILL',
            'FALLACY_QUIZ',
            'ISSUE_PUZZLE',
            'COMBO_REBUTTAL',
            'FERMI_ESTIMATION',
            'LATERAL_THINKING',
            'ACTIVE_INOCULATION',
          ],
        },
        textbookChapterId: { type: Type.INTEGER },
        thinkingFramework: {
          type: Type.STRING,
          enum: ['toulmin', 'premise_check', 'issue_analysis'],
        },
        drillTopic: { type: Type.STRING },
        studyTopic: { type: Type.STRING },
      },
    },
  },
  required: ['id', 'label', 'description', 'actionType', 'actionPayload'],
};

export const sbiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    situation: { type: Type.STRING },
    behavior: { type: Type.STRING },
    impact: { type: Type.STRING },
  },
  required: ['situation', 'behavior', 'impact'],
};

export const feedbackSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    advice: { type: Type.STRING },
    metrics: {
      type: Type.OBJECT,
      properties: {
        logic: { type: Type.INTEGER },
        evidence: { type: Type.INTEGER },
        rebuttal: { type: Type.INTEGER },
        persuasion: { type: Type.INTEGER },
        consistency: { type: Type.INTEGER },
        constructiveness: { type: Type.INTEGER },
        objectivity: { type: Type.INTEGER },
        clarity: { type: Type.INTEGER },
      },
      required: [
        'logic',
        'evidence',
        'rebuttal',
        'persuasion',
        'consistency',
        'constructiveness',
        'objectivity',
        'clarity',
      ],
    },
    detailedReview: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          messageIndex: { type: Type.INTEGER },
          score: { type: Type.INTEGER },
          critique: { type: Type.STRING },
          sbi: sbiSchema,
          betterResponse: { type: Type.STRING },
          fallacy: { type: Type.STRING, nullable: true },
          fallacyQuote: { type: Type.STRING },
          fallacyExplanation: { type: Type.STRING },
        },
        required: ['messageIndex', 'score', 'sbi'],
      },
    },
    rubricDetails: { type: Type.ARRAY, items: metricRubricSchema, nullable: true },
    sessionMetrics: { type: Type.ARRAY, items: sessionMetricSchema, nullable: true },
    trainingRecommendations: {
      type: Type.ARRAY,
      items: trainingRecommendationSchema,
      nullable: true,
    },

    exemplars: { type: Type.ARRAY, items: exemplarMetricSetSchema },

    logicAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          summary: { type: Type.STRING },
          claim: toulminElementSchema,
          data: toulminElementSchema,
          warrant: toulminElementSchema,
        },
        required: ['type', 'summary', 'claim', 'data', 'warrant'],
      },
    },
    rhetoric: {
      type: Type.OBJECT,
      properties: {
        ethos: { type: Type.INTEGER },
        pathos: { type: Type.INTEGER },
        logos: { type: Type.INTEGER },
        affirmationScore: { type: Type.INTEGER },
        affirmationComment: { type: Type.STRING },
      },
      required: ['ethos', 'pathos', 'logos', 'affirmationScore', 'affirmationComment'],
      nullable: true,
    },
    questioningAnalysis: {
      type: Type.OBJECT,
      properties: {
        stats: {
          type: Type.OBJECT,
          properties: {
            openCount: { type: Type.INTEGER },
            closedCount: { type: Type.INTEGER },
            subtleCount: { type: Type.INTEGER },
            score: { type: Type.INTEGER },
            advice: { type: Type.STRING },
          },
          required: ['openCount', 'closedCount', 'subtleCount', 'score', 'advice'],
        },
        details: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              messageIndex: { type: Type.INTEGER },
              questionText: { type: Type.STRING },
              type: { type: Type.STRING },
              effectiveness: { type: Type.INTEGER },
              comment: { type: Type.STRING },
            },
            required: ['messageIndex', 'questionText', 'type', 'effectiveness', 'comment'],
          },
        },
      },
      required: ['stats', 'details'],
    },
    facilitation: {
      type: Type.OBJECT,
      properties: {
        understandingScore: { type: Type.INTEGER },
        organizingScore: { type: Type.INTEGER },
        consensusScore: { type: Type.INTEGER },
        feedback: { type: Type.STRING },
      },
      required: ['understandingScore', 'organizingScore', 'consensusScore', 'feedback'],
      nullable: true,
    },
    storyAnalysis: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        decisionScore: { type: Type.INTEGER },
        consensusScore: { type: Type.INTEGER },
        outcome: { type: Type.STRING },
        socialImpact: {
          type: Type.OBJECT,
          properties: {
            economic: { type: Type.STRING },
            publicSentiment: { type: Type.STRING },
            ethical: { type: Type.STRING },
          },
          required: ['economic', 'publicSentiment', 'ethical'],
        },
        alternativeScenario: { type: Type.STRING },
      },
      required: [
        'decisionScore',
        'consensusScore',
        'outcome',
        'socialImpact',
        'alternativeScenario',
      ],
    },
    demoAnalysis: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        summary: { type: Type.STRING },
        clashAnalysis: {
          type: Type.OBJECT,
          properties: {
            agenda: { type: Type.STRING },
            pro: {
              type: Type.OBJECT,
              properties: {
                claim: { type: Type.STRING },
                data: { type: Type.STRING },
                warrant: { type: Type.STRING },
              },
              required: ['claim', 'data', 'warrant'],
            },
            con: {
              type: Type.OBJECT,
              properties: {
                counter: { type: Type.STRING },
                evidence: { type: Type.STRING },
                impact: { type: Type.STRING },
              },
              required: ['counter', 'evidence', 'impact'],
            },
            synthesis: { type: Type.STRING },
          },
          required: ['agenda', 'pro', 'con', 'synthesis'],
        },
        highlights: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              technique: { type: Type.STRING },
              description: { type: Type.STRING },
              effect: { type: Type.STRING },
            },
            required: ['technique', 'description', 'effect'],
          },
        },
        learningPoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              point: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ['point', 'reason'],
          },
        },
      },
      required: ['summary', 'clashAnalysis', 'highlights', 'learningPoints'],
    },
  },
  required: [
    'score',
    'summary',
    'strengths',
    'weaknesses',
    'advice',
    'metrics',
    'detailedReview',
    'logicAnalysis',
    'questioningAnalysis',
    'exemplars',
  ],
};
