import { PROJECT_STATUS } from '../enum/PROJECT_STATUS.js';

export { PROJECT_STATUS };

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: PROJECT_STATUS,
  ) {}
}
