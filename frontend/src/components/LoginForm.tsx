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
  const [error, setError] = useState<string>("");

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
      setError("Invalid username or password.");
    }
  };

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
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
      setError("Error during registration. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-2xl mb-4 font-semibold">
        {isRegistering ? "Register" : "Login"}
      </h2>
      <input
        type="text"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 p-3 rounded-md border outline-none focus:border-blue-500"
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-3 rounded-md border outline-none focus:border-blue-500"
      />
      {isRegistering && (
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-md border outline-none focus:border-blue-500"
        />
      )}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={isRegistering ? handleRegister : handleLogin}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
      >
        {isRegistering ? "Register" : "Login"}
      </button>
      <p
        onClick={() => setIsRegistering(!isRegistering)}
        className="text-center mt-4 text-blue-500 cursor-pointer"
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default LoginForm;
