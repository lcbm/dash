package main

import (
	"net"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type Device struct {
	HardwareAddr net.HardwareAddr
	IP           net.IP
}

type Observer struct {
	iface   *net.Interface
	handle  *pcap.Handle
	packets <-chan gopacket.Packet
	dashes  map[string]bool
	clicks  chan Device
	done    chan struct{}
}

func NewObserver(iface *net.Interface) (*Observer, error) {
	if handle, err := pcap.OpenLive(iface.Name, 65535, true, pcap.BlockForever); err != nil {
		return nil, err
	} else if err := handle.SetBPFFilter("arp"); err != nil {
		return nil, err
	} else {
		packetSource := gopacket.NewPacketSource(handle, handle.LinkType())

		observer := &Observer{
			iface,
			handle,
			packetSource.Packets(),
			make(map[string]bool),
			make(chan Device),
			make(chan struct{}),
		}

		return observer, nil
	}
}

func (o *Observer) Add(dash net.HardwareAddr) {
	o.dashes[dash.String()] = true
}

func (o *Observer) Remove(dash net.HardwareAddr) {
	delete(o.dashes, dash.String())
}

func (o *Observer) Clicks() <-chan Device {
	go o.loop()
	return o.clicks
}

func (o *Observer) Close() {
	o.handle.Close()
	o.done <- struct{}{}
	<-o.done // wait
}

func (o *Observer) loop() {
	defer close(o.clicks)
	defer close(o.done)

	for {
		select {
		case packet := <-o.packets:
			arpLayer := packet.Layer(layers.LayerTypeARP)

			if arpLayer != nil {
				arp, _ := arpLayer.(*layers.ARP)

				if _, ok := o.dashes[net.HardwareAddr(arp.SourceHwAddress).String()]; arp.Operation == layers.ARPRequest && ok {
					device := Device{
						net.HardwareAddr(arp.SourceHwAddress),
						net.IP(arp.SourceProtAddress),
					}
					o.clicks <- device
				}
			}

		case <-o.done:
			return
		}
	}
}
