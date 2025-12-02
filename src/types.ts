export interface FormErrors {
  [key: string]: string | undefined;
}

export enum ConfigRoutes {
  PROJECT_INFO = '/config/add/project-info',
  KIND_INFO = '/config/add/kind-info',
  RELATIONSHIP_INFO = '/config/add/relationship-info',
  REVIEW_CONFIG = '/config/add/review',
}
