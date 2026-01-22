import type { Facility, SchoolCategory } from '../types/infografis';

export const categorizeSchools = (schools: Facility[]): SchoolCategory[] => {
  const categories: SchoolCategory[] = [
    {
      name: 'Pendidikan Anak Usia Dini (PAUD)',
      prefixes: ['KB', 'RA', 'TK'],
      schools: []
    },
    {
      name: 'Pendidikan Dasar',
      prefixes: ['MI', 'SD', 'UPTD SD'],
      schools: []
    },
    {
      name: 'Pendidikan Menengah Pertama',
      prefixes: ['MTs', 'SMP'],
      schools: []
    },
    {
      name: 'Pendidikan Menengah Atas',
      prefixes: ['MA', 'SMA'],
      schools: []
    }
  ];

  schools.forEach(school => {
    for (const category of categories) {
      const matchingPrefix = category.prefixes.find(prefix => 
        school.nama_fasilitas.toUpperCase().startsWith(prefix.toUpperCase())
      );
      if (matchingPrefix) {
        category.schools.push(school);
        break;
      }
    }
  });

  return categories;
};
