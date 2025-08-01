"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface Student {
  fullName: string;
  fatherName: string;
  motherName: string;
  age: string;
  class: string;
  bloodGroup: string;
  height: string;
  phone: string;
  address: string;
  course: string;
}

type Section = "user" | "master" | "student";

// 🎨 Styles
const sidebarStyle: React.CSSProperties = {
  backgroundColor: "rgb(24, 172, 212)",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  color: "#fff",
  minHeight: "100%",
};

const sidebarButton = (active: boolean): React.CSSProperties => ({
  padding: "0.75rem 1rem",
  backgroundColor: active ? "#1b5e20" : "transparent",
  color: "#fff",
  border: "none",
  textAlign: "left",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
});

const logoutButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem",
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "0.75rem",
  background: "#2e7d32",
  color: "#fff",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "0.75rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "5px",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const smallBtn: React.CSSProperties = {
  margin: "0 0.3rem",
  padding: "0.3rem 0.6rem",
  backgroundColor: "#0288d1",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  marginRight: "0.5rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const fieldContainer: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  marginTop: "1rem",
};

const fieldCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.5rem 1rem",
  backgroundColor: "#e3f2fd",
  border: "1px solid #90caf9",
  borderRadius: "8px",
  minWidth: "120px",
};

const removeBtn: React.CSSProperties = {
  backgroundColor: "#ef5350",
  color: "#fff",
  border: "none",
  padding: "0.3rem 0.6rem",
  borderRadius: "5px",
  marginLeft: "0.5rem",
  cursor: "pointer",
};

const addStudentButton: React.CSSProperties = {
  padding: "0.6rem 1.5rem",
  backgroundColor: "#00695c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

function MainPage() {
  const [showMasterDropdown, setShowMasterDropdown] = useState(false);
  const [showAddTab, setShowAddTab] = useState(false);
  const [masterFields, setMasterFields] = useState<string[]>(["Student", "Teacher", "Fees"]);
  const [newField, setNewField] = useState<string>("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  // Simulate fetching user name from localStorage or context
  useEffect(() => {
    // Get logged-in user from localStorage (set by login page)
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        const parsed = JSON.parse(loggedInUser);
        let displayName = parsed.name;
        if ((!displayName || displayName.trim() === "" || displayName.toLowerCase() === "user") && parsed.email) {
          displayName = parsed.email.split("@")[0];
        }
        setUserName(displayName || parsed.email || "User");
      } catch {
        setUserName("User");
      }
    } else {
      // fallback to previous logic if not found
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      setUserName(user?.name || "User");
    }
  }, []);

  // Add field handler
  const addMasterField = () => {
    if (newField.trim() && !masterFields.includes(newField.trim())) {
      setMasterFields([...masterFields, newField.trim()]);
      setNewField("");
    }
  };

  return (
    <div style={{
        minHeight: "100vh",
        color: "red",
        display: "flex",
        flexDirection: "column",
        background: `url('https://images.pexels.com/photos/7232658/pexels-photo-7232658.jpeg') center/cover no-repeat`,
    }}>
      <Header tabName="Main" userName={userName} />
      <div style={{ height: 64 }} /> {/* Spacer for fixed header */}
      {/* --- Main Page Content --- */}
      <div style={{ flex: 1, minHeight: 0, padding: "2rem" }}>
            <div style={{
              background: '#fff',
          color: '#222', 
              borderRadius: 10,
          padding: '2rem', 
          maxWidth: 800, 
          margin: '0 auto', 
          boxShadow: '0 2px 16px #0002',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#2e7d32', marginBottom: '1rem' }}>🏫 School Management System</h2>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '2rem' }}>
            Welcome to the School Management System. Use the Module tab in the header to navigate to different sections.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <div style={{ 
              padding: '1.5rem', 
              background: '#e8f5e9', 
              borderRadius: '8px', 
              border: '2px solid #4caf50'
            }}>
              <h3 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>📚 Student Management</h3>
              <p>Add, edit, and manage student records</p>
            </div>
      <div style={{
              padding: '1.5rem', 
              background: '#e3f2fd', 
              borderRadius: '8px', 
              border: '2px solid rgb(33, 47, 243)'
            }}>
              <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>📖 Library System</h3>
              <p>Manage books, loans, and library resources</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
