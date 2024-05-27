import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from '../services/form.service';
import { Form } from '../models/form.model';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {
  forms: Form[] = [];

  constructor(
    private formService: FormService,
    public router: Router
  ) { }

  ngOnInit() {
    this.formService.getForms().subscribe({
      next: (data) => {
        this.forms = data;
      },
      error: (error) => {
        console.error('Error al obtener los formularios:', error);
      },
      complete: () => {
        console.log('Operación de obtención de formularios completada');
      }
    });
  }

  editForm(formId: string) {
    this.router.navigate(['/edit-form', formId]);
  }
}

