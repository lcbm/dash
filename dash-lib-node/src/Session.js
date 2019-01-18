const pcap = require('pcap');
// const FILTER = '(arp or (udp and src port 68 and dst port 67 and udp[247:4] == 0x63350103)) and src host 0.0.0.0';
const FILTER = 'arp or ( udp and ( port 67 or port 68 ) )';

const Session = {
  create_session(iface) {
    let session;
    try {
      session = pcap.createSession(iface, FILTER);
    } catch (err) {
      console.error(err);
      throw new Error('Error: unable to create pcap session!');
    }
    return session;
  }
};

module.exports = Session;
