import data from '../data/content.json';
import { Content } from './models';

/**
 * Tout le contenu du portfolio vit dans src/app/data/content.json.
 * Pour ajouter un projet ou modifier un texte, il suffit d'éditer ce fichier.
 */
export const CONTENT = data as unknown as Content;
