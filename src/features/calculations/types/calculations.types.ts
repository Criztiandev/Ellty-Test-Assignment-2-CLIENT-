export interface IUser {
  id: number;
  username: string;
}

export interface ICalculation {
  id: number;
  parent_id: number | null;
  user_id: number;
  operation: 'start' | '+' | '-' | '*' | '/';
  number: number;
  result: number;
  depth: number;
  created_at: string;
}

export interface ICalculationNode extends ICalculation {
  username: string;
  children: ICalculationNode[];
  _optimistic?: boolean; // Flag for optimistic updates
}

export interface ICreateStartingNumberInput {
  number: number;
}

export interface IAddOperationInput {
  operation: '+' | '-' | '*' | '/';
  number: number;
}

export interface IApiResponse<T> {
  payload: T;
  message: string;
}

export interface IApiError {
  error: string | object;
  message: string;
}
