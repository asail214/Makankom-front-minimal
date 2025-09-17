import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type SignInValues = {
  email: string;
  password: string;
};

export function OrganizerSignInView() {
  const router = useRouter();
  const auth = useAuthContext();

  const loading = useBoolean(false);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<SignInValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInValues) => {
    try {
      loading.onTrue();
      setErrorMsg('');
      // TODO: await organizerLogin(data.email, data.password);
      // router.push('/organizer/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Something went wrong!');
    } finally {
      loading.onFalse();
    }
  };

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h1" sx={{ typography: 'h3', mb: 1 }}>
        Organizer Sign In
      </Box>

      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Don&apos;t have an account?{' '}
        <Link
          component={RouterLinkFix as any}
          href={paths.auth.organizer.signUp}
          variant="subtitle2"
        >
          Become an Organizer
        </Link>
      </Box>
    </Box>
  );

  const renderForm = (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Field.Text
          name="email"
          label="Email address"
          type="email"
          placeholder="organizer@example.com"
          InputLabelProps={{ shrink: true }}
        />

        <Field.Text
          name="password"
          label="Password"
          type="password"
          InputLabelProps={{ shrink: true }}
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

function RouterLinkFix(props: any) {
  const { href, ...rest } = props;
  return <a href={href} {...rest} />;
}
