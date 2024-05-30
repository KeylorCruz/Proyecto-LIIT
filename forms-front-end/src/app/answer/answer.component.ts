import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { LatLng } from 'leaflet';
import { FormService } from '../services/form.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})

export class AnswerComponent {

  forms: any[] = [];
  respuestas: { [key: string]: any } = {};

  showForm = false;
  actualCode = "";
  constructor(private formService: FormService, private http: HttpClient) { this.formService.setLatLng("", "") };

  loadForm() {
    const codigo = (document.getElementById('codigo') as HTMLInputElement).value;
    this.actualCode = codigo;
    if (codigo != "") {
      const url = 'http://localhost/getFormByID.php?form_id=' + codigo;
      let responseReceived = false;

      this.http.get<any[]>(url).subscribe(data => {
        this.forms = data;
        responseReceived = true;
      }, error => {
        console.error('Error fetching forms | ', error);
      });

      // Bucle para esperar hasta que se reciba la respuesta
      const interval = setInterval(() => {
        if (responseReceived) {
          clearInterval(interval); // Detener el bucle
          if (this.forms.length == 0) {
            alert("Introduzca un código válido.");
            console.log("Código no válido.");
          } else {
            console.log("Código válido.");
            this.showForm = true;
            this.processQuestions();
          }
        }
      }, 100);
    } else {
      alert("Introduzca un código válido.");
      console.log("Código no válido.");
    }
  }

  processQuestions() {
    let htmlPreguntas = '';

    // Agregar el título y la descripción al inicio del HTML
    htmlPreguntas += `<h1>` + this.forms[0].title + `</h1>`;
    htmlPreguntas += `<h2>` + this.forms[0].description + `</h2>`;

    // Agregar las preguntas al HTML
    for (let i = 0; i < this.forms[0].questions.length; i++) {
      htmlPreguntas += this.generateHTMLQuestion(this.forms[0].questions[i]);
    }

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
    for (let i = 0; i < this.forms[0].questions.length; i++) {
      const elemento = document.getElementById(this.forms[0].questions[i].pregunta_id);
      if (!emptyFields) {
        if (elemento) {
          switch (this.forms[0].questions[i].tipo) {
            case 'respuestaCorta':
            case 'respuestaLarga':
              const respuesta = (<HTMLInputElement>elemento).value.trim();
              if (!respuesta) {
                emptyFields = true;
                return;
              }
              this.respuestas[this.forms[0].questions[i].pregunta_id] = respuesta;
              break;

            case 'seleccionCheckbox':
              this.respuestas[this.forms[0].questions[i].pregunta_id] = [];
              document.querySelectorAll(`input[name=${this.forms[0].questions[i].pregunta_id}]:checked`).forEach((checkbox: Element) => {
                this.respuestas[this.forms[0].questions[i].pregunta_id].push((checkbox as HTMLInputElement).id);
              });
              if (this.respuestas[this.forms[0].questions[i].pregunta_id].length === 0) {
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
              this.respuestas[this.forms[0].questions[i].pregunta_id] = valorSeleccionado;
              break;
          }
        } else {
          console.error(`Elemento con id '${this.forms[0].questions[i].pregunta_id}' no encontrado`);
        }
      }
    }

    const actualLat = this.formService.getLat();
    const actualLng = this.formService.getLng();

    if (!emptyFields && actualLat != '' && actualLng != '') {
      console.log("Respuestas procesadas:", this.respuestas);
     
      fetch('http://localhost/insertAnswer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          form_id: this.actualCode,
          answer_values: this.respuestas,
          location: `POINT(${actualLat}  ${actualLng})`,
          lat: actualLat,
          lng: actualLng
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Answer inserted successfully!') {
            console.log('Answer inserted with ID:', data.answer_id);
            //this.saveFileDEBUG();

            alert("Respuestas enviadas con éxito.");
            this.showForm = false; // Se cambia el estado de showForm para solicitar otro código
            this.formService.setLatLng("", ""); // Se reinicia Lat-Lng
          } else {
            console.error('Error inserting answer:', data.message);
          }
        })
        .catch(error => {
          console.error('Error sending request:', error);
        });

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