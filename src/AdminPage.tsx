import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function AdminPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [keywords, setKeywords] = useState("");
  const addQuestion = useMutation(api.questions.addQuestion);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addQuestion({
        question,
        answer,
        keywords: keywords.split(",").map(k => k.trim()).filter(k => k),
      });
      toast.success("Question added successfully!");
      setQuestion("");
      setAnswer("");
      setKeywords("");
    } catch (error) {
      toast.error("Failed to add question");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Add New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="pasta, cooking, boiling"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Question
        </button>
      </form>
    </div>
  );
}
