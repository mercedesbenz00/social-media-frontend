export interface IDevice {
  id: string;
  workspaceID: string;
  model: string;
  serial_number: string;
  brand_id: string;
  storage_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkspace {
  id: string;
  name: string;
  devices: IDevice[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkSpaceResponse {
  workspaces: IWorkspace[];
  count: number;
  total: number;
}
