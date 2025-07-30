"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});


// --- Main Add Student Form Component ---
export default function AddStudentPage() {
  const router = useRouter();
  // Tab state
  const [activeTab, setActiveTab] = useState<'general' | 'address' | 'account' | 'id'>('general');
  // Hover state for tabs
  const [hoverTab, setHoverTab] = useState<string | null>(null);
  // --- Form State ---
  const [form, setForm] = useState({
    // General
    firstName: "",
    middleName: "",
    lastName: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherName: "",
    dob: "",
    age: "",
    mobile: "",
    email: "",
    religion: "",
    // Updated Address Fields
    presentHouseNo: "",
    presentStreetName: "", // New field for street name
    presentCity: "",
    presentState: "",
    presentCountry: "",
    presentPincode: "",
    presentNearbyPlace: "", // New field for nearby place
    permanentHouseNo: "",
    permanentStreetName: "", // New field for street name
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentPincode: "",
    permanentNearbyPlace: "", // New field for nearby place
    isSameAddress: false,
    sex: "",
    // Account Details
    bankType: "",
    upi: "",
    accountNumber: "",
    bankName: "",
    ifsc: "",
    swift: "",
    // ID Verification
    aadhar: "",
    pan: "",
  });
  // --- Validation State ---
  const [errors, setErrors] = useState({});

  // --- City/State/Country Data (for dropdowns) ---
  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
  const states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Gujarat", "Rajasthan", "Uttar Pradesh"];
  const countries = ["India", "Nepal", "Bangladesh", "Sri Lanka", "Bhutan"];
  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"];
  const sexes = ["Male", "Female", "Trans", "Other"];

  // --- Auto-calculate age from DOB ---
  const handleDOBChange = (e) => {
    const dob = e.target.value;
    setForm((prev) => {
      let age = "";
      if (dob) {
        const birth = new Date(dob);
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
        age = years.toString();
      }
      return { ...prev, dob, age };
    });
  };

  // --- Handle Permanent Address Checkbox ---
  const handlePermanentSameCheckbox = (e) => {
    const checked = e.target.checked;
    setForm((prev) => {
      if (checked) {
        return {
          ...prev,
          isSameAddress: true,
          permanentHouseNo: prev.presentHouseNo,
          permanentStreetName: prev.presentStreetName,
          permanentCity: prev.presentCity,
          permanentState: prev.presentState,
          permanentCountry: prev.presentCountry,
          permanentPincode: prev.presentPincode,
          permanentNearbyPlace: prev.presentNearbyPlace,
        };
      } else {
        return {
          ...prev,
          isSameAddress: false,
          permanentHouseNo: "",
          permanentStreetName: "",
          permanentCity: "",
          permanentState: "",
          permanentCountry: "",
          permanentPincode: "",
          permanentNearbyPlace: "",
        };
      }
    });
  };

  // --- General Change Handler ---
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  // --- Validation ---
  const validate = () => {
    const newErrors = {};
    // Name fields
    if (!form.firstName) newErrors.firstName = "First name required";
    if (!form.lastName) newErrors.lastName = "Last name required";
    if (!form.fatherFirstName) newErrors.fatherFirstName = "Father's first name required";
    if (!form.fatherLastName) newErrors.fatherLastName = "Father's last name required";
    if (!form.motherName) newErrors.motherName = "Mother's name required";
    // DOB
    if (!form.dob) newErrors.dob = "Date of birth required";
    // Mobile
    if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = "Enter valid 10-digit mobile number";
    // Email
    if (!/^\S+@\S+\.\S$/.test(form.email)) newErrors.email = "Enter valid email";
    // Religion
    if (!form.religion) newErrors.religion = "Select religion";

    // --- Address Validation (updated for new fields) ---
    if (!form.presentHouseNo) newErrors.presentHouseNo = "House No. required";
    if (!form.presentStreetName) newErrors.presentStreetName = "Street name required";
    if (!form.presentPincode) newErrors.presentPincode = "Pincode required";
    if (!form.presentCity) newErrors.presentCity = "City required";
    if (!form.presentState) newErrors.presentState = "State required";
    if (!form.presentCountry) newErrors.presentCountry = "Country required";
    if (!/^\d{6}$/.test(form.presentPincode)) newErrors.presentPincode = "Valid 6-digit pincode required";

    if (!form.isSameAddress) { // Only validate permanent if not same as present
      if (!form.permanentHouseNo) newErrors.permanentHouseNo = "House No. required";
      if (!form.permanentStreetName) newErrors.permanentStreetName = "Street name required";
      if (!form.permanentPincode) newErrors.permanentPincode = "Pincode required";
      if (!form.permanentCity) newErrors.permanentCity = "City required";
      if (!form.permanentState) newErrors.permanentState = "State required";
      if (!form.permanentCountry) newErrors.permanentCountry = "Country required";
      if (!/^\d{6}$/.test(form.permanentPincode)) newErrors.permanentPincode = "Valid 6-digit pincode required";
    }

    // Aadhar
    if (!/^\d{12}$/.test(form.aadhar)) newErrors.aadhar = "Enter valid 12-digit Aadhar";
    // PAN
    if (!/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/.test(form.pan)) newErrors.pan = "Enter valid PAN";
    // Bank
    if (!form.bankType) newErrors.bankType = "Select bank type";
    if (form.bankType === "account") {
      if (!form.accountNumber) newErrors.accountNumber = "Account number required";
      if (!form.bankName) newErrors.bankName = "Bank name required";
      if (!form.ifsc) newErrors.ifsc = "IFSC required";
    }
    if (form.bankType === "upi" && !form.upi) newErrors.upi = "UPI required";
    // Sex
    if (!form.sex) newErrors.sex = "Select sex";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Save Handler ---
  const handleSave = () => {
    if (!validate()) return;
    const existing = JSON.parse(localStorage.getItem("studentDetails") || "[]");
    localStorage.setItem("studentDetails", JSON.stringify([...existing, form])); // Save to local storage
    alert("Student added successfully!");

    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      fatherFirstName: "",
      fatherMiddleName: "",
      fatherLastName: "",
      motherName: "",
      dob: "",
      age: "",
      mobile: "",
      email: "",
      religion: "",
      // Resetting updated address fields
      presentHouseNo: "",
      presentStreetName: "",
      presentCity: "",
      presentState: "",
      presentCountry: "",
      presentPincode: "",
      presentNearbyPlace: "",
      permanentHouseNo: "",
      permanentStreetName: "",
      permanentCity: "",
      permanentState: "",
      permanentCountry: "",
      permanentPincode: "",
      permanentNearbyPlace: "",
      isSameAddress: false,
      sex: "",
      aadhar: "",
      pan: "",
      bankType: "",
      upi: "",
      accountNumber: "",
      bankName: "",
      ifsc: "",
      swift: "",
    });
    setErrors({});
  };

  function handleDelete(event) {
    event.preventDefault();
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      fatherFirstName: "",
      fatherMiddleName: "",
      fatherLastName: "",
      motherName: "",
      dob: "",
      age: "",
      mobile: "",
      email: "",
      religion: "",
      // Resetting updated address fields
      presentHouseNo: "",
      presentStreetName: "",
      presentCity: "",
      presentState: "",
      presentCountry: "",
      presentPincode: "",
      presentNearbyPlace: "",
      permanentHouseNo: "",
      permanentStreetName: "",
      permanentCity: "",
      permanentState: "",
      permanentCountry: "",
      permanentPincode: "",
      permanentNearbyPlace: "",
      isSameAddress: false,
      sex: "",
      aadhar: "",
      pan: "",
      bankType: "",
      upi: "",
      accountNumber: "",
      bankName: "",
      ifsc: "",
      swift: "",
    });
    setErrors({});
  }

  return (
    <div
      className={poppins.className}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(10deg, #b2e35dff 60%, #dc55caff 100%)",
        backgroundImage:
          "url('https://images.pexels.com/photos/7232658/pexels-photo-7232658.jpeg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "flex-start", // Align content to the top
        color: '#020202ff',
        padding: 0,
        overflow: 'hidden', // Crucial: Hide any overflow for the entire body
        boxSizing: 'border-box',
      }}
    >
      {/* --- Fixed Top Header (Title) --- */}
      <div style={{
        width: '100vw',
        background: '#082e46ff',
        boxShadow: '0 1px 8px #0001',
        padding: '0.7rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        boxSizing: 'border-box',
        height: '56px',
      }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            position: 'absolute',
            left: 18,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'white',
            color: '#0e0f10ff',
            border: 'none',
            borderRadius: 6,
            padding: '0.3rem 0.8rem',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0002',
            zIndex: 2,
          }}
          aria-label="Back"
        >
          ⬅ Back
        </button>
        <h2 style={{ color: "#eef0f2ff", margin: 0, fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>Add New Student</h2>
      </div>

      {/* --- Fixed Second Header (Tabs) --- */}
      <div style={{
        width: '100vw',
        display: 'flex',
        background: '#235299ff',
        borderBottom: '1.5px solid #fefbfbff',
        boxShadow: '0 1px 8px #0001',
        position: 'fixed',
        top: '56px',
        left: 0,
        zIndex: 1100,
        boxSizing: 'border-box',
        height: '40px',
      }}>
        {['general', 'address', 'id', 'account'].map(tab => {
          const isActive = activeTab === tab;
          const isHover = hoverTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              onMouseEnter={() => setHoverTab(tab)}
              onMouseLeave={() => setHoverTab(null)}
              style={{
                flex: 1,
                padding: '0.2rem 0',
                background: isActive ? '#466ba2ff' : 'transparent',
                color: isActive ? '#01171af1' : '#f1f6fbff',
                borderTop: isActive ? '2.5px solid #fff' : 'none',
                borderLeft: isActive ? '2.5px solid #fff' : 'none',
                borderRight: isActive ? '2.5px solid #fff' : 'none',
                borderBottom: isActive || isHover ? '3px solid #67d414' : '3px solid transparent',
                borderRadius: isActive ? '8px 8px 0 0' : 0,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                zIndex: isActive ? 2 : 1,
                marginBottom: isActive ? '-2.5px' : 0,
              }}
            >
              {tab === 'general'
                ? 'General'
                : tab === 'address'
                  ? 'Address'
                  : tab === 'account'
                    ? 'Account Details'
                    : 'ID Verification'}
            </button>
          );
        })}
      </div>

      <form
        onSubmit={e => { e.preventDefault(); handleSave(); }}
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 20px #0002",
          padding: "0.8rem",
          width: "90%",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          marginTop: '105px', // Adjusted to be below fixed headers (56px + 40px + small gap)
          marginBottom: '10px', // Small margin at the bottom
          backgroundColor: 'rgba(59, 136, 185, 0.12)',
          boxSizing: 'border-box',
          flexGrow: 1,
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 105px - 10px - 20px)', // Calculate remaining height for form (viewport - headers - form-margin - button-height)
          // The 20px for button-height and its padding/margin is an estimate, may need fine-tuning
        }}
      >
        {/* --- Tab Content Container (This is where the magic for no-scroll happens) --- */}
        <div style={{
          flexGrow: 1, // Allow content to expand
          display: 'flex',
          flexDirection: 'column',
          // NO overflowY: 'auto' or 'scroll' here
          paddingBottom: '0.1rem',
          paddingTop: '0.1rem'
        }}>
          {activeTab === 'address' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}> {/* Reduced gap further */}
                {/* Present Address Block */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.3rem' }}> {/* Adjusted minmax and gap */}
                    <h3 style={{ gridColumn: '1 / -1', margin: '0', fontSize: 14 }}>Present Address</h3> {/* Reduced font size for heading */}
                    <div style={addressFieldContainerStyle}>
                        <label style={labelStyle}>House No.</label>
                        <input name="presentHouseNo" value={form.presentHouseNo} onChange={handleChange} required style={inputStyle(errors.presentHouseNo)} placeholder="101" />
                        {errors.presentHouseNo && <span style={errorStyle}>{errors.presentHouseNo}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                        <label style={labelStyle}>Street Name</label>
                        <input name="presentStreetName" value={form.presentStreetName} onChange={handleChange} required style={inputStyle(errors.presentStreetName)} placeholder="Main Street" />
                        {errors.presentStreetName && <span style={errorStyle}>{errors.presentStreetName}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                        <label style={labelStyle}>Pincode</label>
                        <input
                            name="presentPincode"
                            value={form.presentPincode || ""}
                            onChange={handleChange}
                            maxLength={6}
                            style={inputStyle(errors.presentPincode)}
                            required
                            placeholder="411001"
                        />
                        {errors.presentPincode && <span style={errorStyle}>{errors.presentPincode}</span>}
                    </div>
                    {/* City, State, Country, Nearby Place in a clearer grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '0.2rem', gridColumn: '1 / -1' }}> {/* Adjusted minmax and gap */}
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>City</label>
                            <select
                                name="presentCity"
                                value={form.presentCity || ""}
                                onChange={handleChange}
                                style={compactInputStyle()}
                                required
                            >
                                <option value="">Select</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.presentCity && <span style={errorStyle}>{errors.presentCity}</span>}
                        </div>
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>State</label>
                            <select
                                name="presentState"
                                value={form.presentState || ""}
                                onChange={handleChange}
                                style={compactInputStyle()}
                                required
                            >
                                <option value="">Select</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.presentState && <span style={errorStyle}>{errors.presentState}</span>}
                        </div>
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>Country</label>
                            <select
                                name="presentCountry"
                                value={form.presentCountry || ""}
                                onChange={handleChange}
                                style={compactInputStyle()}
                                required
                            >
                                <option value="">Select</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.presentCountry && <span style={errorStyle}>{errors.presentCountry}</span>}
                        </div>
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>Nearby Place (optional)</label>
                            <input name="presentNearbyPlace" value={form.presentNearbyPlace || ""} onChange={handleChange} style={compactInputStyle()} placeholder="Near City Mall" />
                        </div>
                    </div>
                </div>
                {/* Permanent Address Block */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.3rem' }}>
                    <div style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '0',
                    }}>
                        <h3 style={{ margin: 0, fontSize: 14 }}>Permanent Address</h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={form.isSameAddress}
                                onChange={handlePermanentSameCheckbox}
                                id="samePermanent"
                                style={{ marginRight: '0.2rem', transform: 'scale(0.8)' }} // Smaller checkbox
                            />
                            <label htmlFor="samePermanent" style={{ fontSize: 10 }}>
                                Same as present address
                            </label>
                        </div>
                    </div>

                    <div style={addressFieldContainerStyle}>
                        <label style={labelStyle}>House No.</label>
                        <input
                            name="permanentHouseNo"
                            value={form.permanentHouseNo}
                            onChange={handleChange}
                            required
                            disabled={form.isSameAddress}
                            style={inputStyle(errors.permanentHouseNo, form.isSameAddress)}
                            placeholder="101"
                        />
                        {errors.permanentHouseNo && <span style={errorStyle}>{errors.permanentHouseNo}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                        <label style={labelStyle}>Street Name</label>
                        <input
                            name="permanentStreetName"
                            value={form.permanentStreetName}
                            onChange={handleChange}
                            required
                            disabled={form.isSameAddress}
                            style={inputStyle(errors.permanentStreetName, form.isSameAddress)}
                            placeholder="Main Street"
                        />
                        {errors.permanentStreetName && <span style={errorStyle}>{errors.permanentStreetName}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                        <label style={labelStyle}>Pincode</label>
                        <input
                            name="permanentPincode"
                            value={form.isSameAddress ? form.presentPincode || "" : form.permanentPincode || ""}
                            onChange={handleChange}
                            maxLength={6}
                            style={inputStyle(errors.permanentPincode, form.isSameAddress)}
                            required
                            disabled={form.isSameAddress}
                            placeholder="411001"
                        />
                        {errors.permanentPincode && <span style={errorStyle}>{errors.permanentPincode}</span>}
                    </div>
                    {/* City, State, Country, Nearby Place in a clearer grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '0.2rem', gridColumn: '1 / -1' }}>
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>City</label>
                            <select
                                name="permanentCity"
                                value={form.isSameAddress ? form.presentCity || "" : form.permanentCity || ""}
                                onChange={handleChange}
                                style={compactInputStyle(undefined, form.isSameAddress)}
                                required
                                disabled={form.isSameAddress}
                            >
                                <option value="">Select</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.permanentCity && <span style={errorStyle}>{errors.permanentCity}</span>}
                        </div>
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>State</label>
                            <select
                                name="permanentState"
                                value={form.isSameAddress ? form.presentState || "" : form.permanentState || ""}
                                onChange={handleChange}
                                style={compactInputStyle(undefined, form.isSameAddress)}
                                required
                                disabled={form.isSameAddress}
                            >
                                <option value="">Select</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.permanentState && <span style={errorStyle}>{errors.permanentState}</span>}
                        </div>
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>Country</label>
                            <select
                                name="permanentCountry"
                                value={form.isSameAddress ? form.presentCountry || "" : form.permanentCountry || ""}
                                onChange={handleChange}
                                style={compactInputStyle(undefined, form.isSameAddress)}
                                required
                                disabled={form.isSameAddress}
                            >
                                <option value="">Select</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.permanentCountry && <span style={errorStyle}>{errors.permanentCountry}</span>}
                        </div>
                        <div style={compactFieldContainerStyle}>
                            <label style={labelStyle}>Nearby Place (optional)</label>
                            <input
                                name="permanentNearbyPlace"
                                value={form.isSameAddress ? form.presentNearbyPlace || "" : form.permanentNearbyPlace || ""}
                                onChange={handleChange}
                                style={compactInputStyle(undefined, form.isSameAddress)}
                                disabled={form.isSameAddress}
                                placeholder="Near City Mall"
                            />
                        </div>
                    </div>
                </div>
            </div>
          )}
          {activeTab === 'general' && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", paddingTop: '0.1rem' }}>
                {/* Student Name (horizontal) */}
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Student Name</label>
                  <div style={{ display: "flex", gap: "0.3rem", marginTop: '0rem' }}>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      style={inputStyle(errors.firstName)}
                      placeholder="First Name"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (document.getElementById("studentMiddleName")).focus();
                        }
                      }}
                    />
                    <input
                      id="studentMiddleName"
                      name="middleName"
                      value={form.middleName}
                      onChange={handleChange}
                      style={inputStyle()}
                      placeholder="Middle Name"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (document.getElementById("studentLastName")).focus();
                        }
                      }}
                    />
                    <input
                      id="studentLastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      style={inputStyle(errors.lastName)}
                      placeholder="Last Name"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (document.getElementById("fatherFirstName")).focus();
                        }
                      }}
                    />
                  </div>
                  {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
                  {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
                </div>
                {/* Father's Name (horizontal) */}
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Father's Name</label>
                  <div style={{ display: "flex", gap: "0.3rem", marginTop: '0rem' }}>
                    <input
                      id="fatherFirstName"
                      name="fatherFirstName"
                      value={form.fatherFirstName}
                      onChange={handleChange}
                      required
                      style={inputStyle(errors.fatherFirstName)}
                      placeholder="Father's First Name"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (document.getElementById("fatherMiddleName")).focus();
                        }
                      }}
                    />
                    <input
                      id="fatherMiddleName"
                      name="fatherMiddleName"
                      value={form.middleName}
                      onChange={handleChange}
                      style={inputStyle()}
                      placeholder="Father's Middle Name"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (document.getElementById("fatherLastName")).focus();
                        }
                      }}
                    />
                    <input
                      id="fatherLastName"
                      name="fatherLastName"
                      value={form.fatherLastName}
                      onChange={handleChange}
                      required
                      style={inputStyle(errors.fatherLastName)}
                      placeholder="Father's Last Name"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (document.getElementById("motherName")).focus();
                          
                        }
                      }}
                    />
                  </div>
                  {errors.fatherFirstName && <span style={errorStyle}>{errors.fatherFirstName}</span>}
                  {errors.fatherLastName && <span style={errorStyle}>{errors.fatherLastName}</span>}
                </div>
              </div>
              {/* Mother's Name, DOB, Age, Contact, Religion, Sex */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem", paddingBottom: '0.4rem' }}>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle} htmlFor="motherName">Mother's Name</label>
                  <input
                    id="motherName"
                    name="motherName"
                    value={form.motherName}
                    onChange={handleChange}
                    required
                    style={inputStyle(errors.motherName)}
                    placeholder="Mother's Full Name"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (document.getElementById("dob")).focus();
                      }
                    }}
                  />
                  {errors.motherName && <span style={errorStyle}>{errors.motherName}</span>}
                </div>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle} htmlFor="dob">Date of Birth</label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleDOBChange}
                    required
                    // --- Age Restriction Start ---
                    // Students cannot be born before 1990
                    min="1990-01-01"
                    // Students cannot be born after the current year (2025)
                    max="2025-12-31" // Updated max year based on current time
                    // --- Age Restriction End ---
                    style={inputStyle(errors.dob)}
                  />
                  {errors.dob && <span style={errorStyle}>{errors.dob}</span>}
                </div>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Age</label>
                  <input name="age" value={form.age} readOnly style={inputStyle()} placeholder="Auto-calculated" />
                </div>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Mobile Number</label>
                  <input name="mobile" value={form.mobile} onChange={handleChange} required style={inputStyle(errors.mobile)} maxLength={10} placeholder="9876543210" />
                  {errors.mobile && <span style={errorStyle}>{errors.mobile}</span>}
                </div>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Email ID</label>
                  <input name="email" value={form.email} onChange={handleChange} required style={inputStyle(errors.email)} placeholder="student@example.com" />
                  {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </div>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Religion</label>
                  <select name="religion" value={form.religion} onChange={handleChange} required style={inputStyle(errors.religion)}>
                    <option value="">Select</option>
                    {religions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.religion && <span style={errorStyle}>{errors.religion}</span>}
                </div>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Sex</label>
                  <select name="sex" value={form.sex} onChange={handleChange} required style={inputStyle(errors.sex)}>
                    <option value="">Select</option>
                    {sexes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.sex && <span style={errorStyle}>{errors.sex}</span>}
                </div>
              </div>
            </>
          )}
          {activeTab === 'account' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 0, padding: '0.2rem 0' }}>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Bank Type</label>
                  <select name="bankType" value={form.bankType} onChange={handleChange} required style={inputStyle(errors.bankType)}>
                    <option value="">Select</option>
                    <option value="upi">UPI</option>
                    <option value="account">Account Number</option>
                  </select>
                  {errors.bankType && <span style={errorStyle}>{errors.bankType}</span>}
                </div>
                {/* --- UPI or Account Details --- */}
                {form.bankType === "upi" && (
                  <div style={fieldContainerStyle}>
                    <label style={labelStyle}>UPI ID</label>
                    <input name="upi" value={form.upi} onChange={handleChange} required style={inputStyle(errors.upi)} placeholder="yourname@bankupi" />
                    {errors.upi && <span style={errorStyle}>{errors.upi}</span>}
                  </div>
                )}
                {form.bankType === "account" && (
                  <>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Account Number</label>
                      <input name="accountNumber" value={form.accountNumber} onChange={handleChange} required style={inputStyle(errors.accountNumber)} placeholder="123456789012" />
                      {errors.accountNumber && <span style={errorStyle}>{errors.accountNumber}</span>}
                    </div>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Bank Name</label>
                      <input name="bankName" value={form.bankName} onChange={handleChange} required style={inputStyle(errors.bankName)} placeholder="State Bank of India" />
                      {errors.bankName && <span style={errorStyle}>{errors.bankName}</span>}
                    </div>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>IFSC Code</label>
                      <input name="ifsc" value={form.ifsc} onChange={handleChange} required style={inputStyle(errors.ifsc)} placeholder="SBIN0000001" />
                      {errors.ifsc && <span style={errorStyle}>{errors.ifsc}</span>}
                    </div>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>SWIFT Code (optional)</label>
                      <input name="swift" value={form.swift} onChange={handleChange} style={inputStyle()} placeholder="SWIFTCODEIN" />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {activeTab === 'id' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 0, padding: '0.2rem 0' }}>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Aadhar Number</label>
                  <input name="aadhar" value={form.aadhar} onChange={handleChange} required style={inputStyle(errors.aadhar)} maxLength={12} placeholder="123456789012" />
                  {errors.aadhar && <span style={errorStyle}>{errors.aadhar}</span>}
                </div>
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>PAN Number</label>
                  <input name="pan" value={form.pan} onChange={handleChange} required style={inputStyle(errors.pan)} maxLength={10} placeholder="ABCDE1234F" />
                  {errors.pan && <span style={errorStyle}>{errors.pan}</span>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* --- Save/Reset Buttons --- */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 'auto', padding: '0.3rem 0' }}>
          <button type="submit" style={btnStyle("#4caf50")}>Save</button>
          <button type="button" onClick={handleDelete} style={btnStyle("#f44336")}>Reset</button>
        </div>
      </form>
    </div>
  );
}

