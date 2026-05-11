import { redirect } from 'next/navigation';

// La raíz redirige a la página de phishing simulada
export default function Home() {
  redirect('/phishing');
}
