// src/app/services/form.service.ts
import { Injectable } from '@angular/core';
import { Form } from '../models/form.model';
import { Question, AnsType } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  // Lista para almacenar los formularios
  private forms: Form[] = [];

  private lat: string = "";
  private lng: string = "";

  constructor() { }

  // Método para obtener todos los formularios
  getForms(): Form[] {
    return this.forms.slice(); // Retorna una copia de la lista para evitar manipulación directa
  }

  // Método para agregar un nuevo formulario
  addForm(form: Form): void {
    this.forms.push(form);
  }

  // Método para obtener un formulario por su ID
  getFormPerId(id: string): Form | undefined {
    return this.forms.find(f => f.id === id);
  }

  // Método para actualizar un formulario
  updateForm(id: string, updatedForm: Form): void {
    const index = this.forms.findIndex(f => f.id === id);
    if (index !== -1) {
      this.forms[index] = updatedForm;
    }
  }

  // Método para eliminar un formulario
  deleteForm(id: string): void {
    this.forms = this.forms.filter(f => f.id !== id);
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
