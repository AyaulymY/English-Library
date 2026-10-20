(function () {
  const root = document.getElementById("online-materials-list");
  const cfg = window.ENGLISH_LIBRARY_SUPABASE;

  if (!root) return;
  if (!cfg || !cfg.url || !cfg.anonKey ||
      cfg.url.includes("YOUR_") || cfg.anonKey.includes("YOUR_")) {
    root.textContent = "Online materials are not configured yet.";
    return;
  }
  if (!window.supabase || !window.supabase.createClient) {
    root.textContent = "Could not load the database client. Refresh the page.";
    return;
  }

  const db = window.supabase.createClient(cfg.url, cfg.anonKey);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));

  async function loadMaterials() {
    root.innerHTML = "<p>Loading materials…</p>";
    const { data, error } = await db
      .from("content_items")
      .select("id,grade,kind,title,content,explanation_kk,options,answer,game_type,created_at")
      .eq("is_published", true)
      .order("grade", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      root.innerHTML = "<p>Materials could not be loaded. Please check the Supabase setup.</p>";
      console.error("English Library database error:", error.message);
      return;
    }
    if (!data || data.length === 0) {
      root.innerHTML = "<p>No additional materials yet. The teacher can add them from the admin panel.</p>";
      return;
    }

    root.innerHTML = data.map(item => {
      const kindLabel = item.kind === "grammar" ? "Grammar / Ереже" :
        item.kind === "task" ? "Task / Тапсырма" : "Game / Ойын";
      let details = `<p>${esc(item.content).replace(/\n/g, "<br>")}</p>`;
      if (item.explanation_kk) {
        details += `<p><strong>Қазақша түсіндірме:</strong> ${esc(item.explanation_kk).replace(/\n/g, "<br>")}</p>`;
      }
      if (item.kind === "task" && Array.isArray(item.options) && item.options.length) {
        details += `<ol>${item.options.map(opt => `<li>${esc(opt)}</li>`).join("")}</ol>`;
      }
      if (item.kind === "task" && item.answer) {
        details += `<details><summary>Show answer / Жауабын көрсету</summary><p>${esc(item.answer)}</p></details>`;
      }
      if (item.kind === "game") {
        details += `<p><strong>Game type:</strong> ${esc(item.game_type || "quiz")}</p>`;
      }
      return `<article style="background:#fff;border:1px solid #e8ebf4;border-radius:14px;padding:16px;margin:12px 0">
        <div style="font-size:12px;color:#6658d9;font-weight:700">GRADE ${esc(item.grade)} · ${esc(kindLabel)}</div>
        <h3 style="margin:8px 0">${esc(item.title)}</h3>${details}</article>`;
    }).join("");
  }

  loadMaterials();
})();
