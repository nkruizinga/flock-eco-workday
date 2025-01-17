import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import WorkIcon from "@material-ui/icons/Work";
import { ConfirmDialog } from "@flock-community/flock-eco-core/src/main/react/components/ConfirmDialog";
import Typography from "@material-ui/core/Typography";
import UserAuthorityUtil from "@flock-community/flock-eco-feature-user/src/main/react/user_utils/UserAuthorityUtil";
import { WorkDayClient } from "../../clients/WorkDayClient";
import { TransitionSlider } from "../../components/transitions/Slide";
import { DialogFooter, DialogHeader } from "../../components/dialog";
import { schema, WORKDAY_FORM_ID, WorkDayForm } from "./WorkDayForm";
import { isDefined } from "../../utils/validation";
import { ISO_8601_DATE } from "../../clients/util/DateFormats";

const useStyles = makeStyles(() => ({
  dialogContent: {
    margin: "auto",
    maxWidth: 768, // should be a decent medium-sized breakpoint
  },
}));

export function WorkDayDialog({ open, code, onComplete }) {
  const classes = useStyles();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const [state, setState] = useState<any>(null);

  useEffect(() => {
    if (open) {
      if (code) {
        WorkDayClient.get(code).then((res) => {
          setState({
            assignmentCode: res.assignment.code,
            from: res.from,
            to: res.to,
            days: res.days,
            hours: res.hours,
            status: res.status,
            sheets: res.sheets,
          });
        });
      } else {
        setState(schema.cast());
      }
    } else {
      setState(null);
    }
  }, [open, code]);

  const handleSubmit = (it) => {
    const body = {
      from: it.from.format(ISO_8601_DATE),
      to: it.to.format(ISO_8601_DATE),
      days: it.days ? it.days : null,
      hours: it.days
        ? it.days.reduce((acc, cur) => acc + parseFloat(cur || 0), 0)
        : it.hours,
      assignmentCode: it.assignmentCode,
      status: it.status,
      sheets: it.sheets,
    };
    if (code) {
      WorkDayClient.put(code, body).then((res) => {
        if (isDefined(onComplete)) onComplete(res);
        setState(null);
      });
    } else {
      WorkDayClient.post(body).then((res) => {
        if (isDefined(onComplete)) onComplete(res);
        setState(null);
      });
    }
  };

  const handleDelete = () => {
    WorkDayClient.delete(code).then(() => {
      if (isDefined(onComplete)) onComplete();
      setOpenDelete(false);
    });
  };
  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };
  const handleClose = () => {
    if (isDefined(onComplete)) onComplete();
    setState(null);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        // @ts-ignore
        TransitionComponent={TransitionSlider}
        // @ts-ignore
        TransitionProps={{ direction: "right" }}
      >
        <DialogHeader
          icon={<WorkIcon />}
          headline="Create Workday"
          subheadline="Add your workday."
          onClose={handleClose}
        />
        <DialogContent className={classes.dialogContent}>
          {state && <WorkDayForm value={state} onSubmit={handleSubmit} />}
        </DialogContent>
        <Divider />
        <DialogFooter
          formId={WORKDAY_FORM_ID}
          onClose={handleClose}
          onDelete={handleDeleteOpen}
          disableDelete={
            !UserAuthorityUtil.hasAuthority("WorkDayAuthority.ADMIN") &&
            state &&
            state.status !== "REQUESTED"
          }
          disableEdit={
            !UserAuthorityUtil.hasAuthority("WorkDayAuthority.ADMIN") &&
            state &&
            state.status !== "REQUESTED"
          }
        />
      </Dialog>
      <ConfirmDialog
        open={openDelete}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
      >
        <Typography>Are you sure you want to remove this workday.</Typography>
      </ConfirmDialog>
    </>
  );
}
