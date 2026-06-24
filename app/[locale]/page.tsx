import { fetchPricewatch } from '@/lib/pricewatch/fetch';
import AppClient from '@/components/layout/AppClient';

export default async function LocalePage() {
  const { products, alerts } = await fetchPricewatch();
  
  // fromLive detection: if fetchFoodAlerts returned live data, alerts[0].id won't start with "alert-"
  const fromLive = alerts.length > 0 && !alerts[0].id.startsWith('alert-');

  return (
    <AppClient
      initialProducts={products}
      initialAlerts={alerts}
      fromLive={fromLive}
    />
  );
}
