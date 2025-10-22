/**
 * Calculate result based on operation (client-side for optimistic updates)
 * Must match server-side logic
 */
export const calculateResult = (
  leftOperand: number,
  operation: '+' | '-' | '*' | '/',
  rightOperand: number
): number => {
  let result: number;

  switch (operation) {
    case '+':
      result = leftOperand + rightOperand;
      break;
    case '-':
      result = leftOperand - rightOperand;
      break;
    case '*':
      result = leftOperand * rightOperand;
      break;
    case '/':
      if (rightOperand === 0) {
        throw new Error('Division by zero is not allowed');
      }
      result = leftOperand / rightOperand;
      break;
    default:
      throw new Error('Invalid operation');
  }

  // Round to 2 decimal places
  result = Math.round(result * 100) / 100;

  // Check limits (±1,000,000)
  if (result > 1_000_000 || result < -1_000_000) {
    throw new Error('Result exceeds limit (±1,000,000)');
  }

  return result;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
