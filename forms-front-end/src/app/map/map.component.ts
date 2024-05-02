import { Component, AfterViewInit } from '@angular/core';
import { latLng, latLngBounds, Map, marker, Marker, tileLayer } from 'leaflet';
import { LatLng } from 'leaflet';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!: Map;
  private bounds = latLngBounds(
    latLng(8.032, -87.096), // Suroeste
    latLng(11.217, -82.558) // Noreste
  );

  constructor(private formService: FormService) { }

  ngAfterViewInit(): void {
    this.map = new Map('map').setView([10, -84], 7);
    this.map.setMaxBounds(this.bounds);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e) => {
      const latlng = e.latlng;

      // Verifica si el punto clickeado está dentro de los límites permitidos
      if (this.bounds.contains(latlng)) {
        // Elimina marcadores existentes
        this.map.eachLayer((layer) => {
          if (layer instanceof Marker) {
            this.map.removeLayer(layer);
          }
        });

        // Añade el marcador al mapa
        marker(latlng).addTo(this.map).bindPopup(`${latlng.lat}, ${latlng.lng}`).openPopup();
        this.formService.setLatLng(`${latlng.lat}`, `${latlng.lng}`);
      }
    });
  }

  // Retorna la posición actual del usuarios
  private getCurrentMarkerLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLatLng = latLng(position.coords.latitude, position.coords.longitude);

        // Check if current location is within bounds before adding marker
        if (this.bounds.contains(currentLatLng)) {
          marker(currentLatLng).addTo(this.map).bindPopup('Current Location').openPopup();
        } else {
          console.warn('Current location outside map bounds');
        }
      }, (error) => {
        console.error('Error getting geolocation:', error);
      });
    } else {
      console.warn('Geolocation is not supported by this browser');
    }
  }
}
