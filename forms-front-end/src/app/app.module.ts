import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necesario para trabajar con formularios
import { Router, RouterModule, Routes } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { AppComponent } from './app.component';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { MapComponent } from './map/map.component';	
import { FormsListComponent } from './forms-list/forms-list.component';
import { ViewResponsesMapComponent } from './view-responses-map/view-responses-map.component';

// Servicios
import { FormService } from './services/form.service';

const appRoutes: Routes = [
    { path: 'create-form', component: FormEditorComponent },
    { path: 'forms-list', component: FormsListComponent },
    { path: 'edit-form/:id', component: FormEditorComponent },
    { path: 'view-responses/:formId', component: ViewResponsesMapComponent },
  ];

@NgModule({
  declarations: [
    AppComponent,
    FormEditorComponent,
    QuestionEditorComponent,
    MapComponent,
    FormsListComponent,
    ViewResponsesMapComponent,
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
