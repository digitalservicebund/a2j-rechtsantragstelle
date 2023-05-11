module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/"],
      startServerCommand: "node ./server.js",
      settings: {
        chromeFlags: "--no-sandbox",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
