export const TODO_STATUSES = ["all", "completed", "pending"] as const;
export type TodoStatus = (typeof TODO_STATUSES)[number];
