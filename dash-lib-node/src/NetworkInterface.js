const os = require('os');

const NetworkInterface = {
  default_iface() {
    let interfaces = os.networkInterfaces();
    let names = Object.keys(interfaces);

    for (let name of names) {
      if (interfaces[name].every(iface => !iface.internal))
        return name;
    };

    return null;
  }
}

module.exports = NetworkInterface;
