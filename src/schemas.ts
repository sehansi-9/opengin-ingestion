import z from 'zod';

// ============================================
// STEP 1: Project Information
// ============================================
export const stepOneSchema = z.object({
  name: z
    .string()
    .url('Please enter a valid URL including starting with https://'),
  link: z
    .string()
    .url('Please enter a valid URL including starting with https://'),
});

// ============================================
// STEP 2: Entity Types (Kinds)
// ============================================
export const minorTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const majorTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  minorTypes: z.array(minorTypeSchema),
});

export const stepTwoSchema = z.object({
  entityTypes: z.array(majorTypeSchema),
});

// ============================================
// STEP 3: Relationship Types
// ============================================
export const connectionSchema = z.object({
  id: z.string(),
  from: z.string(), // e.g., "organization.ministry"
  to: z.string(),   // e.g., "person.citizen"
  direction: z.enum(['INGOING', 'OUTGOING', 'BOTH']),
  requiresTime: z.boolean(),
});

export const relationshipSchema = z.object({
  id: z.string(),
  name: z.string(), // e.g., "AS_MINISTER"
  connections: z.array(connectionSchema),
});

export const stepThreeSchema = z.object({
  relationships: z.array(relationshipSchema),
});

// ============================================
// COMPLETE NETWORK CONFIG SCHEMA
// ============================================
export const networkConfigSchema = z.object({
  // Step 1
  name: z.string(),
  link: z.string(),

  // Step 2
  entityTypes: z.array(majorTypeSchema),

  // Step 3
  relationships: z.array(relationshipSchema),
});

// Initial values schema (all fields optional for partial saves)
export const networkConfigInitialValuesSchema = z.object({
  // Step 1
  name: z.string().optional(),
  link: z.string().optional(),

  // Step 2
  entityTypes: z.array(majorTypeSchema).optional(),

  // Step 3
  relationships: z.array(relationshipSchema).optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================
export type MinorType = z.infer<typeof minorTypeSchema>;
export type MajorType = z.infer<typeof majorTypeSchema>;
export type Connection = z.infer<typeof connectionSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type NetworkConfig = z.infer<typeof networkConfigSchema>;
export type NetworkConfigInitialValues = z.infer<typeof networkConfigInitialValuesSchema>;
