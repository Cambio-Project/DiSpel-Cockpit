export enum LogicOperator {
  EQUAL = 'equal',
  SMALLER_EQUAL = 'smallerEqual',
  SMALLER = 'smaller',
  BIGGER_EQUAL = 'biggerEqual',
  BIGGER = 'bigger',
  UP = 'trendUpward',
  UP_STRICT = 'trendUpwardStrict',
  DOWN = 'trendDownward',
  DOWN_STRICT = 'trendDownwardStrict',
}

export function requiresComparisonValue(operator: LogicOperator): boolean {
  return operator == LogicOperator.BIGGER || operator == LogicOperator.BIGGER_EQUAL || operator == LogicOperator.SMALLER || operator == LogicOperator.SMALLER_EQUAL || operator == LogicOperator.EQUAL
}

export const LOGIC_OPERATOR_OPTIONS = Object.values(LogicOperator);
