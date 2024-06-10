import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necesario para trabajar con formularios
import { Router, RouterModule, Routes } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.fullscreen';

// Componentes
import { AppComponent } from './app.component';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { MapComponent } from './map/map.component';	
import { FormsListComponent } from './forms-list/forms-list.component';
import { ViewResponsesMapComponent } from './view-responses-map/view-responses-map.component';
import { LoginComponent } from './login/login.component';
import { AuthorizedMenuComponent } from './authorized-menu/authorized-menu.component';
import { NotAuthorizedMenuComponent } from './not-authorized-menu/not-authorized-menu.component';
import { AnswerComponent } from './answer/answer.component';
import { ExporterComponent } from './exporter/exporter.component';

// Servicios
import { FormService } from './services/form.service';

import { authGuard } from './auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'create-form', component: FormEditorComponent, canActivate: [authGuard] },
    { path: 'forms-list', component: FormsListComponent, canActivate: [authGuard] },
    { path: 'edit-form/:id', component: FormEditorComponent, canActivate: [authGuard] },
    { path: 'view-responses/:formId', component: ViewResponsesMapComponent, canActivate: [authGuard] },
    { path: 'answer-form', component: AnswerComponent },
    { path: 'exporter', component: ExporterComponent, canActivate: [authGuard] },
  ];

@NgModule({
  declarations: [
    AppComponent,
    FormEditorComponent,
    QuestionEditorComponent,
    MapComponent,
    FormsListComponent,
    ViewResponsesMapComponent,
    LoginComponent,
    AuthorizedMenuComponent,
    NotAuthorizedMenuComponent,
    AnswerComponent,
    ExporterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    DragDropModule,
    HttpClientModule,
  ],
  exports: [RouterModule],
  providers: [
    FormService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
