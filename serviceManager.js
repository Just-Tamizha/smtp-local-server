const Service = require("node-windows").Service;
require("dotenv").config();

const serviceName = process.env.SERVICE_NAME || "LocalSMTP";

const svc = new Service({
  name: serviceName,
  description: "Local SMTP Server for Development & Testing",
  script: "index.js"   // ROOT FILE
});

/* EVENTS */
svc.on("install", () => {
  console.log("✅ Service installed");
  svc.start();
});
svc.on("start", () => console.log("✅ Service started"));
svc.on("stop", () => console.log("🛑 Service stopped"));
svc.on("uninstall", () => console.log("❌ Service uninstalled"));

/* COMMAND HANDLER */
const action = process.argv[2];

switch (action) {
  case "install":
    svc.install();
    break;
  case "start":
    svc.start();
    break;
  case "stop":
    svc.stop();
    break;
  case "restart":
    svc.stop();
    setTimeout(() => svc.start(), 3000);
    break;
  case "uninstall":
    svc.uninstall();
    break;
  default:
    console.log(`
Usage:
  node serviceManager.js install
  node serviceManager.js start
  node serviceManager.js stop
  node serviceManager.js restart
  node serviceManager.js uninstall
`);
}