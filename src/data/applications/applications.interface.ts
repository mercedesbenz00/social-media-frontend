// data after manipulation

export interface IProduct {
  id: string;
  name: string;
  downloads: number;
  installed: boolean;
  ready?:boolean;
  installed_number: number;
  description?: string;
  keywords: string[];
  url: string;
  version?: string;
  created?: Date;
  updated?: Date;
  status?: string;
  thumbnail?: string;
  screenshots?: string[];
  subscription?: string;
  size?: string;
  languages?: string[];
  developer?: string;
  copyright?: string;
  isAutoupdatable?: boolean;
  rating?: number;
  preview?: string;
  images?: string[];
  icon?: string;
  votes?: number;
  usersCount?: number;
  location?: string;
  addons?: string;
  addonsText?: string;
  totalPrice?: string;
}

// data comes from server
export interface IApplication {
  icon: string;
  name: string;
  id: string;
  version: string;
  description: string;
  created: Date;
  updated: Date;
  installed: boolean;
  ready: boolean;
  installed_number: number;
  url: string;
  keywords: string[];
  images: string[];
}

export interface IApplicationResponse {
  applications: IApplication[]
  count: number;
  status: boolean
  total: number;
}
