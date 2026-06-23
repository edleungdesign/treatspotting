import AppClient from '@/components/layout/AppClient';
import {fetchPricewatch} from '@/lib/pricewatch/fetch';
export default async function LocalePage() { const data = await fetchPricewatch(); return <AppClient initialProducts={data.products} initialAlerts={data.alerts} />; }
