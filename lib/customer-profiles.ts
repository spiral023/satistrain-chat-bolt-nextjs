import { CustomerProfile } from '@/types';

export const customerProfiles: CustomerProfile[] = [
  {
    name: 'Anna Müller',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'frustrated',
    difficulty: 3,
    issue: 'Produktdefekt nach 2 Wochen',
    background: 'Berufstätige Mutter, wenig Zeit, erwartet schnelle Lösung',
  },
  {
    name: 'Thomas Weber',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'angry',
    difficulty: 4,
    issue: 'Falsche Rechnung erhalten',
    background: 'Geschäftsmann, sehr direkt, fordert sofortige Klärung',
  },
  {
    name: 'Lisa Schmidt',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'neutral',
    difficulty: 2,
    issue: 'Frage zur Produktanwendung',
    background: 'Studentin, technikaffin, möchte alles verstehen',
  },
  {
    name: 'Michael Klein',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'happy',
    difficulty: 1,
    issue: 'Lob und Zusatzfragen',
    background: 'Zufriedener Kunde, möchte mehr über weitere Produkte erfahren',
  },
  {
    name: 'Sarah Hoffmann',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'frustrated',
    difficulty: 5,
    issue: 'Mehrfache Probleme mit Service',
    background: 'Langjährige Kundin, sehr unzufrieden, überlegt Kündigung',
  },
];

export function getRandomCustomerProfile(): CustomerProfile {
  return customerProfiles[Math.floor(Math.random() * customerProfiles.length)];
}