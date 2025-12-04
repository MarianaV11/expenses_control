import { StatusPage } from "./general";

export type LabelIdentifier = {
  id: number;
};

export type Label = LabelIdentifier & {
  name: string;
  user_id: number;
  created_at: string;
  color: string;
};

export type Labels = StatusPage & {
  total_labels: number;
  labels: Label[];
};

export type LabelCreate = {
  name: string;
  color: string;
  user_id: number;
};

export type LabelUpdate = {
  name: string;
  color: string;
  id: number;
};
