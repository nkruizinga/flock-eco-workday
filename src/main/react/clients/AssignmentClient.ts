import { Client } from "./ClientClient";
import { Person } from "./PersonClient";
import { Project } from "./ProjectClient";
import InternalizingClient from "../utils/InternalizingClient";
import dayjs, { Dayjs } from "dayjs";

// The type we use in the frontend
export type Assignment = {
  id: number;
  code: string;

  role?: string;
  from: Dayjs;
  to: Dayjs | null;
  hourlyRate: number;
  hoursPerWeek: number;

  totalHours?: number;
  totalCosts?: number;

  client: Client;
  person: Person;
  project?: Project;
};

// The type we receive from the backend
type AssignmentRaw = {
  id: number;
  code: string;

  role?: string;
  from: string;
  to?: string;
  hourlyRate: number;
  hoursPerWeek: number;

  totalHours?: number;
  totalCosts?: number;

  client: Client;
  person: Person;
  project?: Project;
};

// The type we send to the backend
export type AssignmentRequest = {
  role?: string;
  from: string;
  to?: string;
  hourlyRate: number;
  hoursPerWeek: number;

  clientCode: string;
  personId: string;
  projectCode?: string;
};

const path = "/api/assignments";

const internalize = (it: AssignmentRaw): Assignment => ({
  ...it,
  from: dayjs(it.from, "YYYY-MM-DD"),
  to: it.to ? dayjs(it.to, "YYYY-MM-DD") : null,
});

const internalizingClient = InternalizingClient<
  AssignmentRequest,
  AssignmentRaw,
  Assignment
>(path, internalize);

export const ASSIGNMENT_PAGE_SIZE = 5;

const findAllByPersonId = (personId: string, page: number | "all") => {
  if (page === "all") {
    return findAllByPersonIdUnpaged(personId);
  }

  return internalizingClient.queryByPage(
    {
      page,
      size: ASSIGNMENT_PAGE_SIZE,
      sort: "from,desc",
    },
    {
      personId: personId,
    }
  );
};

const findAllByPersonIdUnpaged = (personId: string) =>
  internalizingClient.query({
    personId,
  });

const findAllByProject = (project: Project) =>
  internalizingClient.query({ projectCode: project.code });

export const AssignmentClient = {
  ...internalizingClient,
  findAllByPersonId,
  findAllByProject,
};
