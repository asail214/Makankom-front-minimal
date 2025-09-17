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

type SignUpValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function CustomerSignUpView() {
  const router = useRouter();
  const auth = useAuthContext(); // TODO: use auth.customerRegister later

  const loading = useBoolean(false);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<SignUpValues>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SignUpValues) => {
    try {
      loading.onTrue();
      setErrorMsg('');
      // TODO: await customerRegister(data);
      // router.push(paths.auth.customer.signIn);
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
        Create your customer account
      </Box>

      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Already have an account?{' '}
        <Link
          component={RouterLinkFix as any}
          href={paths.auth.customer.signIn}
          variant="subtitle2"
        >
          Sign in
        </Link>
      </Box>
    </Box>
  );

  const renderForm = (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Field.Text name="name" label="Full name" InputLabelProps={{ shrink: true }} />

        <Field.Text
          name="email"
          label="Email address"
          type="email"
          placeholder="hello@gmail.com"
          InputLabelProps={{ shrink: true }}
        />

        <Field.Text
          name="password"
          label="Password"
          type="password"
          InputLabelProps={{ shrink: true }}
        />

        <Field.Text
          name="confirmPassword"
          label="Confirm password"
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
          Create account
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
