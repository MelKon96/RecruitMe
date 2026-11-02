export const DEV_LEVELS = ['Junior', 'Middle', 'Senior', 'Lead'] as const;

export type DevLevel = (typeof DEV_LEVELS)[number];
