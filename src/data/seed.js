export function makeSeedEntries() {
  const sessions = [
    ["squat", 100, 3, 5, "Controlled depth. A steady start."],
    ["bench", 70, 4, 5, "Paused every first rep."],
    [
      "deadlift",
      130,
      3,
      3,
      "Double overhand warm-up, mixed grip working sets.",
    ],
    ["squat", 110, 3, 5, "Bracing felt much stronger."],
    ["bench", 75, 3, 5, "Good bar path."],
    ["deadlift", 140, 3, 3, "Kept the bar close."],
    ["squat", 120, 3, 3, "Solid depth on all sets."],
    ["bench", 80, 3, 3, "Paused bench. Last set was challenging."],
    ["deadlift", 150, 2, 3, "Smooth lockouts."],
  ];
  return sessions.map(([exercise, weightKg, sets, reps, notes], index) => {
    const day = new Date();
    day.setDate(day.getDate() - (sessions.length - index) * 2);
    const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    return {
      id: `demo-${index + 1}`,
      exercise,
      weightKg,
      sets,
      reps,
      notes,
      date,
      createdAt: `${date}T12:00:00.000Z`,
      updatedAt: `${date}T12:00:00.000Z`,
    };
  });
}
