"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "../components/Header";

// --- Main Add Student Form Component ---
export default function AddStudentPage() {
  console.log("AddStudentPage is loading...");
  
  // Tab state for the local form sections (General, Address, Account, ID)
  const [activeTab, setActiveTab] = useState<'general' | 'address' | 'account' | 'id'>('general');
  // Hover state for local tabs
  const [hoverTab, setHoverTab] = useState<'general' | 'address' | 'account' | 'id' | null>(null);
  // State for generated student summary
  const [studentSummary, setStudentSummary] = useState<string>("");
  // State for loading indicator during API call
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- City/State/Country Data (for dropdowns) ---
  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
  const states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Telangana", "Gujarat", "Rajasthan", "Uttar Pradesh"];
  const countries = ["India", "Nepal", "Bangladesh", "Sri Lanka", "Bhutan"];
  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"];
  const sexes = ["Male", "Female", "Trans", "Other"];

  // --- Auto-calculate age from DOB ---
  const handleDOBChange = (e: { target: { value: any; }; }) => {
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

  // --- Handle Address Checkbox ---
  const handleAddressCheckbox = (e: { target: { checked: any; }; }) => {
    const checked = e.target.checked;
    setForm((prev) => ({
      ...prev,
      isSameAddress: checked,
      // Update present address fields based on permanent if checked
      presentHouseNo: checked ? prev.permanentHouseNo : "",
      presentStreetName: checked ? prev.permanentStreetName : "",
      presentCity: checked ? prev.permanentCity : "",
      presentState: checked ? prev.permanentState : "",
      presentCountry: checked ? prev.permanentCountry : "",
      presentPincode: checked ? prev.permanentPincode : "",
      presentNearbyPlace: checked ? prev.permanentNearbyPlace : "",
    }));
  };

  // --- Handle Permanent Address Change ---
  const handlePermanentAddressChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // If "Same as present address" is checked, update present fields too
      ...(prev.isSameAddress && {
        [`present${name.replace('permanent', '')}`]: value
      })
    }));
  };

  // --- Handle "Same as present address" Checkbox ---
  const handlePermanentSameCheckbox = (e: { target: { checked: any; }; }) => {
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
  const handleChange = (e: { target: { checked?: any; name?: any; value?: any; type?: any; }; }) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  // --- Validation ---
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
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

    // --- Address Validation ---
    if (!form.presentHouseNo) newErrors.presentHouseNo = "House No. required";
    if (!form.presentStreetName) newErrors.presentStreetName = "Street name required";
    if (!form.presentPincode) newErrors.presentPincode = "Pincode required";
    if (!form.presentCity) newErrors.presentCity = "City required";
    if (!form.presentState) newErrors.presentState = "State required";
    if (!form.presentCountry) newErrors.presentCountry = "Country required";
    if (!/^\d{6}$/.test(form.presentPincode)) newErrors.presentPincode = "Valid 6-digit pincode required";

    if (!form.isSameAddress) {
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
    localStorage.setItem("studentDetails", JSON.stringify([...existing, form]));
    
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
      position: flex;
      
      top: 46%;
      left: 46%;
      transform: translate(-50%, -50%);
      background-color: #4CAF50;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      font-family: sans-serif;
      font-size: 16px;
      text-align: center;
    `;
    messageBox.textContent = "Student added successfully!";
    document.body.appendChild(messageBox);

    setTimeout(() => {
      document.body.removeChild(messageBox);
    }, 3000);

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
    setStudentSummary("");
  };

    function handleDelete(event: { preventDefault: () => void; }) {
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
    setStudentSummary("");
  }

  const [userName, setUserName] = useState("");
  useEffect(() => {
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
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      setUserName(user?.name || "User");
    }
  }, []);

  const tabs = ['general', 'address', 'id', 'account'] as const;

  return (
    <div style={{ minHeight: "100vh", background: 'rgb(89, 196, 178)', position: "fixed", }}>
      <Header tabName="Master" userName={userName} />
      <div style={{ height: 55, }} /> {/* Spacer for fixed header */}
      
        {/* --- Second Header: Tabs with Hover Effect --- */}
        <div style={{
          width: '100vw',
          display: 'flex',
        
          gap: 0,
        background: 'rgb(219, 117, 33)',
          borderBottom: '1.5px solid #fefbfbff',
          boxShadow: '0 1px 8px #0001',
        color: "rgb(49, 219, 33)",
          marginBottom: '0.5rem',
        marginTop: '-0.8rem',
        overflow: 'visible',
          marginLeft: 0,
        marginRight: '3vw',
        position: 'fixed',
        top: 64,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
        }}>
        {tabs.map((tab) => {
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
                  padding: '0.5rem ',
                  background: isActive ? '#466ba2ff' : 'transparent',
                  color: isActive ? '#01171af1' : '#f1f6fbff',
                  borderTop: isActive ? '2.5px solid #fff' : 'none',
                  borderLeft: isActive ? '2.5px solid #fff' : 'none',
                  borderRight: isActive ? '2.5px solid #fff' : 'none',
                borderBottom: isActive || isHover ? '3px solid rgb(20, 212, 212)' : '3px solid transparent',
                  borderRadius: isActive ? '8px 8px 0 0' : 0,
                  fontWeight: 700,
                fontSize: 16,
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
            borderRadius: 16,
            boxShadow: "0 2px 24px #0002",
          padding: "0.5rem",
            minWidth: 350,
          maxWidth: 1300,
          width: "100%",
          display: "fixed",
            flexDirection: "column",
            gap: "0.5rem",
          marginLeft: "0.5rem",
            marginRight: 'auto',
          marginTop: 30,
          position:'fixed',
          backgroundColor: 'rgb(163, 238, 232)',
          overflow: 'hidden',
          }}
        >
          {/* --- Tab Content: Only show content for active tab --- */}
        {activeTab === 'general' && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.3rem", padding: '1.5rem 0' }}>
              {/* Student Name (horizontal) */}
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Student Name</label>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: '0.1rem' }}>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    style={inputStyle(errors?.firstName, undefined, "32%")}
                    placeholder="First Name"
                  />
                  <input
                    name="middleName"
                    value={form.middleName}
                    onChange={handleChange}
                    style={inputStyle(undefined, undefined, "32%")}
                    placeholder="Middle Name"
                  />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    style={inputStyle(errors?.lastName, undefined, "32%")}
                    placeholder="Last Name"
                  />
                </div>
                {errors?.firstName && <span style={errorStyle}>{errors?.firstName}</span>}
                {errors?.lastName && <span style={errorStyle}>{errors?.lastName}</span>}
              </div>
              
              {/* Father's Name (horizontal) */}
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Father's Name</label>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: '0.1rem' }}>
                  <input
                    name="fatherFirstName"
                    value={form.fatherFirstName}
                    onChange={handleChange}
                    required
                    style={inputStyle(errors?.fatherFirstName, undefined, "32%")}
                    placeholder="Father's First Name"
                  />
                  <input
                    name="fatherMiddleName"
                    value={form.fatherMiddleName}
                    onChange={handleChange}
                    style={inputStyle(undefined, undefined, "32%")}
                    placeholder="Father's Middle Name"
                  />
                  <input
                    name="fatherLastName"
                    value={form.fatherLastName}
                    onChange={handleChange}
                    required
                    style={inputStyle(errors?.fatherLastName, undefined, "32%")}
                    placeholder="Father's Last Name"
                  />
                </div>
                {errors?.fatherFirstName && <span style={errorStyle}>{errors?.fatherFirstName}</span>}
                {errors?.fatherLastName && <span style={errorStyle}>{errors?.fatherLastName}</span>}
              </div>
            </div>
            
            {/* Mother's Name, DOB, Age, Contact, Religion, Sex */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", paddingBottom: '0.5rem' }}>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Mother's Name</label>
                <input
                  name="motherName"
                  value={form.motherName}
                  onChange={handleChange}
                  required
                  style={inputStyle(errors?.motherName)}
                  placeholder="Mother's Full Name"
                />
                {errors?.motherName && <span style={errorStyle}>{errors?.motherName}</span>}
              </div>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleDOBChange}
                  required
                  min="1990-01-01"
                  max="2024-12-31"
                  style={inputStyle(errors?.dob)}
                />
                {errors?.dob && <span style={errorStyle}>{errors?.dob}</span>}
              </div>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Age</label>
                <input name="age" value={form.age} readOnly style={inputStyle(undefined)} placeholder="Auto-calculated" />
              </div>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Mobile Number</label>
                <input name="mobile" value={form.mobile} onChange={handleChange} required style={inputStyle(errors?.mobile)} maxLength={10} placeholder="9876543210" />
                {errors?.mobile && <span style={errorStyle}>{errors?.mobile}</span>}
              </div>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Email ID</label>
                <input name="email" value={form.email} onChange={handleChange} required style={inputStyle(errors?.email)} placeholder="student@example.com" />
                {errors?.email && <span style={errorStyle}>{errors?.email}</span>}
              </div>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Religion</label>
                <select name="religion" value={form.religion} onChange={handleChange} required style={inputStyle(errors?.religion)}>
                  <option value="">Select</option>
                  {religions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors?.religion && <span style={errorStyle}>{errors?.religion}</span>}
              </div>
              <div style={fieldContainerStyle}>
                <label style={labelStyle}>Sex</label>
                <select name="sex" value={form.sex} onChange={handleChange} required style={inputStyle(errors?.sex)}>
                  <option value="">Select</option>
                  {sexes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors?.sex && <span style={errorStyle}>{errors?.sex}</span>}
              </div>
            </div>
          </>
        )}

              {activeTab === 'address' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: 0, padding: '0.9rem ' }}>
                  {/* Present Address Block */}
                  <div style={{
                    display: 'grid',
              gridTemplateColumns: 'minmax(150px, 1fr) minmax(250px, 2fr) minmax(100px, 1fr)',
                    gap: '0.9rem'
                  }}>
                    <h3 style={{ gridColumn: '1 / -1', marginBottom: '0.5rem', marginTop: '0.5rem', fontSize: 18 }}>Present Address</h3>
                    <div style={addressFieldContainerStyle}>
                      <label style={labelStyle}>House No.</label>
                      <input
                        name="presentHouseNo"
                        value={form.presentHouseNo}
                        onChange={handleChange}
                        required
                  style={inputStyle(errors?.presentHouseNo, undefined, "95%")}
                        placeholder="101"
                      />
                {errors?.presentHouseNo && <span style={errorStyle}>{errors?.presentHouseNo}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                      <label style={labelStyle}>Street Name</label>
                      <input
                        name="presentStreetName"
                        value={form.presentStreetName}
                        onChange={handleChange}
                        required
                  style={inputStyle(errors?.presentStreetName, undefined, "83%")}
                        placeholder="Flat, Building, Area, Locality"
                      />
                {errors?.presentStreetName && <span style={errorStyle}>{errors?.presentStreetName}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                      <label style={labelStyle}>Pincode</label>
                      <input
                        name="presentPincode"
                        value={form.presentPincode || ""}
                        onChange={handleChange}
                        maxLength={6}
                  style={inputStyle(errors?.presentPincode, undefined, "65%")}
                        required
                        placeholder="411001"
                      />
                {errors?.presentPincode && <span style={errorStyle}>{errors?.presentPincode}</span>}
                    </div>
              
                    {/* City, State, Country, Nearby Place in a clearer grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', gridColumn: '1 / -1' }}>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>City</label>
                        <select
                          name="presentCity"
                          value={form.presentCity || ""}
                          onChange={handleChange}
                    style={compactInputStyle(errors?.presentCity, undefined, "65%")}
                          required
                        >
                          <option value="">Select</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                  {errors?.presentCity && <span style={errorStyle}>{errors?.presentCity}</span>}
                      </div>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>State</label>
                        <select
                          name="presentState"
                          value={form.presentState || ""}
                          onChange={handleChange}
                    style={compactInputStyle(errors?.presentState, undefined, "65%")}
                          required
                        >
                          <option value="">Select</option>
                          {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                  {errors?.presentState && <span style={errorStyle}>{errors?.presentState}</span>}
                      </div>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>Country</label>
                        <select
                          name="presentCountry"
                          value={form.presentCountry || ""}
                          onChange={handleChange}
                    style={compactInputStyle(errors?.presentCountry, undefined, "65%")}
                          required
                        >
                          <option value="">Select</option>
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                  {errors?.presentCountry && <span style={errorStyle}>{errors?.presentCountry}</span>}
                      </div>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>Nearby Place (optional)</label>
                  <input name="presentNearbyPlace" value={form.presentNearbyPlace || ""} onChange={handleChange} style={compactInputStyle(undefined)} placeholder="Near City Mall" />
                      </div>
                    </div>
                  </div>
            
                  {/* Permanent Address Block */}
                  <div style={{
                    display: 'grid',
              gridTemplateColumns: 'minmax(150px, 1fr) minmax(250px, 2fr) minmax(100px, 1fr)',
                    gap: '0.6rem'
                  }}>
                    <div style={{
                      gridColumn: '1 / -1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.1rem',
                      marginTop: '0.1rem'
                    }}>
                      <h3 style={{ margin: 0, fontSize: 18 }}>Permanent Address</h3>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={form.isSameAddress}
                          onChange={handlePermanentSameCheckbox}
                          id="samePermanent"
                          style={{ marginRight: '0.5rem' }}
                        />
                  <label htmlFor="samePermanent" style={{ fontSize: 14 }}>
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
                  style={inputStyle(errors?.permanentHouseNo, form.isSameAddress)}
                        placeholder="101"
                      />
                {errors?.permanentHouseNo && <span style={errorStyle}>{errors?.permanentHouseNo}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                      <label style={labelStyle}>Street Name</label>
                      <input
                        name="permanentStreetName"
                        value={form.permanentStreetName}
                        onChange={handleChange}
                        required
                        disabled={form.isSameAddress}
                  style={inputStyle(errors?.permanentStreetName, form.isSameAddress, "83%")}
                        placeholder="Flat, Building, Area, Locality"
                      />
                {errors?.permanentStreetName && <span style={errorStyle}>{errors?.permanentStreetName}</span>}
                    </div>
                    <div style={addressFieldContainerStyle}>
                      <label style={labelStyle}>Pincode</label>
                      <input
                        name="permanentPincode"
                        value={form.isSameAddress ? form.presentPincode || "" : form.permanentPincode || ""}
                        onChange={handleChange}
                        maxLength={6}
                  style={inputStyle(errors?.permanentPincode, form.isSameAddress, "65%")}
                        required
                        disabled={form.isSameAddress}
                        placeholder="411001"
                      />
                {errors?.permanentPincode && <span style={errorStyle}>{errors?.permanentPincode}</span>}
                    </div>
              
                    {/* City, State, Country, Nearby Place in a clearer grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', gridColumn: '1 / -1' }}>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>City</label>
                        <select
                          name="permanentCity"
                          value={form.isSameAddress ? form.presentCity || "" : form.permanentCity || ""}
                          onChange={handleChange}
                    style={compactInputStyle(errors?.permanentCity, form.isSameAddress, "65%")}
                          required
                          disabled={form.isSameAddress}
                        >
                          <option value="">Select</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                  {errors?.permanentCity && <span style={errorStyle}>{errors?.permanentCity}</span>}
                      </div>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>State</label>
                        <select
                          name="permanentState"
                          value={form.isSameAddress ? form.presentState || "" : form.permanentState || ""}
                          onChange={handleChange}
                    style={compactInputStyle(errors?.permanentState, form.isSameAddress, "65%")}
                          required
                          disabled={form.isSameAddress}
                        >
                          <option value="">Select</option>
                          {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                  {errors?.permanentState && <span style={errorStyle}>{errors?.permanentState}</span>}
                      </div>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>Country</label>
                        <select
                          name="permanentCountry"
                          value={form.isSameAddress ? form.presentCountry || "" : form.permanentCountry || ""}
                          onChange={handleChange}
                    style={compactInputStyle(errors?.permanentCountry, form.isSameAddress, "65%")}
                          required
                          disabled={form.isSameAddress}
                        >
                          <option value="">Select</option>
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                  {errors?.permanentCountry && <span style={errorStyle}>{errors?.permanentCountry}</span>}
                      </div>
                      <div style={compactFieldContainerStyle}>
                        <label style={labelStyle}>Nearby Place (optional)</label>
                        <input
                          name="permanentNearbyPlace"
                          value={form.isSameAddress ? form.presentNearbyPlace || "" : form.permanentNearbyPlace || ""}
                          onChange={handleChange}
                    style={compactInputStyle(undefined)}
                          disabled={form.isSameAddress}
                          placeholder="Near City Mall"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 8, padding: '0.5rem 0' }}>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Bank Type</label>
              <select name="bankType" value={form.bankType} onChange={handleChange} required style={inputStyle(errors?.bankType)}>
                        <option value="">Select</option>
                        <option value="upi">UPI</option>
                        <option value="account">Account Number</option>
                      </select>
              {errors?.bankType && <span style={errorStyle}>{errors?.bankType}</span>}
                    </div>
            
                    {form.bankType === "upi" && (
                      <div style={fieldContainerStyle}>
                        <label style={labelStyle}>UPI ID</label>
                <input name="upi" value={form.upi} onChange={handleChange} required style={inputStyle(errors?.upi)} placeholder="yourname@bankupi" />
                {errors?.upi && <span style={errorStyle}>{errors?.upi}</span>}
                      </div>
                    )}
            
                    {form.bankType === "account" && (
                      <>
                        <div style={fieldContainerStyle}>
                          <label style={labelStyle}>Account Number</label>
                  <input name="accountNumber" value={form.accountNumber} onChange={handleChange} required style={inputStyle(errors?.accountNumber)} placeholder="123456789012" />
                  {errors?.accountNumber && <span style={errorStyle}>{errors?.accountNumber}</span>}
                        </div>
                        <div style={fieldContainerStyle}>
                          <label style={labelStyle}>Bank Name</label>
                  <input name="bankName" value={form.bankName} onChange={handleChange} required style={inputStyle(errors?.bankName)} placeholder="State Bank of India" />
                  {errors?.bankName && <span style={errorStyle}>{errors?.bankName}</span>}
                        </div>
                        <div style={fieldContainerStyle}>
                          <label style={labelStyle}>IFSC Code</label>
                  <input name="ifsc" value={form.ifsc} onChange={handleChange} required style={inputStyle(errors?.ifsc)} placeholder="SBIN0000001" />
                  {errors?.ifsc && <span style={errorStyle}>{errors?.ifsc}</span>}
                        </div>
                        <div style={fieldContainerStyle}>
                          <label style={labelStyle}>SWIFT Code (optional)</label>
                  <input name="swift" value={form.swift} onChange={handleChange} style={inputStyle(undefined)} placeholder="SWIFTCODEIN" />
                        </div>
                      </>
                    )}
                  </div>
              )}

              {activeTab === 'id' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 8, padding: '0.5rem 0' }}>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Aadhar Number</label>
              <input name="aadhar" value={form.aadhar} onChange={handleChange} required style={inputStyle(errors?.aadhar)} maxLength={12} placeholder="123456789012" />
              {errors?.aadhar && <span style={errorStyle}>{errors?.aadhar}</span>}
                    </div>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>PAN Number</label>
              <input name="pan" value={form.pan} onChange={handleChange} required style={inputStyle(errors?.pan)} maxLength={10} placeholder="ABCDE1234F" />
              {errors?.pan && <span style={errorStyle}>{errors?.pan}</span>}
                    </div>
                  </div>
          )}
  
          {/* --- Save/Reset Buttons --- */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <button type="submit" style={btnStyle("#4caf50")}>Save</button>
            <button type="button" onClick={handleDelete} style={btnStyle("#f44336")}>Reset</button>
          </div>
        </form>
    </div>
  );
}

// --- Style Helpers ---
const inputStyle = (error: any, disabled?: boolean, customWidth?: string) => ({
  maxWidth: customWidth || "100%",
  width: customWidth || "90%",
    padding: "0.5rem 0.7rem",
    borderRadius: 6,
  border: error ? "1.5px solid rgb(248, 15, 15)" : "1px solid #ccc",
    background: disabled ? "#f5f5f5" : "#fff",
    marginBottom: 0,
    fontSize: 13,
  boxSizing: 'border-box' as const,
});

const compactInputStyle = (error?: any, disabled?: boolean, customWidth?: string) => ({
  maxWidth: customWidth || `100%`,
  width: customWidth || `100%`,
    padding: "0.4rem 0.5rem",
    borderRadius: 6,
  border: error ? "1.5px solid rgb(236, 9, 9)" : "1px solid #ccc",
    background: disabled ? "#f5f5f5" : "#fff",
    marginBottom: 0,
  fontSize: 15,
  boxSizing: 'border-box' as const,
  });
  
  const errorStyle = {
    color: "#f44336",
  fontSize: 13,
    marginLeft: 4,
    marginTop: 2,
    marginBottom: 2,
  };
  
  const btnStyle = (color: string) => ({
    padding: "0.4rem 0.8rem",
    backgroundColor: color,
  color: "rgb(247, 241, 241)",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    minWidth: 70,
  });
  
  const fieldContainerStyle = {
    display: 'flex',
  flexDirection: 'column' as const,
  marginBottom: '0.1rem',
  };
  
  const addressFieldContainerStyle = {
    display: 'flex',
  flexDirection: 'column' as const,
  marginBottom: '0.1rem',
  };
  
  const compactFieldContainerStyle = {
    display: 'flex',
  flexDirection: 'column' as const,
  marginBottom: '0.1rem',
  };
  
  const labelStyle = {
  fontSize: 12,
    marginBottom: '0.1rem',
  };