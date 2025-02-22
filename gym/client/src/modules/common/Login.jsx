import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
// import axios from 'axios';
import { message } from 'antd';
import NavBar from './NavBar';
import axiosInstance from './AxiosInstance';
import { Container, Form, Row, Col, InputGroup } from 'react-bootstrap';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.email || !data?.password) {
      return alert('Please fill all fields');
    } else {
      axiosInstance
        .post('/login', data)
        .then((res) => {
          //  console.log('res', res.data);
          if (res.data) {
            // console.log('response full type brrrr', res.data.type);
            message.success(res.data.message);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            const isLoggedIn = JSON.parse(localStorage.getItem('user'));
            // console.log(isLoggedIn, 'loggedIn');

            switch (isLoggedIn.type) {
              case 'Customer':
                console.log('Customer is here');
                navigate('/customerhome');
                break;
              case 'Trainer':
                console.log('Customer is here');
                navigate('/trainerhome');
                break;
              default:
                navigate('/login');
                break;
            }
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            alert("User doesn't exist");
          }
          navigate('/login');
        });
    }
  };

  return (
    <div>
      <NavBar />
      <div className='first-container'>
        <Container
          component='main'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              marginTop: 8,
              marginBottom: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#5a605fd4',
              borderRadius: '5px',
              padding: 2,
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sign In
            </Typography>
            {/* <Box
                     component="form"
                     onSubmit={handleSubmit}
                     noValidate
                     sx={{ padding: "25px" }}
                  >
                     <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        autoComplete="email"
                        autoFocus
                     />
                     <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                     />
                     <Box
                        mt={2}
                        className="d-flex flex-column align-items-center "
                     >
                        <Button
                           type="submit"
                           variant="contained"
                           style={{ width: '200px' }}
                        >
                           Sign Up
                        </Button>
                        <span>Don`t have an account?<Link style={{ color: "#090987" }} to={'/register'} variant="body2">
                           Sign Up
                        </Link></span>
                     </Box>
                  </Box> */}
            <Form style={{ padding: '25px' }} onSubmit={handleSubmit}>
              <Row className='mb-3'>
                <Form.Group as={Col} md='12'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name='email'
                    value={data.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>
              <Row className='mb-3'>
                <Form.Group as={Col} md='12'>
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      name='password'
                      value={data.password}
                      onChange={handleChange}
                      type='password'
                    />
                  </InputGroup>
                </Form.Group>
              </Row>
              <div className='d-flex flex-column align-items-center my-5'>
                <Button
                  variant='contained'
                  size='large'
                  type='submit'
                  // startIcon={<AddIcon />}
                >
                  Sign In
                </Button>
                <span>
                  Don`t have an account?
                  <Link
                    style={{ color: '#090987' }}
                    to={'/register'}
                    variant='body2'
                  >
                    Sign Up
                  </Link>
                </span>
              </div>
            </Form>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Login;
