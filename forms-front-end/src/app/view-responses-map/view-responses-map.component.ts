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

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const formIdParam = this.route.snapshot.paramMap.get('formId');
    this.formId = formIdParam ? formIdParam : ''; // Manejar el caso en el que formId puede ser nulo
    this.initMap();
    this.loadAnswerLocations();
  }

  private initMap(): void {
    this.map = L.map('view-responses-map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.markers = L.markerClusterGroup();
    this.map.addLayer(this.markers);
  }

  private loadAnswerLocations(): void {
    this.http.get<any[]>(`http://localhost/api/getAnswersLocations.php?form_id=${this.formId}`)
      .subscribe(data => {
        data.forEach(location => {
          const marker = L.marker([location.latitude, location.longitude]);
          marker.on('click', () => this.loadAnswerDetails(location.answer_id));
          this.markers.addLayer(marker);
        });
      });
  }

  private loadAnswerDetails(answerId: number): void {
    this.http.get<{ answer_id: number, answer_date: string, answer_values: any, location: string }>(`http://localhost/api/getAnswerByAnswerId.php?answer_id=${answerId}`)
      .subscribe(data => {
        this.selectedAnswer = data;
      });
  }
}
