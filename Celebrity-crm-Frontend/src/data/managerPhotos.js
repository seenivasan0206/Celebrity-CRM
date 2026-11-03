import photo1 from '../assets/managers/1.jpg';
import photo2 from '../assets/managers/2.jpg';
import photo3 from '../assets/managers/3.jpg';
import photo4 from '../assets/managers/4.jpg';
import photo5 from '../assets/managers/5.jpg';
import photo6 from '../assets/managers/6.jpg';
import photo7 from '../assets/managers/7.jpg';
import photo8 from '../assets/managers/8.jpg';
import photo9 from '../assets/managers/9.jpg';
import photo10 from '../assets/managers/10.jpg';
import photo11 from '../assets/managers/11.jpg';
import photo12 from '../assets/managers/12.jpg';
import photo13 from '../assets/managers/13.jpg';
import photo14 from '../assets/managers/14.jpg';

export const MANAGER_PHOTOS_MAP = {
  1: photo1,
  2: photo2,
  3: photo3,
  4: photo4,
  5: photo5,
  6: photo6,
  7: photo7,
  8: photo8,
  9: photo9,
  10: photo10,
  11: photo11,
  12: photo12,
  13: photo13,
  14: photo14,
  'john doe': photo1,
  'sarah jenkins': photo2,
  'vikram rathore': photo3,
  'priya sunder': photo4,
  'arjun verma': photo5,
  'ananya sen': photo6,
  'rohan mehta': photo7,
  'meera nambiar': photo8,
  'kavita krishnan': photo9,
  'devendra singhania': photo10,
  'tara alagappan': photo11,
  'karthik sundaram': photo12,
  'rhea chawla': photo13,
  'siddharth roy': photo14
};

export const getManagerPhoto = (idOrName) => {
  if (!idOrName) return photo1;
  if (MANAGER_PHOTOS_MAP[idOrName]) return MANAGER_PHOTOS_MAP[idOrName];
  const key = String(idOrName).toLowerCase().trim();
  if (MANAGER_PHOTOS_MAP[key]) return MANAGER_PHOTOS_MAP[key];
  return photo1;
};

export const resolveManagerPhoto = (mgr) => {
  if (mgr?.photo && (mgr.photo.startsWith('data:') || mgr.photo.startsWith('blob:') || mgr.photo.startsWith('http') || mgr.photo.startsWith('/images/'))) {
    return mgr.photo;
  }
  if (mgr?.id && MANAGER_PHOTOS_MAP[mgr.id]) {
    return MANAGER_PHOTOS_MAP[mgr.id];
  }
  const nameKey = (mgr?.name || '').toLowerCase().trim();
  if (MANAGER_PHOTOS_MAP[nameKey]) {
    return MANAGER_PHOTOS_MAP[nameKey];
  }
  return getManagerPhoto(mgr?.id || 1);
};
