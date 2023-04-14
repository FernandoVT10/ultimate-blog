import moment from "moment";

export const dateToTimeAgo = (date: string): string => {
  const stringDate = moment(date).fromNow();

  return stringDate.slice(0, 1).toUpperCase() + stringDate.slice(1);
};