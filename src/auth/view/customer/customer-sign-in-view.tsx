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

export default function CustomerSignInView() {
  const router = useRouter();
  const { customerLogin } = useAuthContext(); // we’ll wire this later in AuthContext

  const loading = useBoolean(false);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<SignInValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInValues) => {
    try {
      loading.onTrue();
      setErrorMsg('');
      // TODO: implement customerLogin in AuthContext (next step)
      // await customerLogin(data.email, data.password);
      // router.push('/customer/dashboard');
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
        Customer Sign In
      </Box>

      <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
        Don&apos;t have an account?{' '}
        <Link
          component={RouterLinkFix as any}
          href={paths.auth.customer.signUp}
          variant="subtitle2"
        >
          Get started
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
          placeholder="hello@gmail.com"
          type="email"
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

// Minimal RouterLink shim: the kit often re-exports a RouterLink component.
// If your project already has `import { RouterLink } from 'src/routes/components';` use that instead.
function RouterLinkFix(props: any) {
  const { href, ...rest } = props;
  return <a href={href} {...rest} />;
}
