import { useEffect, useState } from "react";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Préparer offre Client XYZ",
            category: "Offres",
            priority: "Haute",
            status: "todo",
          },
        ];
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.body.style.background =
      theme === "dark" ? "#0f172a" : "#f8fafc";

    document.body.style.color =
      theme === "dark" ? "#ffffff" : "#000000";

    localStorage.setItem("theme", theme);
  }, [theme]);

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        category: "Travail",
        priority: "Moyenne",
        status: "todo",
      },
    ]);

    setNewTask("");
  };

  const moveTask = (id, status) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    );
  };

  const total = tasks.length;
  const completed = tasks.filter(
    (t) => t.status === "done"
  ).length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const cardStyle = {
    background: theme === "dark" ? "#1e293b" : "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 TaskHub Pro V3</h1>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() =>
            setTheme(
              theme === "dark" ? "light" : "dark"
            )
          }
        >
          {theme === "dark"
            ? "☀️ Mode Clair"
            : "🌙 Mode Sombre"}
        </button>

        <button
          onClick={() =>
            window.open(
              "https://outlook.office.com",
              "_blank"
            )
          }
          style={{ marginLeft: 10 }}
        >
          📮 Outlook
        </button>

        <button
          onClick={() =>
            window.open(
              "https://teams.microsoft.com",
              "_blank"
            )
          }
          style={{ marginLeft: 10 }}
        >
          💬 Teams
        </button>

        <button
          onClick={() => {
            Notification.requestPermission()
              .then(() => {
                new Notification(
                  "TaskHub Pro",
                  {
                    body:
                      "Notifications activées ✅",
                  }
                );
              });
          }}
          style={{ marginLeft: 10 }}
        >
          🔔 Notifications
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div style={cardStyle}>
          <h3>Tâches</h3>
          <h2>{total}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Terminées</h3>
          <h2>{completed}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Progression</h3>
          <h2>{progress}%</h2>
        </div>

        <div style={cardStyle}>
          <h3>Prioritaires</h3>
          <h2>
            {
              tasks.filter(
                (t) =>
                  t.priority === "Haute"
              ).length
            }
          </h2>
        </div>
      </div>

      <div style={cardStyle}>
        <h2>Ajouter une tâche</h2>

        <input
          value={newTask}
          onChange={(e) =>
            setNewTask(e.target.value)
          }
          placeholder="Nouvelle tâche..."
          style={{
            padding: 10,
            marginRight: 10,
          }}
        />

        <button onClick={addTask}>
          ➕ Ajouter
        </button>
      </div>

      <h2 style={{ marginTop: 40 }}>
        📋 Kanban
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3,1fr)",
          gap: 20,
        }}
      >
        {[
          ["todo", "À Faire"],
          ["doing", "En cours"],
          ["done", "Terminé"],
        ].map(([status, label]) => (
          <div
            key={status}
            style={cardStyle}
          >
            <h3>{label}</h3>

            {tasks
              .filter(
                (t) =>
                  t.status === status
              )
              .map((task) => (
                <div
                  key={task.id}
                  style={{
                    border:
                      "1px solid #555",
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 6,
                  }}
                >
                  <b>{task.title}</b>

                  <p>
                    {task.category} •{" "}
                    {task.priority}
                  </p>

                  {status !== "todo" && (
                    <button
                      onClick={() =>
                        moveTask(
                          task.id,
                          "todo"
                        )
                      }
                    >
                      ◀
                    </button>
                  )}

                  {status ===
                    "todo" && (
                    <button
                      onClick={() =>
                        moveTask(
                          task.id,
                          "doing"
                        )
                      }
                    >
                      ▶
                    </button>
                  )}

                  {status ===
                    "doing" && (
                    <button
                      onClick={() =>
                        moveTask(
                          task.id,
                          "done"
                        )
                      }
                    >
                      ✅
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}