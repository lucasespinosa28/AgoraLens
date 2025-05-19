import {
    type OperationHandler,
    type SigningError,
    type TransactionIndexingError,
    type UnauthenticatedError,
    type UnexpectedError,
    type ValidationError,
    type CreateGroupRequest,
    type Group,
    expectTypename,
    nonNullable,
} from '@lens-protocol/client';
import { createGroup, fetchGroup } from '@lens-protocol/client/actions';
import { invariant, ResultAsync, useSessionClient, type AsyncTaskState } from '@lens-protocol/react';
import { useRef, useCallback, useEffect, useState } from 'react';
import { Deferred } from '@lens-protocol/types';
import type { SessionClient } from '@lens-protocol/client';

type UseAsyncTask<TInput, TValue, TError> = AsyncTaskState<TValue, TError> & {
    execute: AsyncTask<TInput, ResultAsync<TValue, TError>>;
};

type DeferredCall<TInput, TValue, TError> = {
    input: TInput;
    result: ResultAsync<TValue, TError>;
    deferred: Deferred<TValue>;
};

 type AsyncTask<TInput, TResult extends ResultAsync<unknown, unknown>> = (
  input: TInput,
) => TResult;

type AuthenticatedAsyncTask<TInput, TResult extends ResultAsync<unknown, unknown>> = (
  sessionClient: SessionClient,
  input: TInput,
) => TResult;

const AsyncTaskState = {
  Idle: <TData, TError>(): AsyncTaskState<TData, TError> => ({
    called: false,
    loading: false,
    data: undefined,
    error: undefined,
  }),
  Loading: <TData, TError>(data?: TData): AsyncTaskState<TData, TError> => ({
    called: true,
    loading: true,
    data,
    error: undefined,
  }),
  Success: <TData, TError>(data: TData): AsyncTaskState<TData, TError> => ({
    called: true,
    loading: false,
    data,
    error: undefined,
  }),
  Failed: <TData, TError>(error: TError): AsyncTaskState<TData, TError> => ({
    called: true,
    loading: false,
    data: undefined,
    error,
  }),
};

function useAuthenticatedAsyncTask<
  TInput,
  TValue,
  TError,
  TResult extends ResultAsync<TValue, TError>,
>(handler: AuthenticatedAsyncTask<TInput, TResult>): UseAsyncTask<TInput, TValue, TError> {
  const { data: sessionClient, loading } = useSessionClient();

  const pendingRequests = useRef<DeferredCall<TInput, TValue, TError>[]>([]);

  const safeHandler = useCallback(
    (input: TInput) => {
      if (loading) {
        const deferredCall: DeferredCall<TInput, TValue, TError> = createDeferredCall(input);
        pendingRequests.current.push(deferredCall);

        return deferredCall.result;
      }

      invariant(
        sessionClient,
        'It appears that you are not logged in. Please log in before attempting this.',
      );

      return handler(sessionClient, input);
    },
    [handler, sessionClient, loading],
  );

  useEffect(() => {
    if (loading === false) {
      for (const { input, deferred } of pendingRequests.current) {
        safeHandler(input).match(deferred.resolve, deferred.reject);
      }
    }
  }, [safeHandler, loading]);

  return useAsyncTask(safeHandler);
}

function createDeferredCall<TInput, TValue, TError>(
    input: TInput,
): DeferredCall<TInput, TValue, TError> {
    const deferred = new Deferred<TValue>();

    return {
        input,
        result: ResultAsync.fromPromise(deferred.promise, (err) => err as TError),
        deferred,
    };
}



function useAsyncTask<TInput, TValue, TError, TResult extends ResultAsync<TValue, TError>>(
    handler: AsyncTask<TInput, TResult>,
): UseAsyncTask<TInput, TValue, TError> {
    const [state, setState] = useState(AsyncTaskState.Idle<TValue, TError>());

    const execute = useCallback(
        (input: TInput) => {
            invariant(!state.loading, 'Cannot execute a task while another is in progress.');

            setState(({ data }) => {
                return {
                    called: true,
                    loading: true,
                    data,
                    error: undefined,
                };
            });

            const result = handler(input);

            result.match(
                (value) => setState(AsyncTaskState.Success(value)),
                (error) => setState(AsyncTaskState.Failed(error)),
            );

            return result;
        },
        [handler, state],
    );

    return {
        ...state,
        execute,
    };
}

/**
 * Creates a new group on Lens.
 *
 * @alpha This is an alpha API and may be subject to breaking changes.
 */
export function useCreateGroup(
    handler: OperationHandler,
): UseAsyncTask<
    CreateGroupRequest,
    Group,
    SigningError | ValidationError | TransactionIndexingError | UnauthenticatedError | UnexpectedError
> {
    return useAuthenticatedAsyncTask((sessionClient, request) =>
        createGroup(sessionClient, request)
            .andThen(handler)
            .andThen(sessionClient.waitForTransaction)
            .andThen((txHash) => fetchGroup(sessionClient, { txHash }))
            .map(nonNullable)
            .map(expectTypename('Group')),
    );
}
