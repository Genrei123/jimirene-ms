import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import assetsLogin from '../assets/assetsLogin.png';
import logo from '../assets/logo.svg';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, TextField, Typography, Stack } from '@mui/material';
import './LoginForm.css';
import ForgotPassword from './ForgotPassword';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [openForgotPassword, setOpenForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    let isValid = true;
  
    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else {
      setEmailError('');
    }
  
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError('');
    }
  
    if (isValid) {
      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const { username, token, role } = data; // Backend should return 'role' and 'token' properties.
  
          console.log("Login successful:", data);  // Log the response to check if role and token are correct
  
          login(token, role);
          localStorage.setItem("token", token);
          localStorage.setItem("userRole", role);
          localStorage.setItem("username", username);

  
          // Now send the token with the Authorization header in a subsequent request
          const tokenFromLocalStorage = localStorage.getItem('token');
          
          const patientResponse = await fetch('http://localhost:8080/getPatient', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenFromLocalStorage}`,  // Add the token in the header
            },
          });

          if (patientResponse.ok) {
            // Handle successful response for /getPatient request
            const patientData = await patientResponse.json();
            console.log('Patient data:', patientData);
          } else {
            console.log('Failed to fetch patient data');
          }
  
          // Redirect after saving to local storage
          console.log("Role: ", role);
          console.log("Token: ", token);

          if (role === 'owner') {
            navigate('/home');
          } else {
            navigate('/home');
          }
        } else {
          const errorData = await response.json();
          setPasswordError(errorData.message || "Login failed");
        }
      } catch (error) {
        console.log(error);
        setPasswordError("An error occurred. Please try again.");
      }
    }
};

  
  

  return (
    <section className="login-page">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="left-section lg:col-span-7 xl:col-span-8">
          <div className="flex items-center justify-center h-full">
            <img src={assetsLogin} alt="Login Illustration" className="login-image" />
          </div>
        </section>

        <section className="right-section lg:col-span-5 xl:col-span-4 flex items-center justify-center">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: 4,
              width: '100%',
              gap: 2,
              maxWidth: 450,
              margin: 'auto',
              justifyContent: 'flex-start',
              height: '100vh'
            }}
          >
            <img src={logo} alt="Logo" className="login-logo" />
            <Typography variant="h4" className="login-title" sx={{ textAlign: 'center' }}>
              Login To Your Account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <FormLabel>Email</FormLabel>
                <TextField
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  error={!!emailError}
                  helperText={emailError}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <FormLabel>Password</FormLabel>
                <TextField
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  error={!!passwordError}
                  helperText={passwordError}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />
              </Stack>

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign in
              </Button>
            </Box>
          </Box>
        </section>
      </div>

      <ForgotPassword open={openForgotPassword} handleClose={() => setOpenForgotPassword(false)} />
    </section>
  );
};

export default LoginForm;

