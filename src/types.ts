export interface Friend {
  id: string;
  name: string;
  school: string;
  province: string;
  remark: string;
  contact?: string;
  avatarColor?: string;
  createdAt: number;
}

export interface ProvinceInfo {
  name: string; // Standard name e.g. "浙江"
  fullName: string; // Full name e.g. "浙江省"
  code?: string;
  friendsCount: number;
  friends: Friend[];
  universitiesCount: number;
}

export type MapThemeId = 'emerald' | 'tech' | 'warm' | 'ink';

export interface MapThemeConfig {
  id: MapThemeId;
  name: string;
  bg: string;
  borderColor: string;
  areaColor: string;
  hoverColor: string;
  selectedColor: string;
  colorRange: [string, string];
  textColor: string;
}

export interface ExcelImportResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  errors: string[];
  friends: Friend[];
}
