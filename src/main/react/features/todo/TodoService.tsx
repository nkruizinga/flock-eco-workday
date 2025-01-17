import { WorkDayClient } from "../../clients/WorkDayClient";
import { SickDayClient } from "../../clients/SickDayClient";
import { HolidayClient } from "../../clients/HolidayClient";
import { ExpenseClient } from "../../clients/ExpenseClient";
import { ISO_8601_DATE } from "../../clients/util/DateFormats";

const updateStatusWorkDay = async (id, status) => {
  const res = await WorkDayClient.get(id);
  await WorkDayClient.put(id, {
    ...res,
    assignmentCode: res.assignment.code,
    status,
    from: res.from.format(ISO_8601_DATE),
    to: res.to.format(ISO_8601_DATE),
  });
};

const updateStatusSickDay = async (id, status) => {
  const res = await SickDayClient.get(id);
  await SickDayClient.put(id, {
    ...res,
    status,
    from: res.from.format(ISO_8601_DATE),
    to: res.to.format(ISO_8601_DATE),
  });
};

const updateStatusHoliDay = async (id, status) => {
  const res = await HolidayClient.get(id);
  await HolidayClient.put(id, {
    ...res,
    status,
    from: res.from.format(ISO_8601_DATE),
    to: res.to.format(ISO_8601_DATE),
    days: res.type === "HOLIDAY" ? res.days : undefined,
  });
};

const updateStatusExpense = async (id, status) => {
  const res = await ExpenseClient.get(id);
  await ExpenseClient.put(id, res.type, {
    ...res,
    personId: res.person.uuid,
    status,
    date: res.date.format(ISO_8601_DATE),
  });
};

export const updateStatus = (status, item) => {
  if (item.type === "WORKDAY") return updateStatusWorkDay(item.id, status);
  if (item.type === "SICKDAY") return updateStatusSickDay(item.id, status);
  if (item.type === "HOLIDAY") return updateStatusHoliDay(item.id, status);
  if (item.type === "PLUSDAY") return updateStatusHoliDay(item.id, status);
  if (item.type === "EXPENSE") return updateStatusExpense(item.id, status);
  if (item.type === "EXPENSE") return updateStatusExpense(item.id, status);
  return null;
};
