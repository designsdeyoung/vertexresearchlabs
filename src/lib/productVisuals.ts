/** Soft clinical gradient pairs for product image zones — deterministic per
 *  category so a compound family always reads with the same tint. These act
 *  as styled placeholders until dedicated product photography lands. */
const GRADIENTS = [
  "linear-gradient(150deg, #DDE8F4 0%, #C3D6EA 100%)", // mist blue
  "linear-gradient(150deg, #E2EDE4 0%, #C6DCCB 100%)", // sage
  "linear-gradient(150deg, #F6E7D8 0%, #EDD2B6 100%)", // warm sand
  "linear-gradient(150deg, #E9E4F2 0%, #D4CBE8 100%)", // lilac
  "linear-gradient(150deg, #DFEDEC 0%, #C2DDDA 100%)", // seafoam
  "linear-gradient(150deg, #F2E4E0 0%, #E7CCC4 100%)", // clay
] as const;

export const productGradient = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};
