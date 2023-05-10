module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3001/"],
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
