import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necesario para trabajar con formularios
import { Router, RouterModule, Routes } from '@angular/router';

// Componentes
import { AppComponent } from './app.component';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { MapComponent } from './map/map.component';	

// Servicios
import { FormService } from './services/form.service';

const appRoutes: Routes = [
    { path: 'create-form', component: FormEditorComponent },
  ];

@NgModule({
  declarations: [
    AppComponent,
    FormEditorComponent,
    QuestionEditorComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  exports: [RouterModule],
  providers: [
    FormService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
