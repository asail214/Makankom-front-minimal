import type { FormEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function AdminSignInView() {
  const router = useRouter();

  const { adminLogin } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        setErrorMsg('Please fill in all fields');
        return;
      }

      try {
        setLoading(true);
        setErrorMsg('');

        await adminLogin(email, password);

        router.push('/admin/dashboard');
      } catch (error) {
        console.error(error);
        setErrorMsg(typeof error === 'string' ? error : error?.message || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    },
    [adminLogin, router]
  );

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h1" sx={{ typography: 'h3', mb: 1 }}>
        Admin Portal
      </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>Administrative access only</Box>
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
        name="email"
        label="Admin email"
        placeholder="admin@makankom.com"
        type="email"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="password"
        label="Password"
        placeholder="Enter your password"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
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
        Sign in to admin panel
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {renderHead}

      <Form>{renderForm}</Form>
    </>
  );
}
