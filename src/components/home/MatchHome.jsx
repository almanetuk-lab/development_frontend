import React from "react";
import { Link } from "react-router-dom";

const features = [
  { title: "Hybrid Profiles", desc: "Combine personal and professional details." },
  { title: "Smart Matching", desc: "Matches based on skills, interests and location." },
  { title: "Advanced Search", desc: "Filter by age, profession, education and more." },
  { title: "Privacy Controls", desc: "Control visibility of each field." },
];

const sampleProfiles = [
  { name: "Aatif Aslam", role: "Singer", location: "Mumbai", attrs: ["Singing", "YouTube"] },
  { name: "Ritik Kumawat", role: "Full-Stack Dev", location: "Indore", attrs: ["React", "Node.js"] },
  { name: "Viral Kohli", role: "Cricketer", location: "Delhi", attrs: ["Batting", "Bowling"] },
];

export default function MatchHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">One profile. Endless possibilities.</h2>
            <p className="text-gray-600 mb-6">
              Create a combined personal and professional profile — showcase your career, interests, and find meaningful connections.
            </p>

            <div className="flex gap-3">
              <input className="flex-1 p-3 border rounded" placeholder="Search by name, skill or interest" />
              <button className="px-4 py-3 rounded bg-indigo-600 text-white">Search</button>
            </div>

            <div className="mt-6 flex gap-3 text-sm text-gray-600">
              <div className="px-3 py-2 bg-white rounded shadow">Matches: <strong className="ml-2">120+</strong></div>
              <div className="px-3 py-2 bg-white rounded shadow">Profiles: <strong className="ml-2">5,200+</strong></div>
              <div className="px-3 py-2 bg-white rounded shadow">Verified: <strong className="ml-2">320</strong></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold text-lg">Featured Profiles</h3>
            <div className="mt-4 space-y-4">
              {sampleProfiles.map((p, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                    {p.name.split(" ")[0][0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{p.name} <span className="text-sm text-gray-500">• {p.role}</span></div>
                    <div className="text-xs text-gray-500">{p.location}</div>
                    <div className="mt-2 text-xs text-gray-600 flex gap-2">
                      {p.attrs.map((a, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="px-3 py-1 border rounded">Connect</button>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-3">Platform Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-4 bg-white rounded shadow">
                <h4 className="font-semibold">{f.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

