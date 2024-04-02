import { Question } from "./question.model";

// form.model.ts
export class Form {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public questions: Question[]
      ) {}
}
