import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { LatLng } from 'leaflet';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})

export class AnswerComponent {
  respuestas: { [key: string]: any } = {};
  showForm = false;
  actualCode = "";
  constructor(private formService: FormService) { this.formService.setLatLng("", "")};

  formJSON = [ // placeholder
    {
      "pregunta_id": "pregunta_1",
      "tipo": "respuestaCorta",
      "pregunta": "¿Cuál es tu nombre?"
    },
    {
      "pregunta_id": "pregunta_2",
      "tipo": "respuestaLarga",
      "pregunta": "¿Cuál es tu experiencia con el uso de formularios en línea?"
    },
    {
      "pregunta_id": "pregunta_3",
      "tipo": "seleccionCheckbox",
      "pregunta": "¿Qué tipo de formularios usas con más frecuencia?",
      "opciones": [
        "Formularios de contacto",
        "Formularios de encuestas",
        "Formularios de solicitud",
        "Otros"
      ]
    },
    {
      "pregunta_id": "pregunta_4",
      "tipo": "seleccionCombobox",
      "pregunta": "¿En qué dispositivo sueles completar formularios?",
      "opciones": [
        "Computadora de escritorio",
        "Laptop",
        "Tablet",
        "Teléfono inteligente"
      ]
    },
    {
      "pregunta_id": "pregunta_5",
      "tipo": "seleccionCheckbox",
      "pregunta": "¿Qué características te gustaría que tuvieran los formularios en línea?",
      "opciones": [
        "Diseño fácil de usar",
        "Carga rápida",
        "Seguridad de datos",
        "Posibilidad de guardar y reanudar",
        "Otras"
      ]
    },
    {
      "pregunta_id": "pregunta_6",
      "tipo": "respuestaLarga",
      "pregunta": "¿Cuál es tu experiencia con el uso de esta aplicación?"
    },
  ];

  loadForm() {
    const codigo = (document.getElementById('codigo') as HTMLInputElement).value;
    if (this.isValidCode(codigo)) {
      console.log("Código válido.");
      this.showForm = true;
      this.processQuestions();
    } else {
      alert("Introduzca un código válido.");
      console.log("Código no válido.");
    }
  }

  // Función isValidCode que define la lógica de validación de su código
  isValidCode(codigo: string): boolean {
    // Implementar la lógica de validación (petición a la base de datos)
    return codigo != "";
  }

  processQuestions() {
    let htmlPreguntas = '';

    // Agregar el título y la descripción al inicio del HTML
    htmlPreguntas += `<h2>Este es el título | placeholder</h2>`;
    htmlPreguntas += `<h2>Descripción | placeholder</h2>`;

    // Procesa el json y agrega las preguntas
    // Cambiar por petición a la base de datos
    this.formJSON.forEach(pregunta => {
      htmlPreguntas += this.generateHTMLQuestion(pregunta);
    });

    setTimeout(() => {
      const contenedorDatos = document.getElementById('contenedor-datos');
      if (contenedorDatos) {
        contenedorDatos.innerHTML = htmlPreguntas;
      }
    }, 0);
  }

