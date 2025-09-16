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

export function OrganizerSignUpView() {
  const router = useRouter();

  const { organizerRegister } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const businessName = formData.get('businessName') as string;
      const phone = formData.get('phone') as string;

      if (!name || !email || !password || !businessName) {
        setErrorMsg('Please fill in all required fields');
        return;
      }

      try {
        setLoading(true);
        setErrorMsg('');

        const data = {
          name,
          email,
          password,
          password_confirmation: password,
          business_name: businessName,
          phone: phone || undefined,
        };

        await organizerRegister(data);

        router.push('/organizer/dashboard');
      } catch (error) {
        console.error(error);
        setErrorMsg(typeof error === 'string' ? error : error?.message || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    },
    [organizerRegister, router]
  );

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h1" sx={{ typography: 'h3', mb: 1 }}>
        Organizer Sign Up
      </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Already have an account?{' '}
        <Link component={RouterLink} href={paths.auth.organizer.signIn} variant="subtitle2">
          Sign in
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
        name="name"
        label="Full name"
        placeholder="John Doe"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="email"
        label="Email address"
        placeholder="hello@company.com"
        type="email"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="businessName"
        label="Business name"
        placeholder="Your Event Company"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        name="phone"
        label="Phone number (optional)"
        placeholder="+1234567890"
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
        Create organizer account
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
