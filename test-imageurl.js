// Quick sanity check — run with: node test-imageurl.js
process.env.FRONTEND_PUBLIC_PATH = "C:/Users/dell/OneDrive/Documents/GitHub/grocerystore/public";

const imageUrl = require("./middleware/imageUrl");

const fakeFile = {
  destination: "C:\\Users\\dell\\OneDrive\\Documents\\GitHub\\grocerystore\\public\\productitems",
  filename: "1720000000000-123456789.jpg",
};

const result = imageUrl(fakeFile);
console.log("\n=== RESULT ===");
console.log(result);
console.log("PASS:", result === "/productitems/1720000000000-123456789.jpg");
