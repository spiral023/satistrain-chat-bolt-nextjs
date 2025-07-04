import { CustomerProfile } from '@/types';

export const customerProfiles: CustomerProfile[] = [
  {
    name: 'Anna Müller',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'frustrated',
    difficulty: 3,
    issue: 'Kunde meldet Produktdefekt nach kurzer Nutzungsdauer und erwartet schnelle Lösung.',
    background: 'Berufstätige Mutter, wenig Zeit, erwartet schnelle Lösung',
  },
  {
    name: 'Thomas Weber',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'angry',
    difficulty: 4,
    issue: 'Kunde hat falsche Rechnung erhalten und fordert sofortige Klärung der Situation.',
    background: 'Geschäftsmann, sehr direkt, fordert sofortige Klärung',
  },
  {
    name: 'Lisa Schmidt',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'neutral',
    difficulty: 2,
    issue: 'Kunde hat Fragen zur Produktanwendung und möchte alle Details verstehen.',
    background: 'Studentin, technikaffin, möchte alles verstehen',
  },
  {
    name: 'Michael Klein',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'happy',
    difficulty: 1,
    issue: 'Kunde lobt Produkt und hat Zusatzfragen zu weiteren Angeboten.',
    background: 'Zufriedener Kunde, möchte mehr über weitere Produkte erfahren',
  },
  {
    name: 'Sarah Hoffmann',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'frustrated',
    difficulty: 5,
    issue: 'Kunde hat mehrfache Probleme mit dem Service und überlegt Kündigung.',
    background: 'Langjährige Kundin, sehr unzufrieden, überlegt Kündigung',
  },
  {
    name: 'David Wagner',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'neutral',
    difficulty: 3,
    issue: 'Kunde hat Unklarheiten bei Vertragsverlängerung und neuen Tarifoptionen, benötigt Erklärung.',
    background: 'Treuer Kunde, möchte aber sicherstellen, dass er den besten Tarif hat und versteht die neuen Optionen nicht vollständig.',
  },
  {
    name: 'Julia Richter',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'frustrated',
    difficulty: 4,
    issue: 'Kunde hat technische Schwierigkeiten beim Online-Banking und kann keine Überweisungen tätigen.',
    background: 'Ältere Dame, nicht sehr technikaffin, ist besorgt um ihre Finanzen und benötigt geduldige Unterstützung.',
  },
  {
    name: 'Max Schulz',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'angry',
    difficulty: 3,
    issue: 'Kunde meldet Lieferverzögerung bei dringender Bestellung und benötigt Produkt dringend.',
    background: 'Selbstständiger Handwerker, ist auf pünktliche Lieferungen angewiesen und verliert durch die Verzögerung Geld.',
  },
  {
    name: 'Lena Fischer',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'neutral',
    difficulty: 2,
    issue: 'Kunde möchte Details zu Smart-Home-Integration und Kompatibilität mit Geräten.',
    background: 'Technikbegeisterte, die ihr Zuhause automatisieren möchte und spezifische technische Fragen hat.',
  },
  {
    name: 'Paul Neumann',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mood: 'frustrated',
    difficulty: 4,
    issue: 'Kunde zweifelt an Produktwirksamkeit und fordert wissenschaftliche Belege für Vorteile.',
    background: 'Wissenschaftler, der nur Fakten akzeptiert und eine detaillierte Erklärung der Produktvorteile benötigt.',
  },
];

export function getRandomCustomerProfile(): CustomerProfile {
  return customerProfiles[Math.floor(Math.random() * customerProfiles.length)];
}
