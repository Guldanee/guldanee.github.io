export type Lang = 'fr' | 'en' | 'tr' | 'es';

/** Texte traduit dans les 4 langues du site. */
export type Translated = Record<Lang, string>;

/** Un champ peut être identique dans toutes les langues (string) ou traduit. */
export type Text = string | Translated;

export interface Period {
  start: string; // "YYYY-MM"
  end: string;   // "YYYY-MM"
}

export interface Category {
  id: string;
  label: Translated;
}

export interface Project extends Period {
  id: string;
  title: Text;
  cats: string[];
  featured: boolean;
  personal?: boolean;
  activation: number; // 0 à 1 : lien avec le profil full-stack & IA
  stack: Text[];
  summary: Translated;
  points: Translated[];
}

export interface Experience {
  id: string;
  company: string;
  place: string;
  periods: Period[];
  role: Translated;
  summary: Translated;
  points: Translated[];
  stack: Text[];
}

export interface Education extends Period {
  id: string;
  short: Translated;
  school: string;
  degree: Translated;
  detail: Translated;
}

export interface SkillGroup {
  id: string;
  label: Translated;
  items: Text[];
}

export interface SpokenLanguage {
  name: Translated;
  level: Translated;
  score: number; // 1 à 5
}

export interface Profile {
  name: string;
  initials: string;
  email: string;
  linkedin: string;
  github: string;
  cv: string;
  availableFrom: string;
  role: Translated;
  intro: Translated;
  location: Translated;
}

export interface Content {
  profile: Profile;
  categories: Category[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  languages: SpokenLanguage[];
  interests: Translated[];
}
