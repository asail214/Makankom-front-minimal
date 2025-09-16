import type { FormEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { useBoolean } from '../../../../src/hooks/use-boolean';

// ----------------------------------------------------------------------

export function OrganizerSignInView() {
  const router = useRouter();

  const { organizerLogin } = useAuthContext();

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

        await organizerLogin(email, password);

        router.push('/organizer/dashboard');
      } catch (error) {
        console.error(error);
        setErrorMsg(typeof error === 'string' ? error : error?.message || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    },
    [organizerLogin, router]
  );

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h1" sx={{ typography: 'h3', mb: 1 }}>
        Organizer Sign In
      </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Don't have an account?{' '}
        <Link component={RouterLink} href={paths.auth.organizer.signUp} variant="subtitle2">
          Get started
        </Link>
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
        name="email"
        label="Email address"
        placeholder="hello@company.com"
        type="email"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="password"
        label="Password"
        placeholder="6+ characters"
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
        Sign in
      </LoadingButton>
    </Box>
  );

  const renderSignUp = (
    <Box sx={{ mt: 3, textAlign: 'center', typography: 'body2' }}>
      Looking to attend events?{' '}
      <Link component={RouterLink} href={paths.auth.customer.signUp} variant="subtitle2">
        Customer Sign Up
      </Link>
    </Box>
  );

  return (
    <>
      {renderHead}

      <Form>{renderForm}</Form>

      {renderSignUp}
    </>
  );
}
