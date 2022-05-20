import { useState } from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@mui/material";

import { signupContainerMui, signupFormMui } from "./signupMUIstyles";
import { createAccount } from "../../apis";
import { validateSignupForm } from "../../utils/formValidation";

const Signup = () => {
  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e, name) => {
    setErrors({});
    setValues({ ...values, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // add validate function
    validateSignupForm(values, errors, setErrors);

    // if no errors in validation
    // create user account.
    if (!errors) {
      createAccount(values.email, values.password, values.username);
    } else return;
  };

  return (
    <>
      <Container sx={signupContainerMui}>
        {console.log(errors)}
        <h2>Sign Up</h2>
        <Box component="form" sx={signupFormMui}>
          <TextField
            required
            error={errors && errors.username ? true : false}
            helperText={errors.username}
            label="User Name"
            variant="filled"
            margin="normal"
            value={values.username}
            onChange={(e) => handleChange(e, "username")}
          />
          <TextField
            required
            error={errors && errors.email ? true : false}
            helperText={errors.email}
            label="Email"
            variant="filled"
            margin="normal"
            values={values.email}
            onChange={(e) => {
              handleChange(e, "email");
            }}
          />
          <TextField
            required
            error={errors && errors.password ? true : false}
            helperText={errors.password}
            label="Password"
            variant="filled"
            margin="normal"
            values={values.password}
            onChange={(e) => {
              handleChange(e, "password");
            }}
          />
          <TextField
            required
            error={errors && errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword}
            label="Confirm Password"
            variant="filled"
            margin="normal"
            values={values.confirmPassword}
            onChange={(e) => {
              handleChange(e, "confirmPassword");
            }}
          />
        </Box>
        {!loading ? (
          <Button variant="contained" size="large" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <LoadingButton loading>Submit</LoadingButton>
        )}
        <p>Already have an account? Log In</p>
      </Container>
    </>
  );
};

export default Signup;
