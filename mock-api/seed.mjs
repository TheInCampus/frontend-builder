import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const dataFile = resolve(process.env.MOCK_API_DATA_FILE ?? "mock-api/data.json");
const demoPassword = "CanvasDemo123!";

if (process.env.NODE_ENV === "production") {
  throw new Error("Mock seed data is development-only and must not be used in production.");
}

const reset = process.argv.includes("--reset");
try {
  await readFile(dataFile);
  if (!reset) {
    throw new Error(`Seed data file already exists at ${dataFile}. Stop the mock API and pass --reset to replace it.`);
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const salt = randomBytes(16);
const hash = await scrypt(demoPassword, salt, 64);
const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;

const userId = "demo-user";
const appId = "naukri-connect";
const employerObjectId = "employer-profile";
const jobObjectId = "job-listing";
const employerA = "employer-bluepine";
const employerB = "employer-riverstone";
const employerC = "employer-sunfield";
const now = new Date().toISOString();

const store = {
  users: [{
    id: userId,
    name: "Canvas Demo",
    email: "demo@canvas.local",
    passwordHash,
  }],
  apps: [{
    id: appId,
    ownerId: userId,
    name: "NaukriConnect",
    description: "A regional job portal connecting growing teams with local talent.",
    createdAt: now,
  }],
  basemodels: {
    [appId]: {
      version: 1,
      objects: [
        {
          id: employerObjectId,
          name: "EmployerProfile",
          fields: [
            { id: "company-name", name: "companyName", type: "text", required: true },
            { id: "headquarters-city", name: "headquartersCity", type: "text", required: true },
            { id: "company-website", name: "website", type: "text", required: false },
          ],
        },
        {
          id: jobObjectId,
          name: "JobListing",
          fields: [
            { id: "job-title", name: "jobTitle", type: "text", required: true },
            { id: "job-description", name: "description", type: "text", required: true },
            { id: "job-city", name: "locationCity", type: "text", required: true },
            { id: "job-salary", name: "monthlySalary", type: "number", required: true },
            { id: "job-type", name: "employmentType", type: "text", required: true },
            { id: "job-active", name: "active", type: "boolean", required: true },
            { id: "employer", name: "employer", type: "relation", required: true, relatedObjectId: employerObjectId },
          ],
        },
        {
          id: "candidate-profile",
          name: "CandidateProfile",
          fields: [
            { id: "candidate-name", name: "fullName", type: "text", required: true },
            { id: "candidate-email", name: "email", type: "text", required: true },
            { id: "candidate-experience", name: "yearsExperience", type: "number", required: false },
            { id: "candidate-created", name: "createdAt", type: "date", required: true },
          ],
        },
      ],
    },
  },
  pages: [
    {
      id: "jobs-home",
      appId,
      name: "Home",
      title: "Find work that moves you forward",
      path: "/",
      objectId: jobObjectId,
      description: "Discover opportunities with teams building the future of their communities.",
      updatedAt: now,
    },
    {
      id: "jobs-list",
      appId,
      name: "Open roles",
      title: "Explore open roles",
      path: "/jobs",
      objectId: jobObjectId,
      description: "Browse available roles by location and team.",
      updatedAt: now,
    },
    {
      id: "employer-directory",
      appId,
      name: "Companies",
      title: "Meet the employers",
      path: "/companies",
      objectId: employerObjectId,
      description: "Learn about organizations hiring across the region.",
      updatedAt: now,
    },
    {
      id: "job-detail",
      appId,
      name: "Job detail",
      title: "Job opportunity",
      path: "/jobs/:jobId",
      objectId: jobObjectId,
      description: "Job detail page template.",
      updatedAt: now,
    },
  ],
  navigations: [
    { id: "nav-home", appId, name: "Home", detail: "Portal homepage", path: "/", objectId: jobObjectId, pageId: "jobs-home", active: true, permission: "public", order: 1, updatedAt: now },
    { id: "nav-jobs", appId, name: "Jobs", detail: "Browse open positions", path: "/jobs", objectId: jobObjectId, pageId: "jobs-list", active: true, permission: "public", order: 2, updatedAt: now },
    { id: "nav-companies", appId, name: "Companies", detail: "Employer directory", path: "/companies", objectId: employerObjectId, pageId: "employer-directory", active: true, permission: "public", order: 3, updatedAt: now },
  ],
  forms: [
    {
      id: "candidate-application",
      appId,
      name: "Candidate application",
      detail: "Apply to an open job",
      objectId: "candidate-profile",
      fields: [
        { name: "fullName", label: "Full name", type: "text", required: true },
        { name: "email", label: "Email address", type: "text", required: true },
        { name: "yearsExperience", label: "Years of experience", type: "number", required: false },
      ],
      submitLabel: "Submit application",
      active: true,
      updatedAt: now,
    },
    {
      id: "employer-registration",
      appId,
      name: "Employer registration",
      detail: "Create an employer profile",
      objectId: employerObjectId,
      fields: [
        { name: "companyName", label: "Company name", type: "text", required: true },
        { name: "headquartersCity", label: "City", type: "text", required: true },
        { name: "website", label: "Website", type: "text", required: false },
      ],
      submitLabel: "Create profile",
      active: true,
      updatedAt: now,
    },
  ],
  records: [
    { id: employerA, appId, objectId: employerObjectId, data: { companyName: "Bluepine Health", headquartersCity: "Pune", website: "https://bluepine.example" }, createdAt: now },
    { id: employerB, appId, objectId: employerObjectId, data: { companyName: "Riverstone Labs", headquartersCity: "Nashik", website: "https://riverstone.example" }, createdAt: now },
    { id: employerC, appId, objectId: employerObjectId, data: { companyName: "Sunfield Foods", headquartersCity: "Nagpur", website: "https://sunfield.example" }, createdAt: now },
    { id: "job-product-designer", appId, objectId: jobObjectId, data: { jobTitle: "Product Designer", description: "Shape accessible digital experiences for a growing health technology team.", locationCity: "Pune", monthlySalary: 85000, employmentType: "Full-time", active: true, employer: employerA }, createdAt: now },
    { id: "job-lab-analyst", appId, objectId: jobObjectId, data: { jobTitle: "Laboratory Analyst", description: "Help expand reliable diagnostic services across the region.", locationCity: "Nashik", monthlySalary: 52000, employmentType: "Full-time", active: true, employer: employerB }, createdAt: now },
    { id: "job-operations-lead", appId, objectId: jobObjectId, data: { jobTitle: "Operations Lead", description: "Build dependable supply operations with a mission-led food company.", locationCity: "Nagpur", monthlySalary: 67000, employmentType: "Full-time", active: true, employer: employerC }, createdAt: now },
    { id: "job-content-intern", appId, objectId: jobObjectId, data: { jobTitle: "Content Design Intern", description: "Make career information clearer and more useful for job seekers.", locationCity: "Pune", monthlySalary: 25000, employmentType: "Internship", active: true, employer: employerA }, createdAt: now },
  ],
};

await mkdir(dirname(dataFile), { recursive: true });
const temporaryFile = `${dataFile}.${process.pid}.tmp`;
await writeFile(temporaryFile, JSON.stringify(store, null, 2), { mode: 0o600 });
await rename(temporaryFile, dataFile);

console.log(`Seeded the NaukriConnect sample app at ${dataFile}`);
console.log(`Demo sign-in: demo@canvas.local / ${demoPassword}`);
console.log("These development-only credentials and sample records must never be used in production.");
