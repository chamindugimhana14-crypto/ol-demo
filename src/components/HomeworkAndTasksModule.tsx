"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  completeHomework,
  createHomework,
  createTodo,
  deleteHomework,
  deleteTodo,
  reopenHomework,
  toggleTodo,
} from "@/app/actions";
import type { HomeworkItem, Subject, TodoItem } from "@/db/schema";
import { playChime } from "./SoundEffects";

interface Props {
  homeworkItems: HomeworkItem[];
  todoItems: TodoItem[];
  subjects: Subject[];
}

export function HomeworkAndTasksModule({ homeworkItems, todoItems, subjects }: Props) {
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "completed">("pending");
  const [showAddHw, setShowAddHw] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const filteredHw = homeworkItems.filter((h) => {
    if (activeFilter === "pending") return h.status !== "completed";
    if (activeFilter === "completed") return h.status === "completed";
    return true;
  });

  const filteredTodos = todoItems.filter((t) => {
    if (activeFilter === "pending") return !t.completed;
    if (activeFilter === "completed") return t.completed;
    return true;
  });

  const handleCompleteSuccess = () => {
    playChime("success");
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#FFD700", "#FFFFFF"],
      });
    } catch (e) {
      console.debug(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-5 shadow-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[#FFD700]" />
            Homework, Tuition Assignments & To-Do Queue
          </h2>
          <p className="text-xs text-zinc-400">
            Never miss a tuition assignment or daily revision task
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddHw(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-3.5 py-2 text-xs font-bold text-black hover:bg-yellow-400"
          >
            <Plus className="h-4 w-4" /> Add Homework
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-bold text-white hover:border-[#FFD700]"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-3">
        {[
          { id: "pending", label: "Pending Items" },
          { id: "completed", label: "Completed Items" },
          { id: "all", label: "All Items" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? "bg-[#FFD700] text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2-Column Grid: Homework vs Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tuition Homework Column */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#FFD700]" />
              Tuition Homework ({filteredHw.length})
            </h3>
            <span className="rounded bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400">
              Classes
            </span>
          </div>

          <div className="space-y-3">
            {filteredHw.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500">
                No tuition homework items under this filter.
              </p>
            ) : (
              filteredHw.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 text-xs transition-all ${
                    item.status === "completed"
                      ? "border-emerald-950 bg-emerald-950/20"
                      : item.priority === "high"
                      ? "border-amber-900/60 bg-amber-950/20"
                      : "border-zinc-800 bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            item.priority === "high"
                              ? "bg-rose-950 text-rose-300 border border-rose-800/40"
                              : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {item.priority.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-[#FFD700]">
                          {subjectMap.get(item.subjectId ?? -1) || "General"}
                        </span>
                      </div>

                      <p className="mt-1.5 font-bold text-white text-sm">{item.title}</p>
                      {item.notes && <p className="mt-1 text-zinc-400 text-[11px]">{item.notes}</p>}

                      {item.dueDate && (
                        <p className="mt-2 flex items-center gap-1 text-[11px] text-zinc-400">
                          <Clock className="h-3 w-3 text-[#FFD700]" />
                          Due: {new Date(item.dueDate).toLocaleDateString("en-LK", { dateStyle: "medium" })}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {item.status !== "completed" ? (
                        <form
                          action={async (fd) => {
                            handleCompleteSuccess();
                            await completeHomework(fd);
                          }}
                        >
                          <input type="hidden" name="id" value={item.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                          >
                            Mark Done
                          </button>
                        </form>
                      ) : (
                        <form action={reopenHomework}>
                          <input type="hidden" name="id" value={item.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                          >
                            Re-open
                          </button>
                        </form>
                      )}

                      <form action={deleteHomework}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="rounded p-1 text-zinc-500 hover:text-rose-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Tasks / Goals Column */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121212] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#00E5FF]" />
              Study Goals & Daily Tasks ({filteredTodos.length})
            </h3>
            <span className="rounded bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400">
              Personal
            </span>
          </div>

          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500">
                No personal study tasks under this filter.
              </p>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                    todo.completed
                      ? "border-emerald-950 bg-emerald-950/20 text-zinc-400"
                      : "border-zinc-800 bg-zinc-900/50 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <form
                      action={async (fd) => {
                        if (!todo.completed) handleCompleteSuccess();
                        await toggleTodo(fd);
                      }}
                    >
                      <input type="hidden" name="id" value={todo.id} />
                      <input
                        type="hidden"
                        name="next"
                        value={todo.completed ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                          todo.completed
                            ? "border-emerald-500 bg-emerald-600 text-white"
                            : "border-zinc-700 bg-zinc-800 hover:border-[#FFD700]"
                        }`}
                      >
                        {todo.completed && <CheckSquare className="h-3.5 w-3.5" />}
                      </button>
                    </form>

                    <div>
                      <p className={`font-semibold ${todo.completed ? "line-through text-zinc-500" : "text-white"}`}>
                        {todo.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {todo.priority} priority • {todo.recurring !== "none" ? `Recurring: ${todo.recurring}` : "Single task"}
                      </p>
                    </div>
                  </div>

                  <form action={deleteTodo}>
                    <input type="hidden" name="id" value={todo.id} />
                    <button type="submit" className="rounded p-1 text-zinc-500 hover:text-rose-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Homework Modal */}
      {showAddHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white">Add Tuition Homework</h3>
              <button onClick={() => setShowAddHw(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await createHomework(formData);
                setShowAddHw(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="text-zinc-400">Subject</label>
                <select name="subjectId" required className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400">Homework Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Complete 2023 Past Paper Part B"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Priority</label>
                  <select name="priority" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400">Notes / Instructions</label>
                <textarea
                  name="notes"
                  placeholder="Pages, specific questions..."
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHw(false)}
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFD700] px-4 py-2 font-bold text-black"
                >
                  Add Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#FFD700]/30 bg-[#121212] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white">Add Study Goal / Task</h3>
              <button onClick={() => setShowAddTask(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              action={async (formData) => {
                await createTodo(formData);
                setShowAddTask(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="text-zinc-400">Task Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. 20m Morning Mind Mapping"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400">Priority</label>
                  <select name="priority" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400">Recurring</label>
                  <select name="recurring" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-white">
                    <option value="none">None (Once)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FFD700] px-4 py-2 font-bold text-black"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
