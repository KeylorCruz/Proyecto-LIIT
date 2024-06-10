import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrl: './exporter.component.scss'
})

export class ExporterComponent {
  answers: any[] = [];
  constructor(private http: HttpClient) { };

  createJSON_ByID() {
    const codigo = (document.getElementById('codigo') as HTMLInputElement).value;
    if (codigo != "") {
      const url = 'http://158.23.137.77/apiS3/getAnswersByFormID.php?form_id=' + codigo;
      let responseReceived = false;

      this.http.get<any[]>(url).subscribe(data => {
        this.answers = data;
        responseReceived = true;
      }, error => {
        console.error('Error fetching answers | ', error);
      });

      // Bucle para esperar hasta que se reciba la respuesta
      const interval = setInterval(() => {
        if (responseReceived) {
          clearInterval(interval); // Detener el bucle
          if (this.answers.length == 0) {
            alert("Introduzca un código válido.");
            console.log("Código no válido.");
          } else {
            console.log("Código válido.");
            this.saveFileJSON();
          }
        }
      }, 100);
    } else {
      alert("Introduzca un código válido.");
      console.log("Código no válido.");
    }
  }

  saveFileJSON() {
    console.log("Guardando archivo con respuestas");
    const data = JSON.stringify(this.answers, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'respuestas_' + Date.now() + '.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  createJSON() {
    const url = 'http://158.23.137.77/apiS3/getAnswers.php';
    let responseReceived = false;

    this.http.get<any[]>(url).subscribe(data => {
      this.answers = data;
      responseReceived = true;
    }, error => {
      console.error('Error fetching answers | ', error);
    });

    // Bucle para esperar hasta que se reciba la respuesta
    const interval = setInterval(() => {
      if (responseReceived) {
        clearInterval(interval); // Detener el bucle
        console.log("Código válido.");
        console.log(this.answers);
        this.saveFileJSON();
      }
    }, 100);
  }
}
