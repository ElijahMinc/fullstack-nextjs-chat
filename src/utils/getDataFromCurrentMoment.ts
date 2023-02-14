import moment, { Moment } from 'moment';

export const getDataFromCurrentMoment = (date: Moment | Date) =>
  moment(date).fromNow();
