import styled from "styled-components";

// This file contains styled components for the application
export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;

  border-radius: 0.25rem;
  margin-bottom: 1rem;
  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
  &::placeholder {
    color: #aaa;
  }
  &:focus::placeholder {
    color: transparent;
  }
  transition: border-color 0.3s ease;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    border-color: #4a90e2;
  }
  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
  &:disabled::placeholder {
    color: #ccc;
  }
  &:disabled:hover {
    border-color: #ccc;
  }
  &:disabled:focus {
    box-shadow: none;
  }
`;

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "outline";
  type?: "submit" | "button";
}>`
  padding: ${(props) => (props.type !== "submit" ? "" : "0.5rem 1.5rem")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.25rem;
  background-color: ${(props) =>
    props.variant === "secondary"
      ? "#28a745"
      : props.variant === "primary"
        ? "#007bff"
        : props.variant === "outline"
          ? "transparent"
          : "gray"};
  color: ${(props) =>
    props.variant === "secondary" || props.variant === "primary"
      ? "#fff"
      : props.variant === "outline"
        ? "#007bff"
        : "#000"};

  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  font-size: 1rem;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? null
        : props.variant === "secondary"
          ? "#12661f"
          : props.variant === "primary"
            ? "#0056b3"
            : props.variant === "outline"
              ? "#e0e0e0"
              : "#403f3f"};
  }
}`;
