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

export interface LinkType {
  id: number;
  url: string;
  owner: string;
  created_at: string;
  updated_at: string;
  title: string;
  shortname: string;
  email: string;
  visit_count: number;
}
