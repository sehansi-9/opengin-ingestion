export interface FormErrors {
  [key: string]: string | undefined;
}

export enum ConfigRoutes {
  PROJECT_INFO = '/configuration/project-info',
  KIND_INFO = '/configuration/kind-info',
  RELATIONSHIP_INFO = '/configuration/relationship-info',
  REVIEW_CONFIG = '/configuration/review',
}
