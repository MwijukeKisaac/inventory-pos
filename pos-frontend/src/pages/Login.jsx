import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      onLogin(data.role);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded-xl w-80">
        <h2 className="font-bold mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full p-2 rounded"
          onClick={submit}
        >
          Login
        </button>
      </div>
    </div>
  );
}
