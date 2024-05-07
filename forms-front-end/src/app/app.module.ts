import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necesario para trabajar con formularios
import { Router, RouterModule, Routes } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

// Componentes
import { AppComponent } from './app.component';
import { AnswerComponent } from './answer/answer.component';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { LoginComponent } from './login/login.component';
import { QuestionEditorComponent } from './question-editor/question-editor.component';
import { MapComponent } from './map/map.component';	

// Servicios
import { FormService } from './services/form.service';

const appRoutes: Routes = [
    { path: 'create-form', component: FormEditorComponent },
    { path: 'answer-form', component: AnswerComponent },
    { path: 'login', component: LoginComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    FormEditorComponent,
    QuestionEditorComponent,
    MapComponent,
    AnswerComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    CommonModule, 
    FormsModule,
    RouterModule.forRoot(appRoutes),
    DragDropModule,
  ],
  exports: [RouterModule],
  providers: [
    FormService,
    MapComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
