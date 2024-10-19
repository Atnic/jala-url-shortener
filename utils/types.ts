export interface PageTypes {
  id: string;
  link_url: string;
  user: string;
  email: string;
  profile_title: string;
  profile_bio: string;
  created_at: string;
  profile_image: string;
}

export interface LinkTypes {
  id: number;
  url: string;
  owner: string;
  created_at: string;
  updated_att: string;
  title: string;
}
