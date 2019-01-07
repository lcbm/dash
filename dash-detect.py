from scapy.all import *
import requests
import time

MAC_ADDRESS = '78:e1:03:60:59:3b' # enter Dash Button's MAC Address here.
MAGIC_FORM_URL = 'http://api.cloudstitch.com/lcbm/knot-dash-button'

def record_request(site, room):
  data = {
    "Timestamp": time.strftime("%Y-%m-%d %H:%M"), 
    "Site": site,
    "Room": room
  }
  requests.post(MAGIC_FORM_URL, data)

def arp_display(pkt):
  timestamp = time.strftime("%Y-%m-%d %H:%M")
  if pkt[ARP].op == 1: #who-has (request)
    if pkt[ARP].hwsrc == MAC_ADDRESS: # Huggies        
      print("School Sala 01")
      record_request('CESAR School',1)
    else:
      print(("Unknown device SHA: {} ~ SPA: {}").format(pkt[ARP].hwsrc, pkt[ARP].psrc))

print(sniff(prn=arp_display, filter="arp", store=0, count=10))
