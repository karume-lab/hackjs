const authBase = ["auth"] as const;
const todosBase = ["todos"] as const;
const adminBase = ["admin"] as const;

export const QUERY_KEYS = {
  auth: {
    all: () => authBase,
    session: () => [...authBase, "session"] as const,
    user: (id: string) => [...authBase, "user", id] as const,
  },
  todos: {
    all: () => todosBase,
    lists: () => [...todosBase, "list"] as const,
    list: (filters: Record<string, unknown>) => [...todosBase, "list", filters] as const,
    details: () => [...todosBase, "detail"] as const,
    detail: (id: string) => [...todosBase, "detail", id] as const,
  },
  admin: {
    all: () => adminBase,
    users: {
      all: () => [...adminBase, "users"] as const,
      lists: () => [...adminBase, "users", "list"] as const,
      list: (page: number, limit: number) =>
        [...adminBase, "users", "list", { page, limit }] as const,
      details: () => [...adminBase, "users", "detail"] as const,
      detail: (id: string) => [...adminBase, "users", "detail", id] as const,
      stats: () => [...adminBase, "users", "stats"] as const,
    },
    todos: {
      all: () => [...adminBase, "todos"] as const,
      lists: () => [...adminBase, "todos", "list"] as const,
      list: (page: number, limit: number) =>
        [...adminBase, "todos", "list", { page, limit }] as const,
      stats: () => [...adminBase, "todos", "stats"] as const,
    },
  },
} as const;
