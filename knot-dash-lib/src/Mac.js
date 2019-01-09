const Mac = {
  to_hexadecimal(numbers) {
    let hex_strings = numbers.map(decimal => decimal.toString(16).padStart(2, '0'));
    return hex_strings.join(':');
  },

  address(packet) {
    let protocol = packet.payload.ethertype;

    if (protocol === 2054)
      return Mac.to_hexadecimal(packet.payload.payload.sender_ha.addr)

    else if (protocol === 2048)
      return Mac.to_hexadecimal(packet.payload.shost.addr);
  },

  manufacturer(mac) {
    let key = mac.slice(0, 8).toString().toUpperCase().split(':').join('');
    return key;
  }
};

module.exports = Mac;
