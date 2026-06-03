
// src/components/UserCreateForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const initialData = {
  profilePhoto: null, // data URL
  fullName: "",
  headline: "",
  age: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  address: "",
  city: "",
  email: "",
  phone: "",
  profession: "",
  company: "",
  experience: "",
  skills: "",
  interests: [], // array of tags
  about: "",
  education: "",
};

export default function UserCreateForm() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [step, setStep] = useState(1); // 1..3
  const [errors, setErrors] = useState({});
  const [interestInput, setInterestInput] = useState("");
  const navigate = useNavigate();

  // For swipe handling
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, formData]);

  // Swipe handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const dist = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum px swipe
    if (dist > threshold) {
      // swiped left -> next
      nextStep();
    } else if (dist < -threshold) {
      // swiped right -> prev
      prevStep();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({ ...prev, profilePhoto: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const addInterest = () => {
    const v = interestInput.trim();
    if (!v) return;
    if (formData.interests.includes(v)) {
      setInterestInput("");
      return;
    }
    setFormData((prev) => ({ ...prev, interests: [...prev.interests, v] }));
    setInterestInput("");
  };

  const removeInterest = (tag) => {
    setFormData((prev) => ({ ...prev, interests: prev.interests.filter((t) => t !== tag) }));
  };

  // basic validation per step
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name required";
      if (!formData.email) newErrors.email = "Email required";
      if (!formData.phone) newErrors.phone = "Phone required";
      if (!formData.gender) newErrors.gender = "Gender required";
      if (!formData.maritalStatus) newErrors.maritalStatus = "Marital status required";
    } else if (step === 2) {
      if (!formData.profession) newErrors.profession = "Profession required";
      if (!formData.experience) newErrors.experience = "Experience required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 3));
    // scroll slider into view for accessibility
    sliderRef.current?.focus();
  };
  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    sliderRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // final validation
    if (!validateStep()) return;
    // Here you would normally send to backend
    alert("Profile saved locally (localStorage). Redirecting to Edit Profile...");
    navigate("/edit-profile");
  };

  // Helper to render profile photo preview or placeholder
  const PhotoPreview = () => {
    if (formData.profilePhoto) {
      return (
        <img
          src={formData.profilePhoto}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border"
        />
      );
    }
    return (
      <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border">
        <span className="text-sm text-gray-500">No Photo</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <div className="text-sm text-gray-600">Step {step} of 3</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      {/* Slider / Swiper container */}
      <div
        ref={sliderRef}
        tabIndex={0}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative overflow-hidden"
      >
        {/* slides wrapper */}
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          {/* Slide 1 - Personal & Contact (mimics LinkedIn / Shaadi initial) */}
          <div className="w-full flex-shrink-0 px-4">
            <form onSubmit={handleSubmit}>
              <div className="md:flex md:space-x-6">
                <div className="md:w-1/3 flex flex-col items-center space-y-4">
                  <PhotoPreview />
                  <label className="text-sm text-gray-600">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    A clear face photo helps matches and recruiters connect with you.
                  </p>
                </div>

                <div className="md:w-2/3 mt-4 md:mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full border p-2 rounded ${errors.fullName ? "border-red-500" : ""}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Headline</label>
                      <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleChange}
                        placeholder="E.g. Fullstack Developer | React & Node"
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full border p-2 rounded ${errors.phone ? "border-red-500" : ""}`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Age"
                        className="w-full border p-2 rounded"
                        min={0}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full border p-2 rounded ${errors.gender ? "border-red-500" : ""}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Marital Status</label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className={`w-full border p-2 rounded ${errors.maritalStatus ? "border-red-500" : ""}`}
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.maritalStatus && <p className="text-red-500 text-sm">{errors.maritalStatus}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Full address"
                        className={`w-full border p-2 rounded ${errors.address ? "border-red-500" : ""}`}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Education</label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="Highest qualification"
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Slide 2 - Professional & Interests (LinkedIn style) */}
          <div className="w-full flex-shrink-0 px-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Profession / Field</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Software Engineer, Teacher..."
                    className={`w-full border p-2 rounded ${errors.profession ? "border-red-500" : ""}`}
                  />
                  {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company / Organization"
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Years of Experience</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    className={`w-full border p-2 rounded ${errors.experience ? "border-red-500" : ""}`}
                    min={0}
                  />
                  {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node, SQL..."
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">About / Bio</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell about yourself (career, expectations, interests...)"
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              {/* Interests / tags - matrimonial style */}
              <div>
                <label className="text-sm text-gray-600">Interests (add tags)</label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="Type an interest and press Enter"
                    className="flex-1 border p-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-3 py-2 bg-indigo-600 text-white rounded"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.interests.map((tag) => (
                    <span key={tag} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {tag}
                      <button
                        onClick={() => removeInterest(tag)}
                        className="ml-2 text-red-500 font-bold"
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3 - Review as Table (final) */}
          <div className="w-full flex-shrink-0 px-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review & Submit</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-semibold w-40">Photo</td>
                      <td className="px-4 py-3">
                        {formData.profilePhoto ? (
                          <img src={formData.profilePhoto} alt="profile" className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                          <span className="text-sm text-gray-500">No photo uploaded</span>
                        )}
                      </td>
                    </tr>

                    {Object.entries({
                      "Full Name": formData.fullName,
                      Headline: formData.headline,
                      Email: formData.email,
                      Phone: formData.phone,
                      DOB: formData.dob,
                      Age: formData.age,
                      Gender: formData.gender,
                      "Marital Status": formData.maritalStatus,
                      Address: formData.address,
                      City: formData.city,
                      Education: formData.education,
                      Profession: formData.profession,
                      Company: formData.company,
                      "Experience (yrs)": formData.experience,
                      Skills: formData.skills,
                      About: formData.about,
                      Interests: formData.interests.join(", "),
                    }).map(([label, value]) => (
                      <tr key={label}>
                        <td className="px-4 py-3 font-semibold bg-gray-50">{label}</td>
                        <td className="px-4 py-3">{value || <span className="text-gray-400">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      // export as JSON (download)
                      const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "profile.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Export JSON
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav controls overlay */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <button
            onClick={prevStep}
            className="p-2 bg-white rounded shadow hover:bg-gray-50"
            aria-label="Previous"
            disabled={step === 1}
          >
            ‹
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button
            onClick={nextStep}
            className="p-2 bg-white rounded shadow hover:bg-gray-50"
            aria-label="Next"
            disabled={step === 3}
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-3 h-3 rounded-full ${step === i ? "bg-indigo-600" : "bg-gray-300"}`}
              aria-label={`Go to step ${i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
