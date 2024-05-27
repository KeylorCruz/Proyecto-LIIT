import { Component, OnInit } from '@angular/core';
import { FormService } from '../services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '../models/form.model';
import { Question } from '../models/question.model';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  form: Form = new Form('', '', '', []);
  private idCounter = 0;

  constructor(
    private formService: FormService,
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  ngOnInit(): void {
    const formId = this.route.snapshot.paramMap.get('id');
    if (formId) {
      // Cargar los datos del formulario usando formId si existe
      this.formService.getFormByIdDB(formId).subscribe(data => {
        this.form = data;
        this.form.form_id = formId;
        console.log("Cargado formulario ", this.form.form_id);
      });
      
    }
  }

  generateSequentialId(): number {
    return this.idCounter++;
  }

  addQuestion(): void {
    const newQuestion = new Question(this.generateSequentialId().toString(), '', 'respuestaCorta', []);
    this.form.questions.push(newQuestion);
  }
    // Función para eliminar una pregunta por su índice
  removeQuestion(index: number): void {
    this.form.questions.splice(index, 1);
  }

  isFormValid(): boolean {
    // Verificar que el título y la descripción no estén vacíos
    if (!this.form.title.trim() || !this.form.description.trim()) {
      return false;
    }

    // Verificar cada pregunta
    for (const question of this.form.questions) {
      if (!question.questionText.trim()) {
        // Si el texto de la pregunta está vacío, el formulario no es válido
        return false;
      }
      
      // Si es una pregunta de selección, verifica que cada opción tenga texto
      if ((question.ansType === 'seleccionCombobox' || question.ansType === 'seleccionCheckbox') && question.options) {
        for (const option of question.options) {
          if (!option.trim()) {
            // Si alguna opción está vacía, el formulario no es válido
            return false;
          }
        }
      }
    }

    // Si todas las validaciones anteriores pasan, el formulario es válido
    return true;
  }

  saveForm(): void {
    // Validar el formulario antes de guardarlo
    if (this.isFormValid()) {
      // El formulario es válido, procede a guardarlo
      this.formService.saveForm(this.form).subscribe({
        next: (response) => {
          console.log('Formulario guardado', response);
          alert('Formulario guardado con éxito!');
          this.router.navigate(['/forms-list']); // Redirigir a la lista de formularios
        },
        error: (error) => {
          console.error('Error al guardar el formulario:', error);
        }
      });
    } else {
      // El formulario no es válido, mostrar un mensaje al usuario
      alert('Por favor, complete todos los campos antes de guardar.');
    }
  }
  saveChanges():void {
    // Validar el formulario antes de guardarlo
    if (this.isFormValid()) {
      // El formulario es válido, procede a guardarlo
      console.log(this.form.form_id);
      this.formService.updateForm(this.form).subscribe({
        next: (response) => {
          console.log('Formulario actualizado', response);
          alert('Formulario actualizado con éxito!');
          this.router.navigate(['/forms-list']); // Redirigir a la lista de formularios
        },
        error: (error) => {
          console.error('Error al actualizar el formulario:', error);
        }
      });
    } else {
      // El formulario no es válido, mostrar un mensaje al usuario
      alert('Por favor, complete todos los campos antes de guardar.');
    }
  }
  deleteForm():void {
    if (confirm('¿Está seguro de que desea eliminar este formulario?')) {
      console.log("Id del form:",this.form.form_id);
      this.formService.deleteForm(this.form.form_id).subscribe({
        next: (response) => {
          console.log('Formulario eliminado', response);
          alert('Formulario eliminado con éxito!');
          this.router.navigate(['/forms-list']); // Redirigir a la lista de formularios
        },
        error: (error) => {
          console.error('Error al eliminar el formulario:', error);
        }
      });
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.form.questions, event.previousIndex, event.currentIndex);
  }
}
