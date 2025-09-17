import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function CustomerSignUpView() {
  const router = useRouter();

  const { customerRegister } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const [loading, setLoading] = useState(false);

  type SignUpValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  const methods = useForm<SignUpValues>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SignUpValues) => {
    try {
      setLoading(true); // if you already have setLoading
      setErrorMsg(''); // if you already track error message
      // call your auth function (we’ll wire real API later)
      // await customerLogin(data.email, data.password);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h1" sx={{ typography: 'h3', mb: 1 }}>
        Customer Sign Up
      </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Already have an account?{' '}
        <Link component={RouterLink} href={paths.auth.customer.signIn} variant="subtitle2">
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

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Field.Text
          name="firstName"
          label="First name"
          placeholder="John"
          InputLabelProps={{ shrink: true }}
        />

        <Field.Text
          name="lastName"
          label="Last name"
          placeholder="Doe"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Field.Text
        name="email"
        label="Email address"
        placeholder="hello@gmail.com"
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
        Create account
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        {renderForm}
      </Form>
    </>
  );
}
