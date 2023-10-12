import './globals.css'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import  Sidebar  from "@/components/sidebar"
import SupabaseProvider from '@/providers/supabaseprovider'
import UserProvider from '@/providers/userprovider'
import ModalProvider from '@/providers/modalprovider'
import ToasterProvider from '@/providers/toasterprovider'
import getSongsByUserId from '@/actions/getsongbyuserid'
import Player from '@/components/player'
import getActiveProductsWithPrices from '@/actions/getactiveproductswithzprices'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'Listen to Music',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider >
          <UserProvider>
            <ModalProvider products={products}/>
              <Sidebar songs={userSongs}>
                {children}
              </Sidebar> 
              <Player />
          </UserProvider>  
        </SupabaseProvider>   
        </body>
    </html>
  )
}
