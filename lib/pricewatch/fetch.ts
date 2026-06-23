import type {PricewatchResponse} from '@/types/pricewatch';
import {getMockPricewatch} from '@/lib/pricewatch/mock';
export async function fetchPricewatch(): Promise<PricewatchResponse> { return getMockPricewatch(); }
