import { Text } from './models';

/**
 * Icône associée à une compétence, une techno ou un loisir.
 * - logo : nom d'un fichier SVG dans public/logos/ (logos Devicon, licence MIT)
 * - emoji : utilisé quand il n'existe pas de logo officiel
 *
 * La clé est le texte tel qu'écrit dans content.json (version française pour
 * les textes traduits). Pour ajouter une icône, il suffit d'ajouter une ligne.
 */
type Icon = { logo: string } | { emoji: string };

const ICONS: Record<string, Icon> = {
  // Langages
  'Java': { logo: 'java' }, 'Java 25': { logo: 'java' },
  'Python': { logo: 'python' }, 'Python Tutor': { logo: 'python' },
  'C': { logo: 'c' }, 'C++': { logo: 'cplusplus' },
  'Scala': { logo: 'scala' }, 'Haskell': { logo: 'haskell' },
  'Kotlin': { logo: 'kotlin' }, 'Bash': { logo: 'bash' },
  'TypeScript': { logo: 'typescript' }, 'JavaScript': { logo: 'javascript' },
  'HTML5': { logo: 'html5' }, 'CSS': { logo: 'css3' },
  'SQL': { emoji: '🧮' }, 'NASM x86-64': { emoji: '⚙️' },

  // Frameworks & outils web
  'Angular': { logo: 'angular' }, 'Angular 20': { logo: 'angular' },
  'Vue.js 3': { logo: 'vuejs' }, 'Tailwind CSS': { logo: 'tailwindcss' },
  'Quarkus': { logo: 'quarkus' }, 'Flask': { logo: 'flask' },
  'Streamlit': { logo: 'streamlit' }, 'TaiPy': { emoji: '🖥️' },
  'Android': { logo: 'android' }, 'Signals': { emoji: '⚡' },
  'Canvas': { emoji: '🎨' }, 'SVG': { emoji: '✏️' },
  'API REST': { emoji: '🔌' }, 'OpenAPI': { logo: 'openapi' }, 'Swagger UI': { logo: 'swagger' },
  'Design patterns': { emoji: '🧩' }, 'Systèmes distribués': { emoji: '🌐' },

  // IA & data
  'Machine learning': { emoji: '🤖' }, 'Deep learning': { emoji: '🧠' },
  'IA générative': { emoji: '✨' }, 'llama.cpp': { emoji: '🦙' }, 'Qwen3': { emoji: '💬' },
  'GPU NVIDIA': { emoji: '🚀' },
  'scikit-learn': { logo: 'scikitlearn' }, 'pandas': { logo: 'pandas' },
  'NumPy': { logo: 'numpy' }, 'TensorFlow': { logo: 'tensorflow' },
  'Matplotlib': { logo: 'matplotlib' }, 'Jupyter': { logo: 'jupyter' },

  // Bases de données
  'PostgreSQL': { logo: 'postgresql' }, 'psycopg2': { logo: 'postgresql' },
  'SQLite': { logo: 'sqlite' }, 'MongoDB': { logo: 'mongodb' },
  'Neo4j': { logo: 'neo4j' }, 'Cypher': { emoji: '🕸️' }, 'H2': { emoji: '🗄️' }, 'JPA': { emoji: '🗃️' },
  'NoSQL': { emoji: '📦' },

  // Qualité & DevOps
  'JUnit 5': { logo: 'junit' }, 'SpotBugs': { emoji: '🐞' },
  'Git': { logo: 'git' }, 'GitLab': { logo: 'gitlab' }, 'Maven': { logo: 'maven' },
  'Docker': { logo: 'docker' }, 'Kubernetes': { logo: 'kubernetes' },
  'Jenkins': { logo: 'jenkins' }, 'CI/CD': { emoji: '🔁' }, 'Scrum': { emoji: '📋' },
  'GitHub Actions': { logo: 'github' }, 'GitHub Pages': { logo: 'github' },
  'Makefile': { emoji: '🛠️' }, 'Valgrind': { emoji: '🔍' },

  // Systèmes, réseau, sécurité
  'Linux': { logo: 'linux' }, 'TCP/IP': { emoji: '🛰️' }, 'Sockets TCP': { emoji: '📡' },
  'IPv4 / IPv6': { emoji: '🌍' }, 'Wireshark': { emoji: '🦈' },
  'RSA / OAEP': { emoji: '🔐' }, 'RSA 2048 (OAEP)': { emoji: '🔐' }, 'SHA-512': { emoji: '🔑' },
  'Programmation concurrente': { emoji: '🔀' }, 'Threads virtuels': { emoji: '🧵' }, 'IoT': { emoji: '📶' },
  'Flex': { emoji: '🔤' }, 'Bison': { emoji: '🦬' },
  'libMLV': { emoji: '🎮' }, 'FLTK': { emoji: '🎨' },

  // Loisirs
  'Lecture': { emoji: '📚' }, 'Musique': { emoji: '🎵' }, 'Podcasts': { emoji: '🎧' },
  'Randonnée': { emoji: '🥾' }, 'Marche rapide': { emoji: '🚶‍♀️' },
  'Natation': { emoji: '🏊‍♀️' }, 'Volley-ball féminin (FIVB)': { emoji: '🏐' },
};

export interface ResolvedIcon { src?: string; name?: string; emoji?: string; }

export function iconFor(value: Text): ResolvedIcon {
  const key = typeof value === 'string' ? value : value.fr;
  const icon = ICONS[key];
  if (!icon) return {};
  return 'logo' in icon ? { src: `logos/${icon.logo}.svg`, name: icon.logo } : { emoji: icon.emoji };
}
