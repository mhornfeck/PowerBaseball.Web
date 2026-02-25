export type PlayerLine = {
  jerseyNumber: number;
  name: string;
  hits: number;
  atBats: number;
};

export type AtBatResultType = 'Out' | 'Single' | 'Double' | 'Triple' | 'Homerun';