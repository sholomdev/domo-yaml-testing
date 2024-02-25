import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import domo from 'ryuu.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

export function downloadText(text: string) {
  const hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI(text);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'DomoDatasetTesting.yml';
  hiddenElement.click();
}

export const startCodeEngineFunction = async <T>(
  functionAlias: string,
  inputParameters = {}
) => {
  if (import.meta.env.DEV) {
    return;
  }
  return await domo.post<T>(
    `/domo/codeengine/v2/packages/${functionAlias}`,
    inputParameters
  );
};
