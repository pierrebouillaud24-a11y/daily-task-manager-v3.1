import { useEffect, useState } from "react";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [view, setView] = useState("dashboard");

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
      tasks.map((task) =>
        task.id === id
          ? { ...task, status }
          : task
      )
    );
  };

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const cardStyle = {
    background:
      theme === "dark"
        ? "#1e293b"
        : "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,.15)",
  };

  const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 TaskHub Pro V3</h1>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark"
            ? "☀️ Mode Clair"
            : "🌙 Mode Sombre"}
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() =>
            window.open(
              "https://outlook.office.com",
              "_blank"
            )
          }
        >
          📮 Outlook
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() =>
            window.open(
              "https://teams.microsoft.com",
              "_blank"
            )
          }
        >
          💬 Teams
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            Notification.requestPermission().then(() => {
              new Notification("TaskHub Pro", {
                body: "Notifications activées ✅",
              });
            });
          }}
        >
          🔔 Notifications
        </button>

        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setView("dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            style={{ marginLeft: 10 }}
            onClick={() => setView("weekly")}
          >
            📆 Semaine
          </button>

          <button
            style={{ marginLeft: 10 }}
            onClick={() => setView("monthly")}
          >
            📅 Calendrier
          </button>
        </div>
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
                (task) =>
                  task.priority === "Haute"
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

      {view === "weekly" && (
        <div
          style={{
            ...cardStyle,
            marginTop: 30,
          }}
        >
          <h2>📆 Planning hebdomadaire</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7,1fr)",
              gap: 10,
            }}
          >
            {weekDays.map((day) => (
              <div
                key={day}
                style={{
                  border: "1px solid #555",
                  borderRadius: 8,
                  padding: 10,
                  minHeight: 150,
                }}
              >
                <strong>{day}</strong>

                {tasks.map((task) => (
                  <div
                    key={day + task.id}
                    style={{ marginTop: 8 }}
                  >
                    • {task.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "monthly" && (
        <div
          style={{
            ...cardStyle,
            marginTop: 30,
          }}
        >
          <h2>📅 Calendrier mensuel</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7,1fr)",
              gap: 10,
            }}
          >
            {Array.from(
              { length: 30 },
              (_, i) => i + 1
            ).map((day) => (
              <div
                key={day}
                style={{
                  border: "1px solid #555",
                  borderRadius: 8,
                  minHeight: 100,
                  padding: 10,
                }}
              >
                <strong>{day}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "dashboard" && (
        <>
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
                    (task) =>
                      task.status === status
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

                      {status === "todo" && (
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

                      {status === "doing" && (
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
        </>
      )}
    </div>
  );
}