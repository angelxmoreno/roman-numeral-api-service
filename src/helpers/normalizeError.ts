import { HttpError } from 'routing-controllers';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: number;
  httpCode?: number;
}

interface ErrorContainer {
  errors?: ((ErrorWithStatus & ErrorContainer) | string)[];
}

export type GenericError = ErrorContainer & ErrorWithStatus & HttpError;
export interface ErrorPayload {
  status: number;
  message: string;
  type?: string;
  errors?: ErrorPayload[];
}

const normalizeError = (error: GenericError | string): ErrorPayload => {
  let status = 500;
  let message = 'Unknown Error';
  let errors;
  let type: string | undefined;
  if (typeof error === 'string') {
    status = 500;
    message = error;
  } else if (error.httpCode) {
    status = error.httpCode;
    message = error.message || error.name;
    type = error.message ? error.name : undefined;
  } else if (error.message) {
    status = error.status && error.status > 0 ? error.status : status;
    message = error.message;
    type = error.name;
  } else if (error.errors) {
    status = 500;
    message = 'Multiple Errors';
    errors = error.errors.map(row => normalizeError(row as GenericError));
    if (errors.length === 1) {
      return errors[0];
    }
  } else {
    console.log('Unable to parse error: ', error);
    console.log('type', error.name);
  }

  return { status, message, errors, type };
};

export default normalizeError;
