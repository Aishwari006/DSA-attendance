const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getUsers: () => request("/users"),
  getAttendance: () => request("/attendance"),
  getQuestions: () => request("/questions"),

  addQuestion: (data: any) =>
    request("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (id: string, data: any) =>
    request(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteQuestion: (id: string) =>
    request(`/questions/${id}`, {
      method: "DELETE",
    }),

  postAttendance: (memberId: string, date: string) =>
    request("/attendance", {
      method: "POST",
      body: JSON.stringify({ memberId, date }),
    }),
};