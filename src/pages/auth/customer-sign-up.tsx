import { useState } from 'react';
import { useNavigate } from 'src/routes/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { Alert, Stack, TextField, IconButton, InputAdornment, Link, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Iconify } from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { FormHead } from 'src/auth/components/form-head';
import { FormDivider } from 'src/auth/components/form-divider';
import { SignUpTerms } from 'src/auth/components/sign-up-terms';

// ----------------------------------------------------------------------

const schema = zod.object({
  first_name: zod.string().min(1, 'First name is required'),
  last_name: zod.string().min(1, 'Last name is required'),
  email: zod.string().min(1, 'Email is required').email('Email must be a valid email address'),
  password: zod.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: zod.string().min(1, 'Please confirm your password'),
  terms: zod.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type FormValues = zod.infer<typeof schema>;

// ----------------------------------------------------------------------

export default function CustomerSignUpPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      const { password_confirmation, terms, ...registerData } = data;
      await registerUser(registerData, 'customer');
      navigate(paths.customer.root);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormHead
        title="Create your account"
        description="Join thousands of event-goers in Oman"
      />

      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                {...register('first_name')}
                label="First name"
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                fullWidth
              />
              
              <TextField
                {...register('last_name')}
                label="Last name"
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                fullWidth
              />
            </Stack>

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

            <TextField
              {...register('password_confirmation')}
              label="Confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      <Iconify icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  {...register('terms')}
                />
              }
              label={<SignUpTerms />}
              sx={{ alignItems: 'flex-start' }}
            />

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
            >
              Create Account
            </LoadingButton>
          </Stack>
        </form>

        <FormDivider />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already have an account?{' '}
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => navigate(paths.auth.customer.signIn)}
              sx={{ textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Want to organize events?{' '}
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => navigate(paths.auth.organizer.signUp)}
              sx={{ textDecoration: 'none' }}
            >
              Become an Organizer
            </Link>
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
