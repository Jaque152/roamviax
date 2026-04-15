"use client";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (nextLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`) || `/${nextLocale}`;
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24">
        
        {/* Centered Language Selector - Editorial Style */}
        <div className="flex justify-center mb-20">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-4 bg-transparent text-foreground px-6 py-3 border border-border outline-none hover:bg-muted transition-colors rounded-none">
              <span className="text-xl leading-none">{locale === 'en' ? '🇺🇸' : '🇲🇽'}</span>
              <span className="text-sm uppercase tracking-[0.2em] font-medium">{locale === 'en' ? 'English' : 'Español'}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-[180px] bg-background rounded-none border border-border p-0 shadow-xl">
              <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer flex items-center justify-center gap-3 px-4 py-4 hover:bg-muted transition-colors rounded-none">
                <span className="text-xl leading-none">🇺🇸</span>
                <span className={`text-[10px] uppercase tracking-[0.2em] ${locale === 'en' ? "font-bold text-primary" : "font-medium text-foreground"}`}>English</span>
              </DropdownMenuItem>
              <div className="h-[1px] bg-border/50 w-full" />
              <DropdownMenuItem onClick={() => handleLanguageChange('es')} className="cursor-pointer flex items-center justify-center gap-3 px-4 py-4 hover:bg-muted transition-colors rounded-none">
                <span className="text-xl leading-none">🇲🇽</span>
                <span className={`text-[10px] uppercase tracking-[0.2em] ${locale === 'es' ? "font-bold text-primary" : "font-medium text-foreground"}`}>Español</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Footer Grid */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Brand & Payment */}
          <div className="lg:col-span-5">
            <Link href={`/${locale}/`} className="flex items-center gap-4 mb-8 group w-fit">
              {/* Isotipo R */}
              <div className="w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <img src="/logo 2.png" alt="Logo Roamviax" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-serif font-semibold tracking-tight leading-none text-foreground">roam<span className="text-primary italic">viax</span></span>
              </div>
            </Link>
            
            <p className="text-muted-foreground max-w-sm mb-12 leading-relaxed font-sans">
              <T>Elevamos el arte de viajar mediante itinerarios de lujo creados a tu medida. Descubre la verdadera esencia y sofisticación de México.</T>
            </p>

            {/* Payment Methods */}
            <div className="mb-6">
              <p className="text-sm text-background/60 mb-3"><T>Aceptamos</T></p>
              <div className="flex items-center gap-4">
                {/* VISA Logo */}
                <div className="bg-white rounded-md px-3 py-2 flex items-center justify-center h-10">
                  <svg viewBox="0 0 750 471" className="h-6 w-auto">
                    <path fill="#1A1F71" d="M278.198 334.228l33.361-195.763h53.358l-33.385 195.763h-53.334zm246.111-191.54c-10.572-3.966-27.135-8.222-47.822-8.222-52.725 0-89.865 26.551-90.18 64.604-.316 28.138 26.503 43.845 46.752 53.202 20.77 9.593 27.752 15.714 27.656 24.314-.096 13.132-16.586 19.118-31.937 19.118-21.37 0-32.691-2.97-50.225-10.277l-6.876-3.107-7.487 43.823c12.463 5.466 35.508 10.199 59.438 10.445 56.09 0 92.5-26.246 92.91-66.882.2-22.28-14.016-39.215-44.801-53.188-18.65-9.056-30.072-15.099-29.951-24.269 0-8.137 9.668-16.838 30.559-16.838 17.447-.271 30.11 3.534 39.936 7.5l4.781 2.259 7.247-42.482zm137.303-4.223h-41.23c-12.773 0-22.332 3.487-27.941 16.234l-79.245 179.402h56.031s9.16-24.121 11.233-29.418c6.123 0 60.555.084 68.336.084 1.596 6.854 6.492 29.334 6.492 29.334h49.512l-43.188-195.636zm-65.418 126.408c4.413-11.279 21.26-54.724 21.26-54.724-.316.522 4.379-11.334 7.074-18.684l3.607 16.878s10.217 46.729 12.352 56.53h-44.293zM209.59 138.465l-52.24 133.496-5.565-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767 171.204 56.455-.064 84.004-195.39h-56.523z"/>
                    <path fill="#F9A533" d="M146.92 138.465H62.54l-.683 4.073c66.938 16.204 111.232 55.337 129.618 102.415l-18.71-89.96c-3.23-12.396-12.598-16.096-25.845-16.528z"/>
                  </svg>
                </div>
                {/* Mastercard Logo */}
                <div className="bg-white rounded-md px-3 py-2 flex items-center justify-center h-10">
                  <svg viewBox="0 0 131.39 86.9" className="h-6 w-auto">
                    <circle fill="#EB001B" cx="43.45" cy="43.45" r="43.45"/>
                    <circle fill="#F79E1B" cx="87.94" cy="43.45" r="43.45"/>
                    <path fill="#FF5F00" d="M65.7 16.68a43.3 43.3 0 0 0-16.08 33.77c0 13.54 6.22 25.64 15.95 33.58a43.3 43.3 0 0 0 16.08-33.77c0-13.54-6.22-25.64-15.95-33.58z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground mb-8">
              <T>Navegación</T>
            </p>
            <ul className="space-y-4">
              <li><Link href={`/${locale}/`} className="text-sm text-foreground hover:text-primary transition-colors"><T>Inicio</T></Link></li>
              <li><Link href={`/${locale}/experiencias`} className="text-sm text-foreground hover:text-primary transition-colors"><T>Experiencias</T></Link></li>
              <li><Link href={`/${locale}/#contacto`} className="text-sm text-foreground hover:text-primary transition-colors"><T>Contacto</T></Link></li>
              <li><Link href={`/${locale}/cotizar`} className="text-sm text-foreground hover:text-primary transition-colors"><T>Cotizar</T></Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground mb-8">
              <T>Contacto</T>
            </p>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contacto@roamviax.com" className="text-sm text-foreground hover:text-primary transition-colors font-serif italic text-lg">
                  contacto@roamviax.com
                </a>
              </li>
              <li>
                <a href="tel:+525555555555" className="text-sm text-foreground hover:text-primary transition-colors">
                  +52 55 5555 5555
                </a>
              </li>
              <li className="text-sm text-foreground">Ciudad de México, México</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              © {new Date().getFullYear()} Roamviax — <T>Todos los derechos reservados</T>
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] uppercase tracking-[0.1em] font-medium">
              <Link href={`/${locale}/aviso-de-privacidad`} className="text-muted-foreground hover:text-primary transition-colors">
                <T>Privacidad</T>
              </Link>
              <Link href={`/${locale}/terminos-y-condiciones`} className="text-muted-foreground hover:text-primary transition-colors">
                <T>Términos</T>
              </Link>
              <Link href={`/${locale}/politica-de-cancelacion`} className="text-muted-foreground hover:text-primary transition-colors">
                <T>Cancelación</T>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}