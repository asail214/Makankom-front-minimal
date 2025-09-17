import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/lib/axios';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type AuthSignInValues = {
  email: string;
  password: string;
};

export function AdminSignInView() {
  const loading = useBoolean(false);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<AuthSignInValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: AuthSignInValues) => {
    try {
      loading.onTrue();
      setErrorMsg('');
      // A simple direct call (you can replace with AuthContext later)
      await axios.post(endpoints.auth.signIn, { email: data.email, password: data.password });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Invalid credentials');
    } finally {
      loading.onFalse();
    }
  };

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Field.Text
          name="email"
          label="Email address"
          type="email"
          placeholder="admin@example.com"
          InputLabelProps={{ shrink: true }}
        />

        <Field.Text
          name="password"
          label="Password"
          type="password"
          InputLabelProps={{ shrink: true }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={loading.value}>
          Sign in
        </LoadingButton>
      </Box>
    </Form>
  );
}
