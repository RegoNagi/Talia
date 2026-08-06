import { BookOpen, Calculator, FlaskConical, Atom, Languages, Globe, Landmark, Palette, Music, Dumbbell, Code, Microscope, PenTool, Compass, GraduationCap, LucideIcon } from 'lucide-react';

export const SUBJECT_COLOR_OPTIONS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
  'bg-teal-500', 'bg-orange-500', 'bg-lime-500', 'bg-purple-500',
];

export const SUBJECT_ICON_OPTIONS = [
  'book-open', 'calculator', 'flask-conical', 'atom', 'languages',
  'globe', 'landmark', 'palette', 'music', 'dumbbell', 'code',
  'microscope', 'pen-tool', 'compass', 'graduation-cap',
];

const ICON_MAP: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'calculator': Calculator,
  'flask-conical': FlaskConical,
  'atom': Atom,
  'languages': Languages,
  'globe': Globe,
  'landmark': Landmark,
  'palette': Palette,
  'music': Music,
  'dumbbell': Dumbbell,
  'code': Code,
  'microscope': Microscope,
  'pen-tool': PenTool,
  'compass': Compass,
  'graduation-cap': GraduationCap,
};

export function getSubjectIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || BookOpen;
}
