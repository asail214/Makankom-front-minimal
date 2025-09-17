import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type ScanPointSignInValues = {
  token: string;
};

export function ScanPointSignInView() {
  const auth = useAuthContext();

  const loading = useBoolean(false);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<ScanPointSignInValues>({
    defaultValues: { token: '' },
  });

  const onSubmit = async (data: ScanPointSignInValues) => {
    try {
      loading.onTrue();
      setErrorMsg('');
      // TODO: await scanPointLogin(data.token);
      // route to /scan/dashboard
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Invalid token or scan point not found');
    } finally {
      loading.onFalse();
    }
  };

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h1" sx={{ typography: 'h3', mb: 1 }}>
        Scan Point Login
      </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Enter the token assigned to this device.
      </Box>
    </Box>
  );

  const renderForm = (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Field.Text
          name="token"
          label="Token"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:eye-bold" width={20} />
              </Box>
            ),
          }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={loading.value}
          sx={{ mt: 1.5 }}
        >
          Sign in
        </LoadingButton>
      </Box>
    </Form>
  );

  return (
    <>
      {renderHead}
      {renderForm}
    </>
  );
}
