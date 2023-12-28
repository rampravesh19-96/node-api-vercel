const os = require("os");
const getIPAddress = () => {
  const ifaces = os.networkInterfaces();
  let ipAddress = "localhost"; // Default to localhost if the IP isn't found
  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });
  return ipAddress;
};

module.exports = { getIPAddress };
