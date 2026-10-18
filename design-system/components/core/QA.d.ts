export interface QAProps { question: string; title: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }
export function QA(props: QAProps): JSX.Element;
export interface FriendProps { initials: string; name: string; href?: string; children: React.ReactNode; style?: React.CSSProperties }
export function Friend(props: FriendProps): JSX.Element;
