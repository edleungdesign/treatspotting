'use client';
export default function Drawer({open, children}:{open:boolean;children:React.ReactNode}){ return <div className={`pw-drawer ${open ? 'is-open' : ''}`}>{children}</div>; }
