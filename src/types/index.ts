export type Prefecture = {
  prefCode: number;
  prefName: string;
};

export type PopulationLabel = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';

export type PopulationDataPoint = {
  year: number;
  value: number;
};

export type PopulationCategory = {
  label: PopulationLabel;
  data: PopulationDataPoint[];
};

export type PopulationResponse = {
  boundaryYear: number;
  data: PopulationCategory[];
};
