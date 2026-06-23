import clsx from 'clsx';
import type {StoreName} from '@/types/pricewatch';
const labelMap: Record<StoreName, string> = {WELLCOME:'Wellcome',PARKNSHOP:'PARKnSHOP',TASTE:'Taste',AEON:'AEON',HKTVMALL:'HKTVmall'};
export default function StorePill({store, active = false}: {store: StoreName; active?: boolean}) { return <span className={clsx('pw-store-pill', active && 'is-active')}>{labelMap[store]}</span>; }
