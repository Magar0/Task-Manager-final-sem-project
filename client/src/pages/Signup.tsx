import { setUser } from "../store/slices/authSlice";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Input } from "../styles/app.style";

interface FormData {
  name: string;
  email: string;
  password: string;
  username: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    username: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: FormEvent) => {
    const url = process.env.REACT_APP_SERVER_URL!;
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/auth/signup`, formData);
      // setting token in local storage
      localStorage.setItem("token", JSON.stringify(res.data?.token));
      // setting in redux store
      const { name, email, userId, username } = res.data.data;
      dispatch(
        setUser({
          user: { name, email, userId, username },
          isAuthenticated: true,
        }),
      );
      toast.success("Created account Successfully");
      navigate("/");
    } catch (err: any) {
      const errorMessage = err?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error Signing up");
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <form
        onSubmit={handleSubmit}
        className="rounded-md bg-slate-200 px-10 py-3"
      >
        <h1 className="text-center text-2xl font-bold">Sign Up</h1>
        <div>
          <div>
            <label htmlFor="name">Name</label>
            <Input
              name="name"
              id="name"
              type="text"
              placeholder="type your name"
              value={formData.name}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <Input
              name="username"
              id="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              required
              onChange={handleChange}
            />
          </div>
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
              name="password"
              required
              id="password"
              placeholder="type your password"
              value={formData.password}
              type="password"
              onChange={handleChange}
            />
          </div>
          <Button variant={"secondary"} type="submit">
            {" "}
            Sign Up
          </Button>
          <p>
            Already have an account ?{" "}
            <Link className="text-sm italic text-blue-600" to="/sign-in">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </Wrapper>
  );
};

export default Signup;

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
