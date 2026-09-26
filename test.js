const email = "demo@example.com";
const password = "Password123!";

fetch("https://doxhaul.abdulahadbutt420.workers.dev/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
}).then(res => res.json()).then(console.log).catch(console.error);
