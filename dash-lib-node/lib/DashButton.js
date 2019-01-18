const pcap = require('pcap');
const stream = require('stream');
const Mac = require('../src/Mac');
const NetworkInterface = require('../src/NetworkInterface');
const Session = require('../src/Session');

const DashButton = (mac_list, iface, timeout) => {
  if (iface === undefined || iface === null)
    iface = NetworkInterface.default_iface();

  if (timeout === undefined || timeout === null)
    timeout = 5000;

  if (!Array.isArray(mac_list))
    mac_list = [mac_list];

  let just_emitted = {};
  let read_stream = new stream.Readable({ objectMode: true });
  const pcap_session = Session.create_session(iface);

  mac_list.forEach((mac) => {
    just_emitted[mac] = false;
  });

  pcap_session.on('packet', (raw_packet) => {
    let packet = pcap.decode.packet(raw_packet);

    for (let index = 0; index < mac_list.length; index++) {
      let mac = mac_list[index];

      if (mac === Mac.address(packet)) {
        if (just_emitted[mac])
          break;

        read_stream.emit('pressed', mac);
        just_emitted[mac] = true;

        setTimeout(() => { 
          just_emitted[mac] = false; 
        }, timeout);

        break;
      }
    }
  });
  
  return read_stream;
};

module.exports = DashButton;
