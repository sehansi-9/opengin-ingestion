export interface FormErrors {
  [key: string]: string | undefined;
}

export enum ConfigRoutes {
  PROJECT_INFO = '/add/project-info',
  KIND_INFO = '/add/kind-info',
  RELATIONSHIP_INFO = '/add/relationship-info',
  REVIEW_CONFIG = '/add/review',
}
