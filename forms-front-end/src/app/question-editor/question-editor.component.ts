import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss']
})
export class QuestionEditorComponent {
  @Input() question: Question = new Question(
    'default-id',
    'Escribe tu pregunta aquí',
    'respuestaCorta',
    []
  );
  @Input() isCreating: boolean = false;
  @Output() deleteQuestion = new EventEmitter<void>();

  constructor() { }

  updatePreview() {
    // Verifica el tipo de respuesta actual y realiza acciones según sea necesario
    if (this.question.ansType === 'seleccionCombobox' || this.question.ansType === 'seleccionCheckbox') {
      // Si el tipo de respuesta requiere opciones, se asegura de que
      // al menos exista una opción vacía por defecto si aún no hay ninguna.
      if (this.question.options.length === 0) {
        this.question.options.push('');
      }
    } else {
      // Para tipos de respuesta que no usan el array de opciones, se limpia.
      this.question.options = [];
    }
  }

  addOption(): void {
    this.question.options.push('');
  }

  removeOption(index: number): void {
    this.question.options.splice(index, 1);
  }
  trackByFn(index: any, item: any) {
    return index;
  }

  delete(): void {
    this.deleteQuestion.emit();
  }
}
