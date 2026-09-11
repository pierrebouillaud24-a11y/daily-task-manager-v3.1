import { useEffect, useState } from "react";

export default function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");

  const [agenda] = useState([
    {
      id: 1,
      heure: "09:00",
      titre: "Réunion commerciale"
    },
    {
      id: 2,
      heure: "11:00",
      titre: "Appel client XYZ"
    },
    {
      id: 3,
      heure: "14:00",
      titre: "Préparation devis"
    }
  ]);

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
  const [category, setCategory] = useState("Travail");
  const [priority, setPriority] = useState("Moyenne");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.body.style.background =
      theme === "dark" ? "#020617" : "#f8fafc";

    document.body.style.color =
      theme === "dark" ? "#ffffff" : "#0f172a";
  }, [theme]);

  const addTask = () => {
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        category,
        priority,
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

  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
  };

  const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 TaskHub Pro V7</h1>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() =>
            setTheme(
              theme === "dark"
                ? "light"
                : "dark"
            )
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
            Notification.requestPermission().then(
              () => {
                new Notification("TaskHub", {
                  body:
                    "Notifications activées ✅",
                });
              }
            );
          }}
        >
          🔔 Notifications
        </button>
      </div>

      <div style={{ marginBottom: 25 }}>
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
          onClick={() => setView("calendar")}
        >
          📅 Calendrier
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
                (task) =>
                  task.priority === "Haute"
              ).length
            }
          </h2>
        </div>
      </div>

      {view === "dashboard" && (
        <>
          <div
            style={{
              ...cardStyle,
              marginBottom: 20,
            }}
          >
            <h2>📅 Mon Agenda du Jour</h2>

            {agenda.map((event) => (
              <div
                key={event.id}
                style={{
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 10,
                  border:
                    "1px solid rgba(255,255,255,.1)",
                }}
              >
                <strong>
                  {event.heure}
                </strong>{" "}
                • {event.titre}
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <h2>Ajouter une tâche</h2>

            <input
              value={newTask}
              onChange={(e) =>
                setNewTask(e.target.value)
              }
              placeholder="Nouvelle tâche"
              style={{
                padding: 10,
                width: "100%",
                marginBottom: 10,
              }}
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option>Travail</option>
              <option>Clients</option>
              <option>Devis</option>
              <option>Prospection</option>
            </select>

            <select
              style={{ marginLeft: 10 }}
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option>Basse</option>
              <option>Moyenne</option>
              <option>Haute</option>
            </select>

            <button
              onClick={addTask}
              style={{ marginLeft: 10 }}
            >
              ➕ Ajouter
            </button>
          </div>

          <div
            style={{
              ...cardStyle,
              marginTop: 25,
            }}
          >
            <h2>🔍 Recherche</h2>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Rechercher une tâche..."
              style={{
                width: "100%",
                padding: 10,
              }}
            />
          </div>

          <h2 style={{ marginTop: 30 }}>
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

                {filteredTasks
                  .filter(
                    (task) =>
                      task.status === status
                  )
                  .map((task) => (
                    <div
                      key={task.id}
                      style={{
                        border:
                          "1px solid #475569",
                        marginTop: 10,
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      <strong>
                        {task.title}
                      </strong>

                      <p>
                        {task.category} •{" "}
                        {task.priority}
                      </p>

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

                      {status !== "todo" && (
                        <button
                          style={{
                            marginLeft: 5,
                          }}
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
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </>
      )}

      {view === "weekly" && (
        <div
          style={{
            ...cardStyle,
            marginTop: 20,
          }}
        >
          <h2>📆 Planning Hebdomadaire</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(5,1fr)",
              gap: 10,
            }}
          >
            {weekDays.map((day) => (
              <div
                key={day}
                style={{
                  border:
                    "1px solid #475569",
                  minHeight: 200,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <strong>{day}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div
          style={{
            ...cardStyle,
            marginTop: 20,
          }}
        >
          <h2>📅 Calendrier Mensuel</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7,1fr)",
              gap: 10,
            }}
          >
            {Array.from(
              { length: 31 },
              (_, i) => i + 1
            ).map((day) => (
              <div
                key={day}
                style={{
                  minHeight: 90,
                  border:
                    "1px solid #475569",
                  borderRadius: 10,
                  padding: 8,
                }}
              >
                <strong>{day}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
