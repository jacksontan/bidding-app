module.exports = {
  "jwt": {
    "privateKey": "supersecretandsuperprivatekey"
  },
  "timeouts": {
    "session": 60*60*24*30, // 1 month in seconds
  },
  "cors": {
    "allowedOrigin": "http://localhost:8082"
  }
}
