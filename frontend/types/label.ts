export type LabelIdentifier = {
  id: number;
};

export type Label = LabelIdentifier & {
  name: string;
  user_id: number;
  created_at: string;
  color: string;
};
