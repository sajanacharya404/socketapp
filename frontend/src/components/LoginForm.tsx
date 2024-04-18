import React, { useState } from "react";
import axios from "axios";

interface LoginFormProps {
  onLogin: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        }
      );
      const { accessToken } = response.data;
      onLogin(accessToken);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        {
          username,
          password,
        }
      );
      const { accessToken } = response.data;
      onLogin(accessToken);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div>
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <input
        type="text"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {isRegistering && (
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}
      <button onClick={isRegistering ? handleRegister : handleLogin}>
        {isRegistering ? "Register" : "Login"}
      </button>
      <p onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default LoginForm;
