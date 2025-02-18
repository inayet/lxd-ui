import { handleResponse } from "util/helpers";
import {
  LxdOperation,
  LxdOperationList,
  LxdOperationResponse,
} from "types/operation";
import { LxdApiResponse } from "types/apiResponse";

export const TIMEOUT_300 = 300;
export const TIMEOUT_120 = 120;
export const TIMEOUT_60 = 60;
export const TIMEOUT_10 = 10;

export const watchOperation = (
  operationUrl: string,
  timeout = TIMEOUT_10,
): Promise<LxdOperationResponse> => {
  return new Promise((resolve, reject) => {
    const operationParts = operationUrl.split("?");
    const baseUrl = operationParts[0];
    const queryString = operationParts.length === 1 ? "" : operationParts[1];
    fetch(`${baseUrl}/wait?timeout=${timeout}&${queryString}`)
      .then(handleResponse)
      .then((data: LxdOperationResponse) => {
        if (data.metadata.status === "Success") {
          return resolve(data);
        }
        if (data.metadata.status === "Running") {
          throw Error(
            "Timeout while waiting for the operation to succeed. Watched operation continues in the background.",
          );
        } else if (data.metadata.status === "Cancelled") {
          throw new Error("Cancelled");
        } else {
          throw Error(data.metadata.err);
        }
      })
      .catch(reject);
  });
};

const sortOperationList = (operations: LxdOperationList) => {
  const newestFirst = (a: LxdOperation, b: LxdOperation) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  };
  operations.failure?.sort(newestFirst);
  operations.success?.sort(newestFirst);
  operations.running?.sort(newestFirst);
};

export const fetchOperations = (project: string): Promise<LxdOperationList> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/operations?project=${project}&recursion=1`)
      .then(handleResponse)
      .then((data: LxdApiResponse<LxdOperationList>) => {
        sortOperationList(data.metadata);
        return resolve(data.metadata);
      })
      .catch(reject);
  });
};

export const fetchAllOperations = (): Promise<LxdOperationList> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/operations?all-projects=true&recursion=1`)
      .then(handleResponse)
      .then((data: LxdApiResponse<LxdOperationList>) => {
        sortOperationList(data.metadata);
        return resolve(data.metadata);
      })
      .catch(reject);
  });
};

export const cancelOperation = (id: string): Promise<LxdOperationList> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/operations/${id}`, {
      method: "DELETE",
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};
