import { Movie } from '@/components/SwipeDeck';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Inception',
    year: 2010,
    runtime: '2h 28m',
    rating: '8.8',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    hook: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    platforms: ['Netflix', 'Max']
  },
  {
    id: 'm2',
    title: 'Blade Runner 2049',
    year: 2017,
    runtime: '2h 44m',
    rating: '8.0',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    hook: 'A young Blade Runner unearths a long-buried secret that leads him to track down former Blade Runner Rick Deckard.',
    platforms: ['Hulu', 'Apple TV']
  },
  {
    id: 'm3',
    title: 'Interstellar',
    year: 2014,
    runtime: '2h 49m',
    rating: '8.7',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    hook: 'When Earth becomes uninhabitable, a team of astronauts travels through a wormhole in search of a new home for humanity.',
    platforms: ['Paramount+', 'Prime']
  }
];
