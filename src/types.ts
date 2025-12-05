export interface FormErrors {
  [key: string]: string | undefined;
}

export const ConfigRoutes = {
  // New configuration routes
  NEW_PROJECT_INFO: '/configuration/new/project-info',
  NEW_KIND_INFO: '/configuration/new/kind-info',
  NEW_RELATIONSHIP_INFO: '/configuration/new/relationship-info',
  NEW_REVIEW: '/configuration/new/review',

  // Helper functions for edit routes with dynamic ID
  editProjectInfo: (id: string) => `/configuration/${id}/project-info`,
  editKindInfo: (id: string) => `/configuration/${id}/kind-info`,
  editRelationshipInfo: (id: string) => `/configuration/${id}/relationship-info`,
  editReview: (id: string) => `/configuration/${id}/review`,
} as const;
