export interface Person {
  id: string;
  name: string;
  folder: string;
  photoUrl: string;
}

export interface DatabaseStructure {
  days: string[];
  people: { id: string; name: string; folder: string }[];
}

export interface AdjustImagePayload {
  brightness: number;
  saturation: number;
  gamma: number;
  zoom: number;
}

export interface ShowPhotoPayload {
  photoUrl: string;
  personName: string;
}
