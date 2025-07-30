"use client";
import { useState, useEffect, useRef } from "react"; // Import useRef
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // Removed loggedInName state as it's no longer needed for display
  // const [loggedInName, setLoggedInName] = useState(null);

  // Create a ref for the email input field
  const emailInputRef = useRef(null);

  // This useEffect will run once on component mount
  useEffect(() => {
    // Reset login form state
    setLogin({ email: "", password: "" });
    setError(""); // Clear any previous errors on load
    setSuccessMsg(""); // Clear any previous success messages on load

    // Reset any forgotten password flow states
    setShowForgot(false);
    setOtpSent(false);
    setResetEmail("");
    setGeneratedOTP("");
    setEnteredOTP("");
    setNewPassword("");

    // --- Aggressive autofill workaround: Clear the email input directly via ref ---
    // A small timeout ensures this runs *after* the browser's autofill might have happened.
    if (emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current.value = ""; // Directly set the DOM element's value
        // Optional: Trigger a synthetic change event if you need to inform React immediately
        // const event = new Event('input', { bubbles: true });
        // emailInputRef.current.dispatchEvent(event);
      }, 100); // 100ms is usually sufficient, adjust if needed
    }
  }, []); // Empty dependency array means it runs once on mount

  // Removed useEffect for checking loggedInUser from localStorage
  // as the display of loggedInName is no longer required on this page.
  /*
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setLoggedInName(parsed.name || parsed.email || null);
      } catch (e) {
        console.error("Failed to parse loggedInUser from localStorage", e);
        setLoggedInName(null);
      }
    } else {
      setLoggedInName(null);
    }
  }, []);
  */

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(
      (user) =>
        user.email === login.email && user.password === login.password
    );

    if (foundUser) {
      setError("");
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      // setLoggedInName(foundUser.name || foundUser.email); // No longer setting this state
      router.push("/main");
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleSendOTP = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.find((user) => user.email === resetEmail);

    if (!userExists) {
      setError("Email not found in records.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setOtpSent(true);
    setError("");
    console.log(`🔐 Simulated OTP for ${resetEmail}:`, otp);
    alert(`OTP sent to ${resetEmail} (check console for demo)`);
  };

  const handleVerifyOTPAndReset = () => {
    if (enteredOTP !== generatedOTP) {
      setError("Invalid OTP.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user) => {
      if (user.email === resetEmail) {
        return { ...user, password: newPassword };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setSuccessMsg("✅ Password reset successfully!");
    setError("");
    setShowForgot(false);
    setOtpSent(false);
    setGeneratedOTP("");
    setEnteredOTP("");
    setNewPassword("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "url('https://images.pexels.com/photos/7232658/pexels-photo-7232658.jpeg')",
        padding: "1rem",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* --- Removed User icon with name at top right --- */}
      {/* {loggedInName && (
        <div style={{
          position: "absolute",
          top: 20,
          right: 30,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          borderRadius: 20,
          padding: "4px 12px",
          boxShadow: "0 2px 8px #0002",
          fontWeight: 600,
        }}>
          <span style={{
            display: "inline-block",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#063161ff",
            color: "#fff",
            textAlign: "center",
            lineHeight: "28px",
            fontWeight: 700,
            marginRight: 6,
            fontSize: 16,
          }}>
            {loggedInName[0]?.toUpperCase() || "U"}
          </span>
          {loggedInName}
        </div>
      )} */}

      <h2 style={{ color: "rgba(9, 9, 9, 1)", marginBottom: "3rem" }}>Login</h2>

      {!showForgot ? (
        <form
          onSubmit={handleLoginSubmit}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <input
            ref={emailInputRef} // Attach the ref here
            type="email"
            name="email"
            placeholder="Email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            required
            style={inputStyle}
            autoComplete="off" // Keep autocomplete="off" as a primary hint
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            required
            style={inputStyle}
            autoComplete="off" // Use "off" for password as well
          />

          {error && <div style={errorStyle}>{error}</div>}
          {successMsg && <div style={successStyle}>{successMsg}</div>}

          <button type="submit" style={buttonStyle}>
            Login
          </button>

          <p style={{ color: "black", marginTop: "1rem", }}>
            Forgot your password?{" "}
            <span
              onClick={() => setShowForgot(true)}
              style={{ color: "blue", cursor: "pointer", fontWeight: "bold",textDecoration: "underline", }}
            >
              Reset Here
            </span>
          </p>

          <p style={{ color: "black", marginTop: "0.5rem", }}>
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              style={{ color: "blue", cursor: "pointer", fontWeight: "bold",textDecoration: "underline", }}
            >
              Signup here
            </span>
          </p>
        </form>
      ) : (
        <div style={{ width: "100%", maxWidth: 400 }}>
          <h3 style={{ color: "red" }}>Reset Password</h3>

          {!otpSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                style={inputStyle}
                autoComplete="off" // Keep "off" for reset email
              />
              <button onClick={handleSendOTP} style={buttonStyle}>
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={enteredOTP}
                onChange={(e) => setEnteredOTP(e.target.value)}
                style={inputStyle}
                autoComplete="off"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                autoComplete="new-password" // For new password, "new-password" is appropriate
              />
              <button onClick={handleVerifyOTPAndReset} style={buttonStyle}>
                Reset Password
              </button>
            </>
          )}

          {error && <div style={errorStyle}>{error}</div>}

          <p style={{ color: "#fff", marginTop: "1rem" }}>
            Remembered your password?{" "}
            <span
              onClick={() => {
                setShowForgot(false);
                setError("");
                setSuccessMsg("");
              }}
              style={{ color: "#46df0fff", cursor: "pointer", fontWeight: "bold" }}
            >
              Go to Login
            </span>
          </p>
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  margin: "0.5rem 0",
   background: "#f6f3f0ff",
  borderRadius: "6px",
  border: "1px solid blue",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  background: "#063161ff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const errorStyle: React.CSSProperties = {
  color: "#f44336",
  marginTop: "0.5rem",
};

const successStyle: React.CSSProperties = {
  color: "#4caf50",
  marginTop: "0.5rem",
};