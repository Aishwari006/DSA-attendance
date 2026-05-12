const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  if (!res.ok) {
    // Try to extract the exact error message sent by your Express backend
    let errorMessage = `Request failed: ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // If the response wasn't JSON, just fall back to the status code
    }
    throw new Error(errorMessage);
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
  updateMember: (id: string, data: any) =>
    request(`/users/${id}`, {   // Note: match this to your exact route, it might be /members/${id}
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Your arguments here are perfectly fine! No need to change them to an object.
  postAttendance: (memberId: string, date: string) =>
    request("/attendance", {
      method: "POST",
      body: JSON.stringify({ memberId, date }),
    }),
};