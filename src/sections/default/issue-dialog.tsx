import CustomDialog from '@/components/default/custom-dialog';
import TextField from '@/components/default/forms/TextField';
import { CustomForm } from '@/libs/forms';
import useCustomFormik from '@/libs/forms/use-custom-formik';
import { issueFields, issueYupSchema } from '@/schemas/issue';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Button, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

const IssueDialog = () => {
  //const data = useData('issues');
  const [dialogData, setDialogData] = useState<string | undefined>(undefined);
  const formik = useCustomFormik({
    initialValues: { title: '', description: '' },
    validationSchema: issueYupSchema,
    onSubmit: async (values, _formikHelpers) => {
      console.log(values);
      return;
    },
  });

  return (
    <>
      <Tooltip title="Report a problem">
        <IconButton
          onClick={() => setDialogData('true')}
          color="inherit"
        >
          <ReportProblemIcon />
        </IconButton>
      </Tooltip>
      {dialogData && (
        <CustomDialog
          data={dialogData}
          setData={setDialogData}
        >
          <DialogTitle>Submit an Issue</DialogTitle>
          <DialogContent>
            <CustomForm
              formik={formik}
              options={{
                muiTextFieldProps: { fullWidth: true },
              }}
            >
              <TextField
                name="title"
                field={issueFields.title}
              />
              <TextField
                name="description"
                field={issueFields.description}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
            </CustomForm>
          </DialogContent>
        </CustomDialog>
      )}
    </>
  );
};

export default IssueDialog;
