"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { orpc } from "@repo/api/client";
import { Button } from "@repo/ui/web/components/ui/button";
import { Input } from "@repo/ui/web/components/ui/input";
import { insertTodoSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type TodoFormValues = z.infer<typeof insertTodoSchema>;

export function TodoForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createTodo } = useMutation(
    orpc.todos.createTodo.mutationOptions({
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries({ queryKey: orpc.todos.getTodos.key() });
        toast.success("Todo added!");
      },
      onError: (e) => {
        console.error("Failed to add todo", e);
        toast.error("Failed to add todo.");
      },
    }),
  );

  const onSubmit = (values: TodoFormValues) => {
    createTodo({ title: values.title, completed: false });
  };

  return (
    <form className="mb-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="What needs to be done?"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  );
}
