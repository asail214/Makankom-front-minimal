import type { FormEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function ScanPointSignInView() {
  const router = useRouter();

  const { scanPointLogin } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const token = formData.get('token') as string;

      if (!token) {
        setErrorMsg('Please enter your scan point token');
        return;
      }

      try {
        setLoading(true);
        setErrorMsg('');

        await scanPointLogin(token);

        router.push('/scan/dashboard');
      } catch (error) {
        console.error(error);
        setErrorMsg(
          typeof error === 'string'
            ? error
            : error?.message || 'Invalid token or scan point not found'
        );
      } finally {
        setLoading(false);
      }
    },
    [scanPointLogin, router]
  );

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h1" sx={{ typography: 'h3', mb: 1 }}>
        Scan Point Access
      </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Enter your scan point token to access the scanning interface
      </Box>
    </Box>
  );

  const renderForm = (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}
    >
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Field.Text
        name="token"
        label="Scan Point Token"
        placeholder="Enter your scan point access token"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:key-bold" width={20} />
            </Box>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={loading}
      >
        Access scan point
      </LoadingButton>
    </Box>
  );

  const renderNote = (
    <Box sx={{ mt: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1, textAlign: 'center' }}>
      <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
        <Iconify icon="solar:info-circle-bold" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
        Contact your event organizer to get your scan point token
      </Box>
    </Box>
  );

  return (
    <>
      {renderHead}

      <Form>{renderForm}</Form>

      {renderNote}
    </>
  );
}
