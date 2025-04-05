import { Navbar } from '@/widgets/navbar';
import { Outlet } from 'react-router';

export function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
