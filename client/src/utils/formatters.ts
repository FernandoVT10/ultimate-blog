import { AxiosError } from "axios";

import moment from "moment";

export const dateToTimeAgo = (date: string): string => {
  const stringDate = moment(date).fromNow();

  return stringDate.slice(0, 1).toUpperCase() + stringDate.slice(1);
};

export const getDayAndMonth = (date: string): string => {
  return moment(date).format("MMM D");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMessageFromAxiosError = (error: any): string => {
  if(error instanceof AxiosError && error.response?.status === 400) {
    const message = error.response.data.errors[0].message;
    return message;
  }

  return "There was an error. Try it later.";
};
