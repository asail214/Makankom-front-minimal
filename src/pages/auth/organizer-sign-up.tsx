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
  name: zod.string().min(1, 'Name is required'),
  email: zod.string().min(1, 'Email is required').email('Email must be a valid email address'),
  phone: zod.string().min(1, 'Phone number is required'),
  business_name: zod.string().min(1, 'Business name is required'),
  business_address: zod.string().min(1, 'Business address is required'),
  business_phone: zod.string().min(1, 'Business phone is required'),
  password: zod.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: zod.string().min(1, 'Please confirm your password'),
  terms: zod.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type FormValues = zod.infer<typeof schema>;

// ----------------------------------------------------------------------

export default function OrganizerSignUpPage() {
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
      await registerUser(registerData, 'organizer');
      navigate(paths.organizer.root);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormHead
        title="Become an Organizer"
        description="Start creating and managing amazing events in Oman"
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
              {...register('name')}
              label="Your Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              {...register('email')}
              label="Email address"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              {...register('phone')}
              label="Phone number"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
            />

            <TextField
              {...register('business_name')}
              label="Business/Organization Name"
              error={!!errors.business_name}
              helperText={errors.business_name?.message}
              fullWidth
            />

            <TextField
              {...register('business_address')}
              label="Business Address"
              error={!!errors.business_address}
              helperText={errors.business_address?.message}
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              {...register('business_phone')}
              label="Business Phone"
              error={!!errors.business_phone}
              helperText={errors.business_phone?.message}
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
              Create Organizer Account
            </LoadingButton>
          </Stack>
        </form>

        <FormDivider />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already have an organizer account?{' '}
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => navigate(paths.auth.organizer.signIn)}
              sx={{ textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Just want to attend events?{' '}
            <Link
              component="button"
              variant="subtitle2"
              onClick={() => navigate(paths.auth.customer.signUp)}
              sx={{ textDecoration: 'none' }}
            >
              Customer Sign Up
            </Link>
          </Typography>
        </Box>
      </Stack>
    </>
  );
}
