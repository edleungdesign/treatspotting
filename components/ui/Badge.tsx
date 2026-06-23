export type BadgeTone = 'green' | 'red' | 'amber';
export default function Badge({children, tone='green'}:{children:React.ReactNode;tone?:BadgeTone}){ return <span className={`pw-badge ${tone}`}>{children}</span>; }
