// question.model.ts

export type AnsType = 'respuestaCorta' | 'respuestaLarga' | 'fecha' | 'seleccionCombobox' | 'seleccionCheckbox';

export class Question {
  constructor(
    public id: string,
    public questionText: string,
    public ansType: AnsType,
    public options: string[]
  ) {}
}
