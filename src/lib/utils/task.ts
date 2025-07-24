// src/lib/utils.task.ts
type DeadlineStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | null

export function formatDate(date: Date | string): string {
    const d = new Date(date);

    return d.toLocaleDateString('en-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

export function isOverdue(deadline: Date | string | null): boolean {
    if (!deadline) return false;

    return new Date(deadline) < new Date();
}

export function getDeadlineStatus(deadline: Date | string | null): DeadlineStatus {
    if (!deadline) return null;

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000*60*60*24))

    if (diffDays < 0) return 'overdue'
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'tomorrow'
    return 'upcoming'
}