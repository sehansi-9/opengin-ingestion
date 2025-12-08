export interface FormErrors {
  [key: string]: string | undefined;
}

export const ConfigRoutes = {
  // Helper functions for routes with dynamic ID (use 'new' for new configs)
  projectInfo: (id: string = 'new') => `/configuration/${id}/project-info`,
  kindInfo: (id: string = 'new') => `/configuration/${id}/kind-info`,
  relationshipInfo: (id: string = 'new') => `/configuration/${id}/relationship-info`,
  review: (id: string = 'new') => `/configuration/${id}/review`,
} as const;
