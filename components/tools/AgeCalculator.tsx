"use client";

import { useState } from "react";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayIn: number;
};

function calculateAge(dobString: string): AgeResult | null {
  const [y, m, d] = dobString.split("-").map(Number);
  if (!y || !m || !d) return null;

  const dob = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dob > today) return null;

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((today.getTime() - dob.getTime()) / 86400000);

  let next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  const nextBirthdayIn = Math.round(
    (next.getTime() - today.getTime()) / 86400000
  );

  return { years, months, days, totalDays, nextBirthdayIn };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("");

  const result = dob ? calculateAge(dob) : null;
  const isFuture = dob !== "" && result === null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <label className="block text-sm font-medium text-gray-700">
        Date of birth
      </label>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
      />

      {isFuture && (
        <p className="mt-4 text-sm text-red-600">
          Date of birth cannot be in the future.
        </p>
      )}

      {result && (
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-3 text-center">
            <Box value={result.years} label="Years" />
            <Box value={result.months} label="Months" />
            <Box value={result.days} label="Days" />
          </div>

          <div className="mt-4 space-y-2 rounded-xl bg-blue-50 p-5 text-gray-700">
            <p>
              Total days lived:{" "}
              <span className="font-semibold text-gray-900">
                {result.totalDays.toLocaleString("en-IN")}
              </span>
            </p>
            <p>
              Next birthday in:{" "}
              <span className="font-semibold text-gray-900">
                {result.nextBirthdayIn === 0
                  ? "Today! 🎉"
                  : `${result.nextBirthdayIn} days`}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-blue-50 p-4">
      <p className="text-3xl font-bold text-blue-600">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
    </div>
  );
}