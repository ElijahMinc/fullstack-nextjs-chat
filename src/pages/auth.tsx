import { useRouter } from 'next/router';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Nature from '@/public/nature.jpg';
import { useFormik } from 'formik';
import AuthService from '@/services/AuthService';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { User } from '@/types/user';
import { styled } from '@mui/material';
import { useRef, useState, ChangeEvent } from 'react';
import { Nullable } from '@/types/Nullable';
import { socket } from '@/config/socket';

enum AuthType {
  LOGIN = 'login',
  REGISTER = 'register',
}

interface AvatarImageProps {
  isShowAddAvatar?: boolean;
}

export const AvatarImage = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'isShowAddAvatar',
})<AvatarImageProps>(({ theme, isShowAddAvatar }) => ({
  position: 'relative',
  cursor: 'pointer',
  borderRadius: '50%',
  zIndex: 2,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.primary.light
      : theme.palette.primary.dark,
}));

interface AuthProps {
  setIsAuth: () => void;
  setUser: (user: User) => void;
}

const Auth = ({ setIsAuth, setUser }: AuthProps) => {
  const [previewImg, setPreview] = useState<string>('');
  const imageRef = useRef<Nullable<HTMLInputElement>>(null);
  const router = useRouter();
  const isRegisterTypePage = router.query?.type === AuthType.REGISTER;

  const { handleChange, handleSubmit, setFieldValue, values } = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      image: '',
    },
    onSubmit: async ({ name, surname, email, password, image }) => {
      let response;
      const data = { name, surname, email, password, image };

      if (isRegisterTypePage) {
        response = await AuthService.registration(data);
      } else {
        response = await AuthService.login(data);
      }

      if (!response) return;

      const user = response.user;

      setUser(user);
      setIsAuth();
      socket.connect()
      router.push({
        pathname: '/',
      });
    },
  });

  const toggleType = () => {
    router.push({
      pathname: '/auth',
      query: { type: isRegisterTypePage ? 'login' : 'register' },
    });
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (imageRef.current && !!imageRef.current.value) {
      setPreview('');
      setFieldValue('image', '');
    }

    const target = e.target;
    if (!target?.files?.length) return;

    const files = Array.from(target.files);

    files.forEach((file) => {
      const link = URL.createObjectURL(file);
      setPreview(link);
    });

    setFieldValue('image', files[0]);
  };

  return (
    <Box
      maxWidth="900px"
      margin="0 auto"
      height="90vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Grid container component="div" height="100%" maxHeight="600px">
        <Grid
          item
          xs={false}
          sm={6}
          md={7}
          component={Paper}
          sx={{
            position: 'relative',
            borderTopLeftRadius: '25px',
            borderBottomLeftRadius: '25px',
            overflow: 'hidden',
          }}
          elevation={6}
        >
          <img
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            src={Nature.src}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          component={Paper}
          sx={{
            borderTopRightRadius: '25px',
            borderBottomRightRadius: '25px',
          }}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <AvatarImage
              src={previewImg}
              onClick={() => {
                if (!imageRef.current) return;
                if (!isRegisterTypePage) return;

                imageRef.current.click();
              }}
              isShowAddAvatar={isRegisterTypePage}
              // sx={{ m: 1, bgcolor: 'primary.main' }}
            >
              {isRegisterTypePage ? (
                <div>
                  <PersonAddAltIcon
                    sx={{
                      cursor: 'pointer',
                    }}
                  />
                </div>
              ) : (
                <LockOutlinedIcon />
              )}
            </AvatarImage>
            <input
              type="file"
              onChange={handleChangeFile}
              accept=".jpg,.png,.jpeg"
              ref={imageRef}
              style={{ display: 'none' }}
            />
            <Typography component="h1" variant="h5">
              Sign {isRegisterTypePage ? 'up' : 'in'}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                onChange={handleChange}
                label="Your Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                onChange={handleChange}
                name="surname"
                label="Your Surname"
                type="surname"
                id="surname"
                autoComplete="csurname"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                onChange={handleChange}
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                onChange={handleChange}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign {isRegisterTypePage ? 'up' : 'in'}
              </Button>

              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2" onClick={toggleType}>
                    {isRegisterTypePage
                      ? "Don't have an account? Sign Up"
                      : 'Do you have an account? Sign In'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Auth;