// --- Input Style Helper ---
const inputStyle = (error, disabled) => ({
  maxWidth: "100%",
  width: "100%",
  padding: "0.25rem 0.4rem", // Even further reduced padding
  borderRadius: 3, // Smaller border radius
  border: error ? "1.5px solid #f44336" : "1px solid #ccc",
  background: disabled ? "#f5f5f5" : "#fff",
  marginBottom: 0,
  fontSize: 10.5, // Even further reduced font size
  boxSizing: 'border-box',
});

// --- Compact Input Style (for city, state, country, nearby place fields) ---
const compactInputStyle = (error, disabled) => ({
  maxWidth: `100%`,
  padding: "0.2rem 0.3rem", // Very minimal padding
  borderRadius: 3,
  border: error ? "1.5px solid #f44336" : "1px solid #ccc",
  background: disabled ? "#f5f5f5" : "#fff",
  marginBottom: 0,
  fontSize: 9.5, // Very small font size
  boxSizing: 'border-box',
});

// --- Error Style ---
const errorStyle = {
  color: "#f44336",
  fontSize: 8,
  marginLeft: 2, // Even smaller margin
  marginTop: 0, // Removed top margin
  marginBottom: 0, // Removed bottom margin
};

// --- Button Style ---
const btnStyle = (color) => ({
  padding: "0.25rem 0.5rem", // Reduced padding
  backgroundColor: color,
  color: "#fff",
  border: "none",
  borderRadius: 4, // Smaller border radius
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 11, // Reduced font size
  minWidth: 50,
});

// --- Field Container Style (for individual label-input pairs in General/Account/ID) ---
const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '0.15rem', // Very small margin
};

// --- Adjusted Field Container Style for Address Fields ---
const addressFieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '0.15rem', // Very small margin
};

// --- Compact Field Container Style (for grouped fields like City/State in Address) ---
const compactFieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '0.1rem', // Extremely small margin
};

// --- Label Style ---
const labelStyle = {
  fontSize: 10, // Very small font size for labels
  marginBottom: '0rem', // No margin for labels
  fontWeight: '500',
  
};