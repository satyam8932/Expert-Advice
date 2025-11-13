'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Trash2, MoreVertical, Pencil, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useFormsStore } from '@/store/forms.store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EditFormDialog from './EditFormDialog';

export default function FormsTable() {
    const { forms, deleteForm, deleteMany, updateForm } = useFormsStore();
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingForm, setEditingForm] = useState<{ id: string; name: string } | null>(null);

    const filtered = forms.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

    const toggleSelect = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

    const handleCopy = async (link: string) => {
        await navigator.clipboard.writeText(link);
        toast('Copied', { description: 'Form link copied to clipboard.' });
    };

    const handleDeleteSelected = async () => {
        await deleteMany(selected);
        setSelected([]);
    };

    const handleDeleteSingle = async (id: string) => {
        await deleteForm(id);
    };

    const handleEditClick = (id: string, name: string) => {
        setEditingForm({ id, name });
        setEditDialogOpen(true);
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'completed' : 'active';
        await updateForm(id, { status: newStatus });
    };

    return (
        <>
            {editingForm && <EditFormDialog formId={editingForm.id} currentName={editingForm.name} open={editDialogOpen} onOpenChange={setEditDialogOpen} />}
            <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
                <div className="p-4 flex items-center justify-between bg-gray-50 border-b gap-4">
                    <Input placeholder="Search forms..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm focus-visible:ring-indigo-500" />
                    {selected.length >= 2 && (
                        <Button variant="destructive" onClick={handleDeleteSelected} className="rounded-lg font-medium">
                            Delete ({selected.length})
                        </Button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700 border-b">
                            <tr>
                                <th className="p-4 w-10">
                                    <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((f) => f.id))} />
                                </th>
                                <th className="p-4 text-left font-semibold">Form Name</th>
                                <th className="p-4 text-left font-semibold">Submissions</th>
                                <th className="p-4 text-left font-semibold">Status</th>
                                <th className="p-4 text-left font-semibold">Created</th>
                                <th className="p-4 text-left font-semibold">Link</th>
                                <th className="p-4 text-left font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filtered.map((form) => (
                                <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <Checkbox checked={selected.includes(form.id)} onCheckedChange={() => toggleSelect(form.id)} />
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{form.name}</td>
                                    <td className="p-4 font-medium text-gray-900">{form.submissions}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${form.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</span>
                                    </td>
                                    <td className="p-4 text-gray-500">{format(form.created_at, 'MMM dd, yyyy')}</td>
                                    <td className="p-4 text-left">
                                        <Button size="sm" variant="outline" onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_SITE_URL}/forms/${form.id}`)} className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 border-gray-200 hover:border-indigo-400">
                                            <Copy className="w-3 h-3" /> Copy
                                        </Button>
                                    </td>
                                    <td className="p-4 text-left">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(form.id, form.name)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Name
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleStatus(form.id, form.status)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    {form.status === 'active' ? 'Mark as Completed' : 'Mark as Active'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem variant="destructive" onClick={() => handleDeleteSingle(form.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!filtered.length && <div className="text-center text-gray-500 py-8 text-sm">No forms found</div>}
            </div>
        </>
    );
}
