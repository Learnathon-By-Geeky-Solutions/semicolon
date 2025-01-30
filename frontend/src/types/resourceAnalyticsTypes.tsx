
export type ResourceType = 'food' | 'water' | 'medicine';

export type ResourceData = {
  name: string;
  value: number;
}

export type ResourceColors = Record<ResourceType, string>;

export type ResourceLabels = Record<ResourceType, string>;

export type AreaChartData = {
  name: string;
} & Partial<Record<ResourceType, number>>;
