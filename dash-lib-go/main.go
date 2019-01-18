package main

import (
	"log"
	"net"
)

func main() {
	var config = loadConfig()

	if iface, err := net.InterfaceByName(config.Iface); err != nil {
		log.Fatal(err)
	} else if observer, err := NewObserver(iface); err != nil {
		log.Fatal(err)
	} else {
		log.Printf("Listening @ iface %v\n", iface.Name)

		for _, button := range config.Buttons {
			dash, _ := net.ParseMAC(button.Mac)
			observer.Add(dash)
		}

		defer observer.Close()
		clicks := observer.Clicks()

		go func() {
			for {
				select {
				case device, ok := <-clicks:
					if !ok {
						log.Printf("Channel was closed. Exiting goroutine")
						return
					}

					for _, button := range config.Buttons {
						if device.HardwareAddr.String() == button.Mac {
							request(button.URL, button.Data)
							break
						}
					}
				}
			}
		}()
		observer.loop()
	}
}
