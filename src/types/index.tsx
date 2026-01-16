export interface News {
  id: number;
  title: string;
  description: string;
  date: string;
  image?: string;
}

export interface Official {
  id: number;
  name: string;
  position: string;
  image?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category?: string;
}