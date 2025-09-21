import { useState } from 'react';
import { useNavigate, useSearchParams } from 'src/routes/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { Alert, Stack, TextField, IconButton, InputAdornment, Link, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Iconify } from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { FormHead } from 'src/auth/components/form-head';
import { FormDivider } from 'src/auth/components/form-divider';
import { FormSocials } from 'src/auth/components/form-socials';

// ----------------------------------------------------------------------

const schema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Email must be a valid email address'),
  password: zod.string().min(1, 'Password is required'),
});

type FormValues = zod.infer<typeof schema>;

// ----------------------------------------------------------------------

export default function OrganizerSignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const returnTo = searchParams[0]?.get('returnTo') || paths.organizer.root;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      await login(data.email, data.password, 'organizer');
      navigate(returnTo);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormHead
        title="Organizer Login"
        description="Access your event management dashboard"
      />

      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              {...register('email')}
              label="Email address"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              {...register('password')}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
            >
              Sign In
            </LoadingButton>
          </Stack>
        </form>

        <FormDivider />

        <FormSocials />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Don't have an organizer account?{' '}
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => navigate(paths.auth.organizer.signUp)}
              sx={{ textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Are you a customer?{' '}
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => navigate(paths.auth.customer.signIn)}
              sx={{ textDecoration: 'none' }}
            >
              Customer Login
            </Link>
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
