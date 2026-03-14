import { t } from "elysia";

export const UserSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  emailVerified: t.Boolean(),
  image: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  role: t.Nullable(t.String()),
  banned: t.Nullable(t.Boolean()),
  banReason: t.Nullable(t.String()),
  banExpires: t.Nullable(t.Date()),
});

export const TodoSchema = t.Object({
  id: t.String(),
  title: t.String(),
  completed: t.Boolean(),
  userId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const TodoWithUserSchema = t.Intersect([
  TodoSchema,
  t.Object({
    user: UserSchema,
  }),
]);

export const PaginationMetadataSchema = t.Object({
  totalCount: t.Number(),
  page: t.Number(),
  totalPages: t.Number(),
});

export const PaginatedUserResponseSchema = t.Object({
  data: t.Array(UserSchema),
  metadata: PaginationMetadataSchema,
});

export const PaginatedTodoWithUserResponseSchema = t.Object({
  data: t.Array(TodoWithUserSchema),
  metadata: PaginationMetadataSchema,
});
