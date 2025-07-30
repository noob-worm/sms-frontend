"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "name") {
      setNameError(value.length > 12 ? "Name must be less than or equal to 12 characters." : "");
    }

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailPattern.test(value) ? "Please enter a valid email address." : "");
    }

    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, "");
      setPhoneError(onlyNums.length !== 10 ? "Phone number must be exactly 10 digits." : "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      form.name.length > 12 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      form.phone.replace(/\D/g, "").length !== 10
    ) {
      setSuccess("");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess("Signup successful! Redirecting to login page...");
    router.push("/login");
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

        * {
          font-family: 'Roboto', sans-serif !important;
        }

        input::placeholder {
          color: rgba(67, 16, 92, 1) !important;
          opacity: 1;
        }

        label {
          color: rgba(13, 14, 14, 1) !important;
          font-weight: 500;
          letter-spacing: 1px;
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "url('https://images.pexels.com/photos/7232658/pexels-photo-7232658.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "rgba(7, 7, 7, 1)",
            letterSpacing: "2px",
          }}
        >
          Signup
        </h2>

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
          {/* Name */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={12}
                required
                style={inputStyle}
                placeholder="Enter your name"
              />
            </label>
            {nameError && <div style={errorStyle}>{nameError}</div>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Enter your email"
              />
            </label>
            {emailError && <div style={errorStyle}>{emailError}</div>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Enter your password"
              />
            </label>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Phone:
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                pattern="[0-9]{10}"
                required
                style={inputStyle}
                placeholder="Enter 10 digit phone number"
                inputMode="numeric"
              />
            </label>
            {phoneError && <div style={errorStyle}>{phoneError}</div>}
          </div>

          {/* Role */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Role:
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{ ...inputStyle, padding: "0.6rem" }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={!!nameError || !!emailError || !!phoneError}
          >
            Signup
          </button>

          {success && (
            <div style={{ color: "green", marginTop: "1rem", textAlign: "center" }}>
              {success}
            </div>
          )}
        </form>
        {/* Login Link */}
        <div style={{ marginTop: "1.5rem", textAlign: "center",color: "#04073fff", }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: "#010101ff", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>
            Login
          </a>
        </div>
      </main>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #1565c0",
  background: "rgba(255,255,255,0.92)",
  color: "#333",
  fontWeight: 500,
  marginTop: "0.25rem",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "none",
  background: "#041528ff",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  marginTop: "1rem",
  letterSpacing: "1px",
};

const errorStyle: React.CSSProperties = {
  color: "#d32f2f",
  fontSize: "0.95rem",
  marginTop: "0.25rem",
};
//https//img.freepik.com/free-vector/abstract-light-gray-geometric-polygonal-background_1035-18010.jpg?t=st%3D1737001821~exp%3D1737005421~hmac%3Dfb541b5d20cfe6d06d2f2bc800e7711604a5cba6502788f3fe72c0b162d09896