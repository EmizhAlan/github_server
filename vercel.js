{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/repositories", "dest": "/src/index.js" },
    { "src": "/repositories/:id", "dest": "/src/index.js" },
    { "src": "/sync", "dest": "/src/index.js" },
    { "src": "/(.*)", "dest": "/src/index.js" }
  ]
}
