/**
 * @startingPoint section="Core" subtitle="Services-page article" viewport="900x300"
 */
export interface ServiceProps { id?: string; label: string; title: React.ReactNode; intro: React.ReactNode; children?: React.ReactNode; style?: React.CSSProperties }
export function Service(props: ServiceProps): JSX.Element;
export interface MiniAgentsProps { agents?: { name: string; role: string }[] }
export function MiniAgents(props: MiniAgentsProps): JSX.Element;
export interface StepsProps { steps?: { title: string; text: string }[] }
export function Steps(props: StepsProps): JSX.Element;
