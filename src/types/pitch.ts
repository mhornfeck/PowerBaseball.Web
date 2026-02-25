export type PitchLocationHorizontal = "Inside" | "Middle" | "Outside";

export type PitchLocationVertical = "High" | "Medium" | "Low";

export type PitchType = "Fastball" | "Curveball" | "Slider";

export interface PitchLocation {
  horizontal: PitchLocationHorizontal;
  vertical: PitchLocationVertical;
}