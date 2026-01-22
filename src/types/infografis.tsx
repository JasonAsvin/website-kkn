export interface PopulationData {
  jumlah_penduduk: number;
  penduduk_perempuan: number;
  penduduk_lakilaki: number;
}

export interface AgeStat {
  rentang_umur: string;
  penduduk: number;
}

export interface WilayahTotal {
  total_lingkungan: number;
  total_rw: number;
  total_rt: number;
}

export interface Lingkungan {
  id?: string;
  nama_lingkungan: string;
}

export interface RW {
  id?: string;
  nama_rw: string;
  nama_lingkungan: string;
}

export interface RT {
  id?: string;
  nama_rt: string;
  nama_rw: string;
  nama_lingkungan: string;
}

export interface Facility {
  id?: string;
  nama_fasilitas: string;
  alamat: string;
  lingkungan: string;
  kategori: string;
}

export interface SchoolCategory {
  name: string;
  prefixes: string[];
  schools: Facility[];
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
}