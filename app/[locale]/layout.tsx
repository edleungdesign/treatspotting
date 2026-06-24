import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams.locale;

  if (!routing.locales.includes(rawLocale as any)) {
    notFound();
  }

  const validLocale = rawLocale as (typeof routing.locales)[number];

  setRequestLocale(validLocale);
  const messages = await getMessages();

  return (
    <html lang={validLocale} className="h-full">
      <body className="h-full bg-slate-50 dark:bg-slate-950 transition-colors" suppressHydrationWarning>
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
