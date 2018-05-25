
let questionTypes: { [k: string]: number } = {
  goal: 1,
  difficulty: 2,
  appeal: 3,
  efficacy: 4
};

export const getQuestionTypeId = function (questionType: string): number {
  return questionTypes[questionType];
};


let responses: { [k: string]: number } = {
  goal: 6,
  try: 7,
  'outcome-fail': 8,
  'outcome-yes': 9
};

export const getResponseId = function (response: string): number {
  if (!response) {
    return null;
  }
  let parsed: number = parseInt(response);
  if (parsed > 0) {
    return parsed;
  }
  return responses[response];
};


