import { setUser } from "../store/slices/authSlice";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Input } from "../styles/app.style";
import { useMutation } from "@tanstack/react-query";
import userService from "../services/user.service";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const userMutation = useMutation({
    mutationFn: (formData: { email: string; password: string }) =>
      userService.loginUser(formData),
    onError: (error: any) => {
      const errorMessage = error?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error logging in");
      console.log(error);
    },
    onSuccess: (data) => {
      console.log("Login successful", data);
      // setting token in local storage
      localStorage.setItem("token", JSON.stringify(data.token));
      // setting in redux store
      const { name, email, userId, username } = data.data;
      dispatch(
        setUser({
          user: { name, email, userId, username },
          isAuthenticated: true,
        }),
      );
      toast.success("Login Successfully");
      navigate("/");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await userMutation.mutateAsync(formData);
  };

  return (
    <Wrapper>
      {/* <div className="grid h-screen w-screen place-items-center"> */}
      <form
        onSubmit={handleSubmit}
        className="form rounded-md bg-slate-200 px-10 py-3"
      >
        <h1 className="text-center text-2xl font-bold">Sign In</h1>
        <div>
          <div>
            <label htmlFor="email">Email</label>
            <Input
              required
              name="email"
              id="email"
              type="email"
              placeholder="type your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input
              required
              name="password"
              id="password"
              placeholder="type your password"
              value={formData.password}
              type="password"
              onChange={handleChange}
            />
          </div>
          <Button variant="primary" type="submit">
            {" "}
            Sign In
          </Button>
          <p>
            Don't have an account ?{" "}
            <Link className="text-sm italic text-blue-600" to="/sign-up">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
      {/* </div> */}
    </Wrapper>
  );
};

export default Login;

// iimplemented styled components for the login page
const Wrapper = styled.div<{ children: React.ReactNode }>`
  background: linear-gradient(to bottom right, #4419b1, #110e3b);
  height: 100vh;
  display: grid;
  place-items: center;
  width: 100vw;

  .form {
    background-opacity: 0.1;
    backdrop-filter: blur(10px);
  }
`;
