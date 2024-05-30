// src/app/services/form.service.ts
import { Injectable } from '@angular/core';
import { Form } from '../models/form.model';
import { Question, AnsType } from '../models/question.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  // Lista para almacenar los formularios
  private forms: Form[] = [];
  private apiUrl = 'http://localhost/api';
  private lat: string = "";
  private lng: string = "";

  constructor(private http: HttpClient) { }

  // Método para obtener todos los formularios
  getForms(): Observable<Form[]> {
    return this.http.get<Form[]>(`${this.apiUrl}/getForms.php`);
  }
  saveForm(form: Form): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveForm.php`, form);
  }
  updateForm(form: Form): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateForm.php`, form);
  }

  deleteForm(form_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteForm.php`, { form_id });
  }

  getFormByIdDB(formId: string): Observable<Form> {
    return this.http.get<Form>(`${this.apiUrl}/getForm.php`, {
      params: { formId }
    });
  }

  // Método para obtener un formulario por su ID
  getFormPerId(id: string): Form | undefined {
    return this.forms.find(f => f.form_id === id);
  }

  // Agregar una pregunta a un formulario específico
  addQuestionToForm(formId: string, question: Question): void {
    const form = this.getFormPerId(formId);
    if (form) {
      form.questions.push(question);
    }
  }

  // Actualizar una pregunta específica dentro de un formulario
  updateFormQuestion(formId: string, questionId: string, updatedQuestion: Question): void {
    const form = this.getFormPerId(formId);
    if (form) {
      const index = form.questions.findIndex(p => p.id === questionId);
      if (index !== -1) {
        form.questions[index] = updatedQuestion;
      }
    }
  }

  // Eliminar una pregunta específica de un formulario
  deleteFormQuestion(formId: string, questionId: string): void {
    const form = this.getFormPerId(formId);
    if (form) {
      form.questions = form.questions.filter(p => p.id !== questionId);
    }
  }
  // Obtiene el punto actual en el mapa
  getLat(): string {
    return this.lat;
  }
  getLng(): string {
    return this.lng;
  }

  // Actualiza el punto actual en el mapa
  setLatLng(lat: string, lng: string): void {
    this.lat = lat;
    this.lng = lng;
  }
}
