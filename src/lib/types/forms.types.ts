export interface FormType {
    id: string;
    user_id: string;
    name: string;
    submissions: number;
    status: 'active' | 'completed';
    created_at: string;
}