  generateHTMLQuestion(pregunta: any) {
    let htmlPregunta = '';
    let answerGroup = 'style="border: 1px solid rgb(218, 220, 224);text-align: left;margin-bottom: 10px;background: white;padding: 10px;border-radius: 8px;"';
    let testArea = 'style="width: 100%;height: 100px;box-sizing: border-box;border: 2px solid rgb(218, 220, 224);border-radius: 6px;background-color: #f8f8f8;resize: none;"';
    let label = 'style="display: flex;margin-bottom: 8px;"';
    let input = 'style="display: block;border: none;border-bottom: 1px solid #ccc;width: 100%;box-sizing: border-box;"';
    let date = 'style="border: 2px solid rgb(218, 220, 224);padding: 8px;border-radius: 6px;"';
    let boxes = 'margin-bottom: 4px;border: 2px solid rgb(218, 220, 224);border-radius: 6px;';

    switch (pregunta.tipo) {
      case 'respuestaCorta':
        htmlPregunta += `
      <div ${answerGroup}>
        <label ${label} for="respuestaCorta">${pregunta.pregunta}</label>
        <input ${input} type="text" id="${pregunta.pregunta_id}" name="${pregunta.pregunta_id}" placeholder="Tu respuesta" maxlength="50">
      </div>`;
        break;

      case 'respuestaLarga':
        htmlPregunta += `
        <div ${answerGroup}>
          <label ${label} for="respuestaLarga">${pregunta.pregunta}</label>
          <textarea ${testArea} id="${pregunta.pregunta_id}" name="${pregunta.pregunta_id}" placeholder="Tu respuesta"  maxlength="256"></textarea>
        </div>`;
        break;

      case 'seleccionCheckbox':
        htmlPregunta += `
          <div ${answerGroup}>
          <label for="checkboxes" id="${pregunta.pregunta_id}">${pregunta.pregunta}</label>`;
        pregunta.opciones.forEach((opcion: any) => {
          htmlPregunta += `
            <div >
              <label  ${label}>
                <input ${boxes} type="checkbox" id="${opcion}" name="${pregunta.pregunta_id}"> ${opcion}
              </label>
            </div>`;
        });
        htmlPregunta += `</div>`;
        break;

      case 'seleccionCombobox':
        htmlPregunta += `
        <div ${answerGroup}>
          <label  ${label} for="combo">${pregunta.pregunta}</label>
          <select ${input} id="${pregunta.pregunta_id}">`;
        pregunta.opciones.forEach((opcion: any) => {
          htmlPregunta += `
            <option value="${opcion}">${opcion}</option>`;
        });
        htmlPregunta += `</select></div>`;
        break;
    }

    return htmlPregunta;
  }

  sendAnswers() {
    console.log("Procesando respuestas...");
    var emptyFields = false;
    this.formJSON.forEach(pregunta => {
      const elemento = document.getElementById(pregunta.pregunta_id);
      if (!emptyFields) {
        if (elemento) {
          switch (pregunta.tipo) {
            case 'respuestaCorta':
            case 'respuestaLarga':
              const respuesta = (<HTMLInputElement>elemento).value.trim();
              if (!respuesta) {
                emptyFields = true;
                return;
              }
              this.respuestas[pregunta.pregunta_id] = respuesta;
              break;

            case 'seleccionCheckbox':
              this.respuestas[pregunta.pregunta_id] = [];
              document.querySelectorAll(`input[name=${pregunta.pregunta_id}]:checked`).forEach((checkbox: Element) => {
                this.respuestas[pregunta.pregunta_id].push((checkbox as HTMLInputElement).id);
              });
              if (this.respuestas[pregunta.pregunta_id].length === 0) {
                emptyFields = true;
                return;
              }
              break;

            case 'seleccionCombobox':
              const valorSeleccionado = (<HTMLSelectElement>elemento).value;
              if (valorSeleccionado === 'undefined' || valorSeleccionado === '') {
                emptyFields = true;
                return;
              }
              this.respuestas[pregunta.pregunta_id] = valorSeleccionado;
              break;
          }
        } else {
          console.error(`Elemento con id '${pregunta.pregunta_id}' no encontrado`);
        }
      }
    });

    const actualLat = this.formService.getLat();
    const actualLng = this.formService.getLng();

    if (!emptyFields && actualLat != '' && actualLng != '') {
      this.respuestas = {
        ...this.respuestas, 
        latitud: actualLat,
        longitud: actualLng
      };
      console.log("Respuestas procesadas:", this.respuestas);

      // Llamar función para guardar el archivo, para ver el resultado como JSON
      // Cambiar por insert a la base de datos
      this.saveFileDEBUG();

      // Se cambia el estado de showForm para solicitar otro código
      // Se reinicia Lat-Lng
      alert("Respuestas enviadas con éxito.");
      this.showForm = false;
      this.formService.setLatLng("", "");
    } else {
      alert("Debe llenar todos los campos para enviar las respuestas.");
      console.log("Debe llenar todos los campos para enviar las respuestas.");
    }
  }


  saveFileDEBUG() {
    console.log("Guardando archivo con respuestas");
    const data = JSON.stringify(this.respuestas, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'respuestas.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
