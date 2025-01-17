import {
  AggregationClientPersonAssignmentOverview,
  AggregationClientPersonOverview,
} from "../graphql/aggregation";
import {
  checkResponse,
  validateResponse,
} from "@flock-community/flock-eco-core";
import { Dayjs } from "dayjs";
import { ISO_8601_DATE } from "./util/DateFormats";

const path = "/api/aggregations";

export type ClientGrossRevenue = {
  name: string;
  revenueGross: number;
};

export const totalPerClientByYear = (
  year: number
): Promise<ClientGrossRevenue[]> => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/total-per-client?year=${year}`, opts)
    .then((res) => validateResponse<ClientGrossRevenue[]>(res))
    .then((res) => checkResponse(res))
    .then((res) => res.body);
};
export const totalPerPersonByYear = (year) => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/total-per-person?year=${year}`, opts)
    .then(validateResponse)
    .then(checkResponse)
    .then((res) => res.body);
};
export const totalPerPersonByYearMonth = (year, month) => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/total-per-person?year=${year}&month=${month}`, opts)
    .then(validateResponse)
    .then(checkResponse)
    .then((res) => res.body);
};
export const clientHourOverviewByYearMonth: (
  year: number,
  month: number
) => Promise<void | AggregationClientPersonOverview[]> = (year, month) => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/client-hour-overview?year=${year}&month=${month}`, opts)
    .then((res) => validateResponse<AggregationClientPersonOverview[]>(res))
    .then(checkResponse)
    .then((res) => res.body);
};
export const totalPerPersonMe = () => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/total-per-person-me`, opts)
    .then(validateResponse)
    .then(checkResponse)
    .then((res) => res.body);
};
export const holidayReportMe = (year) => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/holiday-report-me?year=${year}`, opts)
    .then(validateResponse)
    .then(checkResponse)
    .then((res) => res.body);
};

export const totalPerMonthByYear = (year) => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/total-per-month?year=${year}`, opts)
    .then(validateResponse)
    .then(checkResponse)
    .then((res) => res.body);
};

export const holidayReportByYear = (year) => {
  const opts = {
    method: "GET",
  };
  return fetch(`${path}/holiday-report?year=${year}`, opts)
    .then(validateResponse)
    .then(checkResponse)
    .then((res) => res.body);
};

const clientAssignmentPersonBetween = (
  from: Dayjs,
  to: Dayjs
): Promise<AggregationClientPersonAssignmentOverview[]> => {
  const opts = {
    method: "GET",
  };
  return fetch(
    `${path}/client-assignment-hour-overview?from=${from.format(
      ISO_8601_DATE
    )}&to=${to.format(ISO_8601_DATE)}`,
    opts
  )
    .then((res) =>
      validateResponse<AggregationClientPersonAssignmentOverview[]>(res)
    )
    .then(checkResponse)
    .then((res) => res.body);
};

export const AggregationClient = {
  totalPerClientByYear,
  totalPerPersonByYear,
  totalPerPersonByYearMonth,
  clientHourOverviewByYearMonth,
  clientAssignmentPersonBetween,
  totalPerMonthByYear,
  totalPerPersonMe,
  holidayReportMe,
  holidayReportByYear,
};
