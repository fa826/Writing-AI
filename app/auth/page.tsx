"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

const years = Array.from(
  { length: 100 },
  (_, i) => String(new Date().getFullYear() - i)
);

const pronounOptions = [
  "She/Her",
  "He/Him",
  "They/Them",
  "Prefer not to say",
];

export default function AuthPage() {
  const [first_Name, setFirstName] = useState("");
  const [last_Name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [username, setUsername] = useState("");

  const [usernameTaken, setUsernameTaken] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [phoneTaken, setPhoneTaken] = useState(false);

  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [pronouns, setPronouns] = useState("");

  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [wantsReaderAccess, setWantsReaderAccess] = useState(false);
  const [wantsWriterAccess, setWantsWriterAccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  async function CheckUsernameAvailability(value: string) {
    if (!value.trim()) return;

    setCheckingUsername(true);
    setUsernameTaken(false);

    try {
      const res = await fetch(
        `/api/auth/check-username?username=${encodeURIComponent(value)}`
      );

      if (!res.ok) return;

      const data = await res.json();
      setUsernameTaken(data.taken);
    } catch (error) {
      console.error("Username check error", error);
    } finally {
      setCheckingUsername(false);
    }
  }

  async function CheckEmailAvailability(value: string) {
    if (!value.trim()) return;

    try {
      const res = await fetch(
        `/api/auth/check-email?email=${encodeURIComponent(value)}`
      );

      if (!res.ok) return;

      const data = await res.json();
      setEmailTaken(data.taken);
    } catch (error) {
      console.error("Email check error", error);
    }
  }

  async function CheckPhoneAvailability(value?: string) {
    if (!value) return;

    try {
      const res = await fetch(
        `/api/auth/check-phone?phoneNumber=${encodeURIComponent(value)}`
      );

      if (!res.ok) return;

      const data = await res.json();
      setPhoneTaken(data.taken);
    } catch (error) {
      console.error("Phone check error", error);
    }
  }

  function isUnder18(year: string) {
    if (!year) return false;
    const currentYear = new Date().getFullYear();
    return currentYear - parseInt(year) < 18;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    if (passwordMismatch) {
      setIsError(true);
      setFeedback("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (usernameTaken) {
      setIsError(true);
      setFeedback("Username is already taken.");
      setLoading(false);
      return;
    }

    if (emailTaken) {
      setIsError(true);
      setFeedback("An account with this email already exists.");
      setLoading(false);
      return;
    }

    if (phoneTaken) {
      setIsError(true);
      setFeedback("An account with this phone number already exists.");
      setLoading(false);
      return;
    }

    if (!wantsReaderAccess && !wantsWriterAccess) {
      setIsError(true);
      setFeedback("Please select Reader's Arena, Writer's Board, or both.");
      setLoading(false);
      return;
    }

    if (isUnder18(birthYear)) {
      setIsError(true);
      setFeedback("You must be at least 18 years old to sign up.");
      setLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setIsError(true);
      setFeedback("Please agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        first_Name,
        last_Name,
        username,
        phoneNumber: phoneNumber || "",
        email,
        birthMonth,
        birthDay,
        birthYear,
        pronouns,
        is_reader: wantsReaderAccess,
        is_writer: wantsWriterAccess,
        password,
        confirmPassword,
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setFeedback(data.message || "Signup failed.");
        return;
      }

      setIsError(false);
      setFeedback("");
      setShowSignupSuccess(true);

      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPhoneNumber("");
      setBirthMonth("");
      setBirthDay("");
      setBirthYear("");
      setPronouns("");
      setPassword("");
      setConfirmPassword("");
      setAgreedToTerms(false);
      setWantsReaderAccess(false);
      setWantsWriterAccess(false);

      setUsernameTaken(false);
      setEmailTaken(false);
      setPhoneTaken(false);
      setPasswordMismatch(false);
    } catch (error) {
      console.error("Submit error:", error);
      setIsError(true);
      setFeedback("Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside() {
      setActiveInfo(null);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="min-h-[calc(100vh-32px)] overflow-hidden rounded-[32px] bg-[#F8FAFF] shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
        <header className="flex items-center justify-between bg-[#1F3772] px-10 py-6 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Scriptora
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <a className="cursor-pointer text-white/90 transition hover:text-[#C7D7FF]">
              Join Community
            </a>
            <a className="cursor-pointer text-white/90 transition hover:text-[#C7D7FF]">
              Use Writing AI
            </a>
          </nav>
        </header>

        <section className="flex min-h-[calc(100vh-120px)] items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-[28px] border border-[#D7DEEE] bg-white p-8 shadow-[0_14px_35px_rgba(59,100,186,0.12)]">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-[#1F2A44]">
                Create New Account
              </h1>

              {feedback && (
                <p className={`mt-2 text-sm ${isError ? "text-[#B91C3E]" : "text-[#3B64BA]"}`}>
                  {feedback}
                </p>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={first_Name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={last_Name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-medium text-[#1F2A44]">
                    Username
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveInfo(activeInfo === "username" ? null : "username");
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F2A44] text-xs font-bold text-white"
                    >
                      i
                    </button>

                    {activeInfo === "username" && (
                      <div className="absolute bottom-8 left-1/2 z-20 w-72 -translate-x-1/2 rounded-md bg-[#2F2F2F] px-5 py-4 text-center text-sm leading-6 text-white shadow-lg">
                        You do not have to use your real name. You can choose to use another name to protect your privacy.
                        <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[#2F2F2F]" />
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameTaken(false);
                  }}
                  onBlur={() => CheckUsernameAvailability(username)}
                  className={`w-full rounded-xl border bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition ${
                    usernameTaken ? "border-[#B91C3E]" : "border-[#D7DEEE] focus:border-[#3B64BA]"
                  }`}
                />

                {checkingUsername && (
                  <p className="mt-2 text-sm text-[#6B7690]">Checking username...</p>
                )}

                {usernameTaken && (
                  <p className="mt-2 text-sm text-[#B91C3E]">Username is taken.</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Phone Number
                </label>

                <div
                  className={`w-full rounded-xl border bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition ${
                    phoneTaken ? "border-[#B91C3E]" : "border-[#D7DEEE] focus-within:border-[#3B64BA]"
                  }`}
                >
                  <PhoneInput
                    international
                    defaultCountry="US"
                    countryCallingCodeEditable={false}
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                      setPhoneTaken(false);
                    }}
                    onBlur={() => CheckPhoneAvailability(phoneNumber)}
                    className="phone-input w-full outline-none"
                  />
                </div>

                {phoneTaken && (
                  <p className="mt-2 text-sm text-[#B91C3E]">
                    An account with this phone number already exists.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailTaken(false);
                  }}
                  onBlur={() => CheckEmailAvailability(email)}
                  className={`w-full rounded-xl border bg-[#F8FAFF] px-4 py-3 text-[#1F2A44] outline-none transition ${
                    emailTaken ? "border-[#B91C3E]" : "border-[#D7DEEE] focus:border-[#3B64BA]"
                  }`}
                />

                {emailTaken && (
                  <p className="mt-2 text-sm text-[#B91C3E]">
                    An account with this email already exists.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-medium text-[#1F2A44]">
                    Birthday
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveInfo(activeInfo === "birthday" ? null : "birthday");
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1F2A44] text-xs font-bold text-white"
                    >
                      i
                    </button>

                    {activeInfo === "birthday" && (
                      <div className="absolute bottom-8 left-1/2 z-20 w-80 -translate-x-1/2 rounded-md bg-[#2F2F2F] px-5 py-4 text-center text-sm leading-6 text-white shadow-lg">
                        You need to enter the date you were born. This information will only be visible to you and Scriptora&apos;s support team.
                        <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[#2F2F2F]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#6B7280] outline-none transition focus:border-[#3B64BA]"
                  >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                      <option key={month} value={String(index + 1).padStart(2, "0")}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#6B7280] outline-none transition focus:border-[#3B64BA]"
                  >
                    <option value="">Day</option>
                    {days.map((day) => (
                      <option key={day} value={day.padStart(2, "0")}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#6B7280] outline-none transition focus:border-[#3B64BA]"
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {isUnder18(birthYear) && (
                  <p className="mt-2 text-sm text-[#B91C3E]">
                    You must be at least 18 years old.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="block text-sm font-medium text-[#1F2A44]">
                    Pronouns <span className="text-[#6B7690]">(optional)</span>
                  </label>
                </div>

                <select
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 text-[#6B7280] outline-none transition focus:border-[#3B64BA]"
                >
                  <option value="">Pronouns (optional)</option>
                  {pronounOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                      setPasswordMismatch(confirmPassword !== "" && value !== confirmPassword);
                    }}
                    className="w-full rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] px-4 py-3 pr-20 text-[#1F2A44] outline-none transition focus:border-[#3B64BA]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#3B64BA]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setConfirmPassword(value);
                      setPasswordMismatch(password !== value);
                    }}
                    className={`w-full rounded-xl border bg-[#F8FAFF] px-4 py-3 pr-20 text-[#1F2A44] outline-none transition ${
                      passwordMismatch ? "border-[#B91C3E]" : "border-[#D7DEEE] focus:border-[#3B64BA]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#3B64BA]"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {passwordMismatch && (
                  <p className="mt-2 text-sm text-[#B91C3E]">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2A44]">
                  Sign up for
                </label>

                <div className="space-y-2 rounded-xl border border-[#D7DEEE] bg-[#F8FAFF] p-4">
                  <label className="flex items-center gap-3 text-sm text-[#1F2A44]">
                    <input
                      type="checkbox"
                      checked={wantsReaderAccess}
                      onChange={(e) => setWantsReaderAccess(e.target.checked)}
                    />
                    Reader&apos;s Arena
                  </label>

                  <label className="flex items-center gap-3 text-sm text-[#1F2A44]">
                    <input
                      type="checkbox"
                      checked={wantsWriterAccess}
                      onChange={(e) => setWantsWriterAccess(e.target.checked)}
                    />
                    Writer&apos;s Board
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                />

                <p className="text-sm text-[#6B7690]">
                  I agree to the{" "}
                  <span className="cursor-pointer font-semibold text-[#3B64BA]">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="cursor-pointer font-semibold text-[#3B64BA]">
                    Privacy Policy
                  </span>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#E6EBF7] px-4 py-3 font-semibold text-[#3B64BA] transition-all duration-200 hover:bg-[#3B64BA] hover:text-white disabled:opacity-60"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </form>
          </div>
        </section>
      </div>

      {showSignupSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-xl font-bold text-[#1F2A44]">
              Signup Successful
            </h2>

            <p className="mt-3 text-sm text-[#6B7690]">
              Please check your email to verify your account.
            </p>

            <button
              type="button"
              onClick={() => setShowSignupSuccess(false)}
              className="mt-5 w-full rounded-xl bg-[#3B64BA] px-4 py-3 font-semibold text-white hover:bg-[#1F3772]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}