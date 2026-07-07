"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!input) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setAnswer(data.answer || "Няма отговор");
    } catch (err) {
      setAnswer("Грешка при AI");
    }

    setLoading(false);
  }

  const categories = [
    "Зидария и арматура",
    "Шпакловки и бои",
    "Покриви",
    "Електро услуги",
    "ВИК инсталации",
    "Довършителни работи",
  ];

  const subcategories = [
    "Санитария (вани, мивки, бойлери)",
    "Стъклени парапети",
    "Метални парапети",
    "Декинг",
    "Ламперии",
    "Ламинат",
    "Паркети",
    "PVC и дървени панели",
  ];

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ color: "#f59e0b" }}>🏗️ BuildTrustBG</h2>
      </header>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "70px 20px" }}>
        <h1 style={{ color: "#f59e0b", fontSize: "42px" }}>
          Намери строителна фирма
        </h1>

        <p style={{ opacity: 0.7 }}>
          Намери проверени строителни фирми за ремонт и строителство в България
        </p>
      </div>

      {/* CATEGORIES */}
      <div
        style={{
          padding: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "15px",
        }}
      >
        {categories.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #334155",
              textAlign: "center",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* SUBCATEGORIES */}
      <div style={{ padding: "30px" }}>
        <h2 style={{ color: "#f59e0b", textAlign: "center" }}>
          Подкатегории
        </h2>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          {subcategories.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#111827",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #1e293b",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* AI SECTION */}
      <div
        style={{
          padding: "50px 20px",
          textAlign: "center",
          background: "#0b1220",
        }}
      >
        <h2 style={{ color: "#f59e0b" }}>AI Асистент</h2>

        <p style={{ opacity: 0.7, marginBottom: "20px" }}>
          AI асистентът ще ви помогне да намерите подходящата фирма и ще отговори
          на въпросите ви.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напиши: фирма за мазилка 200м2"
            style={{
              padding: "12px",
              width: "320px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#111827",
              color: "white",
            }}
          />

          <button
            onClick={askAI}
            style={{
              padding: "12px 18px",
              background: "#f59e0b",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "..." : "Питай"}
          </button>
        </div>

        {answer && (
          <div
            style={{
              marginTop: "25px",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              background: "#111827",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #f59e0b",
            }}
          >
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}