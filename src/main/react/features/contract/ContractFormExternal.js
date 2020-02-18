import React from "react"
import PropTypes from "prop-types"
import {Grid} from "@material-ui/core"
import {Field, Form, Formik} from "formik"
import {MuiPickersUtilsProvider} from "@material-ui/pickers"
import MomentUtils from "@date-io/moment"
import {TextField} from "formik-material-ui"
import {mixed, number, object} from "yup"
import moment from "moment"
import {DatePickerField} from "../../components/fields/DatePickerField"

// form id as a reference point for buttons outside of the <form></form> scope to be
// able to submit this form
export const EXTERNAL_CONTRACT_FORM_ID = "external-contract-form"

/** PersonForm
 *
 * @param {*} props
 */
export const ContractFormExternal = props => {
  const {value, onSubmit} = props

  const form = () => (
    <Form id={EXTERNAL_CONTRACT_FORM_ID}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Field
              name="hourlyRate"
              type="number"
              label="Hourly rate"
              fullWidth
              component={TextField}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="hoursPerWeek"
              type="number"
              label="Hours per week"
              fullWidth
              component={TextField}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePickerField name="startDate" label="Start date" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <DatePickerField name="endDate" label="End date" fullWidth clearable />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </Form>
  )

  const init = value && {
    hourlyRate: value.hourlyRate,
    hoursPerWeek: value.hoursPerWeek,
    startDate: value.startDate,
    endDate: value.endDate,
  }

  const schema = object({
    hourlyRate: number()
      .required()
      .default(80),
    hoursPerWeek: number()
      .required()
      .default(40),
    startDate: mixed()
      .required()
      .default(moment()),
    endDate: mixed().default(null),
  })

  return (
    <Formik
      initialValues={{...schema.cast(), ...init}}
      onSubmit={onSubmit}
      validationSchema={schema}
      enableReinitialize
      render={form}
    />
  )
}

ContractFormExternal.propTypes = {
  value: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
}

ContractFormExternal.defaultProps = {
  item: {
    client: null,
    user: null,
  },
}
