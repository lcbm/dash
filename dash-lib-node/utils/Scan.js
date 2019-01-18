const pcap = require('pcap');
const Mac = require('../src/Mac');
const NetworkInterface = require('../src/NetworkInterface');
const Session = require('../src/Session');

const AmazonDevices = ['F0D2F1', '8871E5', 'FCA183', 'CCF735', '1C12B0', 
  '244CE3', '38F73D', '50DCE7', 'F0272D', '74C246', '6837E9', '78E103', 
  'C49500', '440049', '3C5CC4', '08A6BC', 'A002DC', '0C47C9', '747548',
  'AC63BE', 'FCA667', '18742E', '00FC8B', 'FC65DE', '6C5697', '689A87', 
  '44650D', '50F5DA', '6854FD', '40B4CD', '4CEFC0', '007147', 'CC9EA2', 
  'F08173', '84D6D0', '34D270', 'B47C9C', 'B0FC0D', '00BB3A', '7C6166'
];

const iface = NetworkInterface.default_iface();
const pcap_session = Session.create_session(iface);

console.log('Scanning for Amazon Technologies Inc. hardware DHCP requests and ARP probes on %s...', iface);
pcap_session.on('packet', (raw_packet) => {
  let packet = pcap.decode(raw_packet);
  let hardware = Mac.address(packet);

  if (AmazonDevices.indexOf(Mac.manufacturer(hardware)) > -1)
    console.log('Hardware detected: %s', hardware);
});
