import moment from "moment"
import {ResourceClient, responseValidation} from "../utils/ResourceClient"

const internalize = it => ({
  ...it,
  from: moment(it.from),
  to: moment(it.to),
})

const path = "/api/workdays"
const resourceClient = ResourceClient(path, internalize)

const findAllByPersonCode = personCode => {
  return fetch(`${path}?personCode=${personCode}`)
    .then(responseValidation)
    .then(it => it.map(internalize))
}

export const WorkDayClient = {
  ...resourceClient,
  findAllByPersonCode,
}