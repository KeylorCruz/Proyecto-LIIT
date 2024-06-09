import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-responses-map',
  templateUrl: './view-responses-map.component.html',
  styleUrls: ['./view-responses-map.component.scss']
})
export class ViewResponsesMapComponent implements OnInit {
  private map!: L.Map;
  private markers!: L.MarkerClusterGroup;
  private formId!: string;
  public selectedAnswer: any;
  private bounds = L.latLngBounds(
    L.latLng(8.032, -87.096), // Suroeste
    L.latLng(11.217, -82.558) // Noreste
  );

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const formIdParam = this.route.snapshot.paramMap.get('formId');
    this.formId = formIdParam ? formIdParam : ''; // Manejar el caso en el que formId puede ser nulo
    this.initMap();
    this.loadAnswerLocations();
  }

  private initMap(): void {
    this.map = L.map('view-responses-map').setView([10, -84], 9);
    this.map.setMaxBounds(this.bounds);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.markers = L.markerClusterGroup();
    this.map.addLayer(this.markers);
  }

  private loadAnswerLocations(): void {
    this.http.get<any[]>(`http://localhost/api/getAnswersLocations.php?form_id=${this.formId}`)
      .subscribe(data => {
        console.log('Locations:', data); // Depuración
        data.forEach(location => {
          const marker = L.marker([location.latitude, location.longitude]);
          marker.on('click', () => {
            console.log('Marker clicked:', location.answer_id); // Depuración
            this.loadAnswerDetails(location.answer_id);
            this.map.setView([location.latitude, location.longitude], 15); // Zoom al marcador
          });
          this.markers.addLayer(marker);
        });
      }, error => {
        console.error('Error loading locations:', error); // Manejo de errores
      });
  }
  
  private loadAnswerDetails(answerId: number): void {
    if (this.selectedAnswer && this.selectedAnswer.answer_id === answerId) {
      this.selectedAnswer = null;
      setTimeout(() => {
        this.map.setView([10, -84], 9);
      }, 100);
      return;
    }
    this.http.get<{ answer_id: number, answer_date: string, answer_values: any, location: string }>(`http://localhost/api/getAnswerByAnswerId.php?answer_id=${answerId}`)
      .subscribe(data => {
        console.log('Answer details:', data); // Depuración
        this.selectedAnswer = data;
      }, error => {
        console.error('Error loading answer details:', error); // Manejo de errores
      });
  }
  
}
