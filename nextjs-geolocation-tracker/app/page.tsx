// Homepage - redirects to /photos
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/photos');
}

