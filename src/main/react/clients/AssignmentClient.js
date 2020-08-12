import moment from "moment";
import { ExtractJSON, ResourceClient } from "../utils/ResourceClient";
import { PageableClient } from "../utils/PageableClient";
import { addError } from "../hooks/ErrorHook";

const path = "/api/assignments";

const internalize = it => ({
  ...it,
  from: it.from && moment(it.from, "YYYY-MM-DD"),
  to: it.to && moment(it.to, "YYYY-MM-DD")
});

const resourceClient = ResourceClient(path, internalize);
const pageableClient = PageableClient(path, internalize);

export const findByCode = code => {
  const opts = {
    method: "GET"
  };
  return fetch(`${path}/${code}`, opts)
    .then(ExtractJSON)
    .catch(e => addError(e.message));
};

function findAllByPersonCode(personCode) {
  return fetch(`${path}?personCode=${personCode}`)
    .then(ExtractJSON)
    .then(data => data.map(internalize))
    .catch(e => addError(e.message));
}

export const AssignmentClient = {
  ...resourceClient,
  ...pageableClient,
  findByCode,
  findAllByPersonCode
};
