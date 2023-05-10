module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/"],
      startServerCommand: "npm run dev",
      settings: {
        chromeFlags: "--no-sandbox",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
