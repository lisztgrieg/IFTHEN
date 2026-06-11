const skills = [
  { value: "0", numeric: 0, label: "Passivity" },
  { value: ".5", numeric: 0.5, label: "Rapport" },
  { value: "1-4", numeric: 2.5, label: "Diplomacy" },
  { value: "4.5", numeric: 4.5, label: "Restraint" },
  { value: "5", numeric: 5, label: "Information" },
  { value: "5.5", numeric: 5.5, label: "Correction" },
  { value: "6", numeric: 6, label: "Moralization" },
  { value: "7", numeric: 7, label: "Dominance" },
  { value: "8", numeric: 8, label: "Aggression" },
  { value: "8.5", numeric: 8.5, label: "Volume" },
  { value: "9", numeric: 9, label: "Force" },
  { value: "9.5", numeric: 9.5, label: "Lethality" },
  { value: "10", numeric: 10, label: "War" }
];

const storeKey = "communicationSkillsTracker:v1";
const appVersion = "0.2.4";
const holdMs = 3000;
const eventTagOptions = [
  "workplace", "family", "romantic", "public", "courtroom", "police", "mental health", "customer service",
  "school", "emergency", "medical", "sibling", "parental", "children", "minors", "adults", "restaurant",
  "alcohol", "drugs", "addictions", "crime", "violence", "lethal force", "death", "injury", "monetary loss",
  "sexual abuse", "insurance", "automobile", "property damage", "intervention", "crisis", "civil dispute",
  "legal dispute", "threats"
];
const skillDescriptions = {
  "0": "Passivity explanation placeholder.",
  ".5": "Rapport explanation placeholder.",
  "1-4": "Diplomacy explanation placeholder.",
  "4.5": "Restraint explanation placeholder.",
  "5": "Information explanation placeholder.",
  "5.5": "Correction explanation placeholder.",
  "6": "Moralization explanation placeholder.",
  "7": "Dominance explanation placeholder.",
  "8": "Aggression explanation placeholder.",
  "8.5": "Volume explanation placeholder.",
  "9": "Force explanation placeholder.",
  "9.5": "Lethality explanation placeholder.",
  "10": "War explanation placeholder."
};

const state = loadState();
let activeTrialId = state.activeTrialId;
let holdTimer = null;
let suppressNextClick = false;
let tagModalIsFinishing = false;

const els = {
  clientName: document.querySelector("#clientName"),
  trialName: document.querySelector("#trialName"),
  eventDate: document.querySelector("#eventDate"),
  eventTime: document.querySelector("#eventTime"),
  eventOutcome: document.querySelector("#eventOutcome"),
  openTagPicker: document.querySelector("#openTagPicker"),
  selectedTags: document.querySelector("#selectedTags"),
  tagModal: document.querySelector("#tagModal"),
  tagGrid: document.querySelector("#tagGrid"),
  closeTagModal: document.querySelector("#closeTagModal"),
  saveTags: document.querySelector("#saveTags"),
  finishFromTags: document.querySelector("#finishFromTags"),
  videoUrl: document.querySelector("#videoUrl"),
  saveVideoMeta: document.querySelector("#saveVideoMeta"),
  addRecommendedVideo: document.querySelector("#addRecommendedVideo"),
  openOverlay: document.querySelector("#openOverlay"),
  renderEmbed: document.querySelector("#renderEmbed"),
  videoEmbed: document.querySelector("#videoEmbed"),
  creatorNodes: document.querySelector("#creatorNodes"),
  creatorAverage: document.querySelector("#creatorAverage"),
  creatorPeak: document.querySelector("#creatorPeak"),
  creatorMode: document.querySelector("#creatorMode"),
  creatorTimeline: document.querySelector("#creatorTimeline"),
  creatorBars: document.querySelector("#creatorBars"),
  creatorPie: document.querySelector("#creatorPie"),
  creatorPieLegend: document.querySelector("#creatorPieLegend"),
  recommendedVideos: document.querySelector("#recommendedVideos"),
  redundancyReview: document.querySelector("#redundancyReview"),
  participantOne: document.querySelector("#participantOne"),
  participantTwo: document.querySelector("#participantTwo"),
  startTrial: document.querySelector("#startTrial"),
  pauseTrial: document.querySelector("#pauseTrial"),
  endTrial: document.querySelector("#endTrial"),
  deleteTrial: document.querySelector("#deleteTrial"),
  activeTrialLabel: document.querySelector("#activeTrialLabel"),
  totalTaps: document.querySelector("#totalTaps"),
  averageScore: document.querySelector("#averageScore"),
  floorScore: document.querySelector("#floorScore"),
  partyOneScores: document.querySelector("#partyOneScores"),
  partyTwoScores: document.querySelector("#partyTwoScores"),
  descriptionToggle: document.querySelector("#descriptionToggle"),
  descriptionBox: document.querySelector("#descriptionBox"),
  buttonStack: document.querySelector("#buttonStack"),
  exportCsv: document.querySelector("#exportCsv"),
  dateFilter: document.querySelector("#dateFilter"),
  buttonFilter: document.querySelector("#buttonFilter"),
  metricTrials: document.querySelector("#metricTrials"),
  metricEvents: document.querySelector("#metricEvents"),
  metricAverage: document.querySelector("#metricAverage"),
  metricFloor: document.querySelector("#metricFloor"),
  metricPartyOneScores: document.querySelector("#metricPartyOneScores"),
  metricPartyTwoScores: document.querySelector("#metricPartyTwoScores"),
  metricMode: document.querySelector("#metricMode"),
  metricModeP1: document.querySelector("#metricModeP1"),
  metricModeP2: document.querySelector("#metricModeP2"),
  metricCategoryMode: document.querySelector("#metricCategoryMode"),
  metricCategoryModeP1: document.querySelector("#metricCategoryModeP1"),
  metricCategoryModeP2: document.querySelector("#metricCategoryModeP2"),
  barChartRow: document.querySelector("#barChartRow"),
  pieChartRow: document.querySelector("#pieChartRow"),
  lineChart: document.querySelector("#lineChart"),
  categoryPieChartRow: document.querySelector("#categoryPieChartRow"),
  categoryBarChartRow: document.querySelector("#categoryBarChartRow"),
  categoryLineChart: document.querySelector("#categoryLineChart"),
  interactionAnalysis: document.querySelector("#interactionAnalysis"),
  categoryInteractionAnalysis: document.querySelector("#categoryInteractionAnalysis"),
  profileSelect: document.querySelector("#profileSelect"),
  compareA: document.querySelector("#compareA"),
  compareB: document.querySelector("#compareB"),
  profileDashboard: document.querySelector("#profileDashboard"),
  compareDashboard: document.querySelector("#compareDashboard"),
  appVersion: document.querySelector("#appVersion"),
  connectionStatus: document.querySelector("#connectionStatus"),
  lastSaved: document.querySelector("#lastSaved"),
  exportBackup: document.querySelector("#exportBackup"),
  importBackup: document.querySelector("#importBackup"),
  loadDemo: document.querySelector("#loadDemo"),
  clearData: document.querySelector("#clearData"),
  reminderNotes: document.querySelector("#reminderNotes"),
  updateToast: document.querySelector("#updateToast"),
  reloadApp: document.querySelector("#reloadApp"),
  trialList: document.querySelector("#trialList"),
  sharedList: document.querySelector("#sharedList")
};

const fiveCategories = [
  { value: "5 Down", numeric: 0, label: "5 Down" },
  { value: "5 Alone", numeric: 1, label: "5 Alone" },
  { value: "5 Up", numeric: 2, label: "5 Up" }
];

function loadState() {
  const fallback = { trials: [], shared: [], recommendedVideos: [], activeTrialId: null, lastSavedAt: null };
  try {
    return JSON.parse(localStorage.getItem(storeKey)) || fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  state.activeTrialId = activeTrialId;
  state.lastSavedAt = new Date().toISOString();
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function activeTrial() {
  return state.trials.find((trial) => trial.id === activeTrialId && !trial.endedAt) || null;
}

function isPaused(trial) {
  return Boolean(trial?.paused);
}

function completedTrials() {
  return state.trials.filter((trial) => trial.endedAt);
}

function countsFor(trial) {
  const counts = Object.fromEntries(skills.map((skill) => [skill.value, 0]));
  trial.events.forEach((event) => counts[event.value] += 1);
  return counts;
}

function countsForParticipant(trial, participantKey) {
  const counts = Object.fromEntries(skills.map((skill) => [skill.value, 0]));
  trial.events
    .filter((event) => (event.participantKey || "participant1") === participantKey)
    .forEach((event) => counts[event.value] += 1);
  return counts;
}

function participantTotalFor(trial, participantKey) {
  return trial.events.filter((event) => (event.participantKey || "participant1") === participantKey).length;
}

function totalFor(trial) {
  return trial.events.length;
}

function averageFor(trial) {
  if (!trial.events.length) return 0;
  const total = trial.events.reduce((sum, event) => sum + event.numeric, 0);
  return total / trial.events.length;
}

function floorFor(events) {
  if (!events.length) return null;
  return Math.min(...events.map((event) => event.numeric));
}

function averageEvents(events) {
  return events.length ? average(events.map((event) => event.numeric)) : 0;
}

function peakFor(events) {
  if (!events.length) return null;
  return Math.max(...events.map((event) => event.numeric));
}

function eventTags() {
  return [...els.tagGrid.querySelectorAll("input[type='checkbox']:checked")].map((input) => input.value);
}

function videoMeta() {
  return {
    url: els.videoUrl.value.trim()
  };
}

function tagText(tags) {
  return tags?.length ? tags.join(", ") : "None";
}

function eventDateTime() {
  return {
    date: els.eventDate.value,
    time: els.eventTime.value
  };
}

function requiredFieldsMissing() {
  const missing = [];
  if (!els.clientName.value.trim()) missing.push("Your Name");
  if (!els.trialName.value.trim()) missing.push("Event Name");
  if (!els.participantOne.value.trim()) missing.push("Party 1");
  if (!els.participantTwo.value.trim()) missing.push("Party 2");
  return missing;
}

function requireStartFields() {
  const missing = requiredFieldsMissing();
  if (!missing.length) return true;
  alert(`Enter required fields before starting: ${missing.join(", ")}`);
  return false;
}

function modeFor(events) {
  if (!events.length) return "None";
  const counts = {};
  events.forEach((event) => counts[event.value] = (counts[event.value] || 0) + 1);
  const [value] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const skill = skills.find((item) => item.value === value);
  return skill ? `${skill.value} ${skill.label}` : value;
}

function categoryFor(event) {
  if (event.numeric < 5) return "5 Down";
  if (event.numeric === 5) return "5 Alone";
  return "5 Up";
}

function categoryScoreFor(event) {
  return categoryFor(event) === "5 Down" ? 0 : categoryFor(event) === "5 Alone" ? 1 : 2;
}

function categoryModeFor(events) {
  if (!events.length) return "None";
  const counts = { "5 Down": 0, "5 Alone": 0, "5 Up": 0 };
  events.forEach((event) => counts[categoryFor(event)] += 1);
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function renderButtons() {
  els.buttonStack.innerHTML = "";
  const trial = activeTrial();

  [...skills].reverse().forEach((skill) => {
    const row = document.createElement("div");
    row.className = "skill-row";
    row.append(partyControls(skill, "participant1", trial));

    const label = document.createElement("div");
    label.className = "skill-label";
    label.textContent = skill.label;
    row.append(label);

    row.append(partyControls(skill, "participant2", trial));
    els.buttonStack.append(row);
  });
}

function partyControls(skill, participantKey, trial) {
      const counts = trial ? countsForParticipant(trial, participantKey) : Object.fromEntries(skills.map((item) => [item.value, 0]));
      const total = trial ? participantTotalFor(trial, participantKey) : 0;
      const ratio = total ? counts[skill.value] / total : 0;
      const controls = document.createElement("div");
      controls.className = "participant-controls";
      if (participantKey === "participant2") controls.classList.add("mirror");

      const button = document.createElement("button");
      button.className = "skill-button";
      button.type = "button";
      button.textContent = skill.value;
      button.disabled = isPaused(trial);
      button.style.background = colorFor(skill.numeric, ratio);
      button.style.color = "#000";
      button.addEventListener("click", () => {
        if (suppressNextClick) {
          suppressNextClick = false;
          return;
        }
        recordTap(skill, participantKey);
      });
      button.addEventListener("pointerdown", () => startHold(skill, participantKey, button));
      button.addEventListener("pointerup", cancelHold);
      button.addEventListener("pointerleave", cancelHold);
      button.addEventListener("pointercancel", cancelHold);

      const undo = document.createElement("button");
      undo.className = "skill-undo";
      undo.type = "button";
      undo.textContent = "Undo";
      undo.disabled = !trial || isPaused(trial) || !counts[skill.value];
      undo.addEventListener("click", () => decrementSkill(skill.value, participantKey));

      const counter = document.createElement("div");
      counter.className = "counter";
      counter.textContent = counts[skill.value];

      const percentage = document.createElement("div");
      percentage.className = "percentage";
      percentage.textContent = `${Math.round(ratio * 100)}%`;

      const percentageLabel = document.createElement("div");
      const category = percentageCategory(ratio);
      percentageLabel.className = `percentage-label ${percentageClass(category)}`;
      percentageLabel.textContent = category;

      if (participantKey === "participant1") {
        controls.append(percentageLabel, percentage, counter, button, undo);
      } else {
        controls.append(undo, button, counter, percentage, percentageLabel);
      }
      return controls;
}

function percentageCategory(ratio) {
  if (ratio === 0) return "Mute";
  if (ratio < 0.25) return "Mild";
  if (ratio < 0.5) return "Moderate";
  if (ratio <= 0.75) return "Major";
  if (ratio < 1) return "Massive";
  return "Monochrome";
}

function percentageClass(category) {
  return `percent-${category.toLowerCase()}`;
}

function colorFor(numeric, ratio) {
  if (!ratio) return "#e8edf3";
  const intensity = Math.max(0.22, Math.min(1, ratio + 0.18));
  const hue = numeric < 4.5 ? 184 : numeric < 7 ? 42 : numeric < 9 ? 20 : 356;
  const saturation = 45 + intensity * 35;
  const lightness = 82 - intensity * 42;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function startTrial() {
  if (!requireStartFields()) return;
  const client = els.clientName.value.trim();
  const name = els.trialName.value.trim();

  const trial = {
    id: uid("trial"),
    client,
    name,
    participants: {
      participant1: els.participantOne.value.trim() || "Party 1",
      participant2: els.participantTwo.value.trim() || "Party 2"
    },
    tags: eventTags(),
    outcome: els.eventOutcome.value,
    eventDate: els.eventDate.value,
    eventTime: els.eventTime.value,
    video: videoMeta(),
    startedAt: new Date().toISOString(),
    endedAt: null,
    paused: false,
    submittedAt: null,
    events: []
  };

  state.trials.push(trial);
  activeTrialId = trial.id;
  saveState();
  render();
}

function autoStartTrial() {
  if (!requireStartFields()) return null;
  const trial = {
    id: uid("trial"),
    client: els.clientName.value.trim() || "Client",
    name: els.trialName.value.trim() || `Event ${new Date().toLocaleString()}`,
    participants: {
      participant1: els.participantOne.value.trim() || "Party 1",
      participant2: els.participantTwo.value.trim() || "Party 2"
    },
    tags: eventTags(),
    outcome: els.eventOutcome.value,
    eventDate: els.eventDate.value,
    eventTime: els.eventTime.value,
    video: videoMeta(),
    startedAt: new Date().toISOString(),
    endedAt: null,
    paused: false,
    submittedAt: null,
    events: []
  };
  state.trials.push(trial);
  activeTrialId = trial.id;
  return trial;
}

function togglePauseTrial() {
  const trial = activeTrial();
  if (!trial) return;
  trial.paused = !trial.paused;
  saveState();
  render();
}

function endTrial() {
  const trial = activeTrial();
  if (!trial) return;
  trial.tags = eventTags();
  trial.outcome = els.eventOutcome.value;
  trial.eventDate = els.eventDate.value;
  trial.eventTime = els.eventTime.value;
  trial.video = videoMeta();
  trial.endedAt = new Date().toISOString();
  activeTrialId = null;
  saveState();
  render();
}

function requestFinishTrial() {
  if (!activeTrial()) return;
  openTagModal(true);
}

function openTagModal(finishing = false) {
  tagModalIsFinishing = finishing;
  els.tagModal.classList.remove("hidden");
  els.finishFromTags.classList.toggle("hidden", !finishing);
  els.closeTagModal.textContent = finishing ? "End and Record" : "Close";
}

function closeTagModal() {
  els.tagModal.classList.add("hidden");
  tagModalIsFinishing = false;
  els.closeTagModal.textContent = "Close";
}

function closeOrFinishTagModal() {
  if (tagModalIsFinishing) {
    finishAfterTags();
    return;
  }
  closeTagModal();
}

function renderTagGrid() {
  els.tagGrid.innerHTML = "";
  eventTagOptions.forEach((tag) => {
    const label = document.createElement("label");
    label.className = "tag-option";
    label.innerHTML = `<input type="checkbox" value="${escapeHtml(tag)}"><span>${escapeHtml(tag)}</span>`;
    els.tagGrid.append(label);
  });
}

function saveSelectedTags() {
  const tags = eventTags();
  els.selectedTags.textContent = tagText(tags);
  const trial = activeTrial();
  if (trial) {
    trial.tags = tags;
    saveState();
  }
  closeTagModal();
}

function finishAfterTags() {
  const tags = eventTags();
  els.selectedTags.textContent = tagText(tags);
  closeTagModal();
  endTrial();
}

function saveVideoMeta() {
  const trial = activeTrial();
  if (trial) {
    trial.video = videoMeta();
  }
  saveState();
  renderCreator();
}

function addRecommendedVideo() {
  const meta = videoMeta();
  if (!meta.url) {
    alert("Paste a video URL first.");
    return;
  }
  state.recommendedVideos = state.recommendedVideos || [];
  state.recommendedVideos.push({
    id: uid("video"),
    url: meta.url,
    title: els.trialName.value.trim() || meta.url,
    createdAt: new Date().toISOString()
  });
  saveState();
  renderCreator();
}

function openOverlay() {
  saveVideoMeta();
  window.open("overlay.html", "_blank");
}

function renderVideoEmbed() {
  const url = els.videoUrl.value.trim();
  els.videoEmbed.innerHTML = "";
  if (!url) return;
  const youtubeId = youtubeIdFromUrl(url);
  if (youtubeId) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    els.videoEmbed.append(iframe);
    return;
  }
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = url;
  els.videoEmbed.append(link);
}

function youtubeIdFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
  } catch {
    return "";
  }
  return "";
}

function deleteActiveTrial() {
  const trial = activeTrial();
  if (!trial) return;
  if (!confirm(`Delete event "${trial.name}" and all of its button presses?`)) return;
  state.trials = state.trials.filter((item) => item.id !== trial.id);
  activeTrialId = null;
  saveState();
  render();
}

function recordTap(skill, participantKey) {
  const trial = activeTrial() || autoStartTrial();
  if (!trial) return;
  if (isPaused(trial)) return;
  trial.events.push({
    id: uid("event"),
    sequenceNumber: trial.events.length + 1,
    value: skill.value,
    numeric: skill.numeric,
    label: skill.label,
    participantKey,
    participantName: trial.participants?.[participantKey] || participantKey,
    timestamp: new Date().toISOString()
  });
  saveState();
  render();
}

function startHold(skill, participantKey, button) {
  if (!activeTrial() || isPaused(activeTrial())) return;
  button.classList.add("active");
  holdTimer = window.setTimeout(() => {
    suppressNextClick = true;
    window.setTimeout(() => suppressNextClick = false, 600);
    decrementSkill(skill.value, participantKey);
    button.classList.remove("active");
  }, holdMs);
}

function cancelHold() {
  if (holdTimer) window.clearTimeout(holdTimer);
  holdTimer = null;
  document.querySelectorAll(".skill-button.active").forEach((button) => button.classList.remove("active"));
}

function decrementSkill(value, participantKey) {
  const trial = activeTrial();
  if (!trial) return;
  const index = [...trial.events].reverse().findIndex((event) => {
    return event.value === value && (event.participantKey || "participant1") === participantKey;
  });
  if (index < 0) return;
  const removeAt = trial.events.length - 1 - index;
  trial.events.splice(removeAt, 1);
  trial.events.forEach((event, eventIndex) => event.sequenceNumber = eventIndex + 1);
  saveState();
  render();
}

function filteredTrials() {
  const days = els.dateFilter.value;
  const buttonValue = els.buttonFilter.value;
  const cutoff = days === "all" ? null : Date.now() - Number(days) * 24 * 60 * 60 * 1000;
  const active = activeTrial();
  const source = active ? [...completedTrials(), active] : completedTrials();
  return source.filter((trial) => {
    const inDate = !cutoff || new Date(trial.startedAt).getTime() >= cutoff;
    const hasButton = buttonValue === "all" || trial.events.some((event) => event.value === buttonValue);
    return inDate && hasButton;
  });
}

function renderStatus() {
  const trial = activeTrial();
  const p1Events = trial ? trial.events.filter((event) => (event.participantKey || "participant1") === "participant1") : [];
  const p2Events = trial ? trial.events.filter((event) => (event.participantKey || "participant1") === "participant2") : [];
  els.activeTrialLabel.textContent = trial ? trial.name : "No trial";
  els.totalTaps.textContent = trial ? totalFor(trial) : "0";
  els.averageScore.textContent = trial ? averageFor(trial).toFixed(2) : "0.00";
  els.floorScore.textContent = trial && floorFor(trial.events) !== null ? floorFor(trial.events) : "None";
  const p1Avg = averageEvents(p1Events);
  const p2Avg = averageEvents(p2Events);
  const p1Floor = floorFor(p1Events);
  const p2Floor = floorFor(p2Events);
  els.partyOneScores.textContent = `${p1Avg.toFixed(2)} / ${p1Floor === null ? "None" : p1Floor}`;
  els.partyTwoScores.textContent = `${p2Avg.toFixed(2)} / ${p2Floor === null ? "None" : p2Floor}`;
  applyDualScoreComparison(els.partyOneScores, els.partyTwoScores, p1Avg, p2Avg, p1Floor, p2Floor);
  els.startTrial.disabled = Boolean(trial);
  els.pauseTrial.disabled = !trial;
  els.pauseTrial.textContent = isPaused(trial) ? "Resume Event" : "Pause Event";
  els.endTrial.disabled = !trial;
  els.deleteTrial.disabled = !trial;
}

function renderDashboard() {
  const trials = summaryTrials();
  const events = trials.flatMap((trial) => trial.events);
  const p1Events = events.filter((event) => (event.participantKey || "participant1") === "participant1");
  const p2Events = events.filter((event) => (event.participantKey || "participant1") === "participant2");
  els.metricTrials.textContent = trials.length;
  els.metricEvents.textContent = events.length;
  els.metricAverage.textContent = averageEvents(events).toFixed(2);
  els.metricFloor.textContent = floorFor(events) === null ? "None" : floorFor(events);
  const p1Avg = averageEvents(p1Events);
  const p2Avg = averageEvents(p2Events);
  const p1Floor = floorFor(p1Events);
  const p2Floor = floorFor(p2Events);
  els.metricPartyOneScores.textContent = `${p1Avg.toFixed(2)} / ${p1Floor === null ? "None" : p1Floor}`;
  els.metricPartyTwoScores.textContent = `${p2Avg.toFixed(2)} / ${p2Floor === null ? "None" : p2Floor}`;
  applyDualScoreComparison(els.metricPartyOneScores, els.metricPartyTwoScores, p1Avg, p2Avg, p1Floor, p2Floor);
  els.metricMode.textContent = modeFor(events);
  els.metricModeP1.textContent = modeFor(p1Events);
  els.metricModeP2.textContent = modeFor(p2Events);
  els.metricCategoryMode.textContent = categoryModeFor(events);
  els.metricCategoryModeP1.textContent = categoryModeFor(p1Events);
  els.metricCategoryModeP2.textContent = categoryModeFor(p2Events);
  renderPieRow(events, p1Events, p2Events);
  renderBarRow(events, p1Events, p2Events);
  renderLine(trials);
  renderCategoryPieRow(events, p1Events, p2Events);
  renderCategoryBarRow(events, p1Events, p2Events);
  renderCategoryLine(trials);
  renderInteractionAnalysis(trials);
  renderCategoryInteractionAnalysis(trials);
}

function summaryTrials() {
  const active = activeTrial();
  if (active) return [active];
  const latest = [...completedTrials()].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0];
  return latest ? [latest] : [];
}

function applyDualScoreComparison(firstElement, secondElement, p1Avg, p2Avg, p1Floor, p2Floor) {
  firstElement.classList.remove("score-low", "score-high");
  secondElement.classList.remove("score-low", "score-high");
  if (p1Floor === null || p2Floor === null) return;
  const p1Score = p1Avg + p1Floor;
  const p2Score = p2Avg + p2Floor;
  if (p1Score === p2Score) return;
  firstElement.classList.add(p1Score < p2Score ? "score-low" : "score-high");
  secondElement.classList.add(p2Score < p1Score ? "score-low" : "score-high");
}

function renderInteractionAnalysis(trials) {
  els.interactionAnalysis.innerHTML = "";
  const events = sortedEvents(trials);
  const cards = [
    analysisCard("Transition Patterns", transitionTable(events)),
    analysisCard("Self Escalation Score", escalationSummary(events, "self")),
    analysisCard("Other Escalation Score", escalationSummary(events, "other")),
    analysisCard("Combined Escalation Score", escalationSummary(events, "combined")),
    analysisCard("Response Lag", responseLagTable(events)),
    analysisCard("Skill Trigger Table", triggerTable(events)),
    analysisCard("Streaks / Runs", streakSummary(events)),
    analysisCard("Before / After", beforeAfterTable(events))
  ];
  cards.forEach((card) => els.interactionAnalysis.append(card));
}

function renderCategoryInteractionAnalysis(trials) {
  els.categoryInteractionAnalysis.innerHTML = "";
  const events = sortedEvents(trials).map((event) => ({
    ...event,
    value: categoryFor(event),
    label: categoryFor(event),
    numeric: categoryScoreFor(event)
  }));
  const cards = [
    analysisCard("Transition Patterns", transitionTable(events)),
    analysisCard("Self Escalation Score", escalationSummary(events, "self")),
    analysisCard("Other Escalation Score", escalationSummary(events, "other")),
    analysisCard("Combined Escalation Score", escalationSummary(events, "combined")),
    analysisCard("Response Lag", responseLagTable(events)),
    analysisCard("Skill Trigger Table", triggerTable(events)),
    analysisCard("Streaks / Runs", categoryStreakSummary(events)),
    analysisCard("Before / After", beforeAfterTable(events))
  ];
  cards.forEach((card) => els.categoryInteractionAnalysis.append(card));
}

function sortedEvents(trials) {
  return trials
    .flatMap((trial) => trial.events.map((event, index) => ({
      ...event,
      participantKey: event.participantKey || "participant1",
      participantName: event.participantName || trial.participants?.[event.participantKey || "participant1"] || "Party 1",
      trialId: trial.id,
      trialName: trial.name,
      trialStartedAt: trial.startedAt,
      order: index
    })))
    .sort((a, b) => {
      const trialDiff = new Date(a.trialStartedAt) - new Date(b.trialStartedAt);
      if (trialDiff) return trialDiff;
      if (a.trialId !== b.trialId) return a.trialId.localeCompare(b.trialId);
      return a.order - b.order;
    });
}

function analysisCard(title, content) {
  const card = document.createElement("div");
  card.className = "analysis-card";
  const heading = document.createElement("h3");
  heading.textContent = title;
  card.append(heading, content);
  return card;
}

function transitionTable(events) {
  const transitions = {};
  for (let i = 0; i < events.length - 1; i += 1) {
    if (events[i].trialId !== events[i + 1].trialId) continue;
    const key = `${events[i].value} -> ${events[i + 1].value}`;
    transitions[key] = (transitions[key] || 0) + 1;
  }
  const rows = Object.entries(transitions).sort((a, b) => b[1] - a[1]).slice(0, 8);
  return simpleTable(["Pattern", "Count"], rows, "No transitions yet.");
}

function transitionCounts(events, bucketFn = (event) => event.value) {
  const counts = {};
  for (let i = 0; i < events.length - 1; i += 1) {
    if (events[i].trialId !== events[i + 1].trialId) continue;
    const from = bucketFn(events[i]);
    const to = bucketFn(events[i + 1]);
    if (!counts[from]) counts[from] = {};
    counts[from][to] = (counts[from][to] || 0) + 1;
  }
  return counts;
}

function eventTransitionHeatmap(events) {
  const wrap = document.createElement("div");
  wrap.className = "heatmap-wrap";
  if (events.length < 2) {
    wrap.innerHTML = '<p class="empty">No transitions yet.</p>';
    return wrap;
  }
  const labels = skills.map((skill) => skill.value);
  const counts = transitionCounts(events);
  const max = Math.max(1, ...labels.flatMap((from) => labels.map((to) => counts[from]?.[to] || 0)));
  const table = document.createElement("table");
  table.className = "heatmap-table";
  table.innerHTML = `
    <thead><tr><th>From</th>${labels.map((label) => `<th>${escapeHtml(label)}</th>`).join("")}</tr></thead>
    <tbody>
      ${labels.map((from) => `
        <tr>
          <th>${escapeHtml(from)}</th>
          ${labels.map((to) => {
            const count = counts[from]?.[to] || 0;
            const alpha = count ? 0.18 + (count / max) * 0.72 : 0;
            return `<td style="background:rgba(18,104,179,${alpha})">${count || ""}</td>`;
          }).join("")}
        </tr>
      `).join("")}
    </tbody>
  `;
  wrap.append(table);
  return wrap;
}

function turningPoints(trial) {
  const events = trial.events;
  const points = [];
  if (!events.length) return points;
  const peak = events.reduce((best, event, index) => event.numeric > best.event.numeric ? { event, index } : best, { event: events[0], index: 0 });
  points.push(["Peak intensity", `${peak.event.value} ${peak.event.label} at node ${peak.index + 1}`]);
  const firstHigh = events.findIndex((event) => event.numeric >= 7);
  if (firstHigh >= 0) points.push(["First above 7", `${events[firstHigh].value} ${events[firstHigh].label} at node ${firstHigh + 1}`]);
  const firstReturn = firstHigh >= 0 ? events.findIndex((event, index) => index > firstHigh && event.numeric < 5) : -1;
  if (firstReturn >= 0) points.push(["First return below 5", `${events[firstReturn].value} ${events[firstReturn].label} at node ${firstReturn + 1}`]);
  const biggestJump = biggestShift(events, "up");
  if (biggestJump) points.push(["Biggest escalation", `${formatDelta(biggestJump.delta)} from node ${biggestJump.from + 1} to ${biggestJump.to + 1}`]);
  const biggestDrop = biggestShift(events, "down");
  if (biggestDrop) points.push(["Biggest de-escalation", `${formatDelta(biggestDrop.delta)} from node ${biggestDrop.from + 1} to ${biggestDrop.to + 1}`]);
  const longest = longestIntensityRun(events);
  if (longest.count > 1) points.push(["Longest run", `${longest.band} for ${longest.count} nodes`]);
  return points;
}

function biggestShift(events, direction) {
  let best = null;
  for (let i = 0; i < events.length - 1; i += 1) {
    const delta = events[i + 1].numeric - events[i].numeric;
    if (direction === "up" && delta <= 0) continue;
    if (direction === "down" && delta >= 0) continue;
    if (!best || Math.abs(delta) > Math.abs(best.delta)) best = { delta, from: i, to: i + 1 };
  }
  return best;
}

function longestIntensityRun(events) {
  const runs = buildRuns(events);
  return runs.reduce((best, run) => run.count > best.count ? run : best, { band: "None", count: 0 });
}

function escalationSummary(events, mode) {
  const scores = { participant1: [], participant2: [] };
  events.forEach((event, index) => {
    const next = nextEventsByMode(events, event, index, 3, mode);
    if (!next.length) return;
    const avgNext = averageNumeric(next);
    scores[event.participantKey].push(avgNext - event.numeric);
  });

  const wrap = document.createElement("div");
  wrap.className = "score-list";
  [
    ["Party 1", scores.participant1],
    ["Party 2", scores.participant2]
  ].forEach(([label, values]) => {
    const avg = values.length ? average(values) : 0;
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<span>${label}</span><strong>${formatDelta(avg)}</strong>`;
    wrap.append(row);
  });
  const note = document.createElement("p");
  note.textContent = "Positive means the next 3 relevant presses tend higher; negative means they tend lower.";
  wrap.append(note);
  return wrap;
}

function nextEventsByMode(events, event, index, count, mode) {
  const next = [];
  for (let i = index + 1; i < events.length && next.length < count; i += 1) {
    if (events[i].trialId !== event.trialId) break;
    if (mode === "self" && events[i].participantKey !== event.participantKey) continue;
    if (mode === "other" && events[i].participantKey === event.participantKey) continue;
    next.push(events[i]);
  }
  return next;
}

function responseLagTable(events) {
  const responses = {};
  events.forEach((event, index) => {
    const next = events.slice(index + 1).find((candidate) => {
      return candidate.trialId === event.trialId && candidate.participantKey !== event.participantKey;
    });
    if (!next) return;
    const key = `${participantShort(event.participantKey)} ${event.value} -> ${participantShort(next.participantKey)} ${next.value}`;
    const lag = Math.max(0, new Date(next.timestamp) - new Date(event.timestamp));
    if (!responses[key]) responses[key] = { count: 0, lagTotal: 0 };
    responses[key].count += 1;
    responses[key].lagTotal += lag;
  });
  const rows = Object.entries(responses)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)
    .map(([key, value]) => [key, `${value.count} / ${formatSeconds(value.lagTotal / value.count)}`]);
  return simpleTable(["Immediate Other Response", "Count / Avg"], rows, "No cross-party responses yet.");
}

function triggerTable(events) {
  const triggers = {};
  events.forEach((event, index) => {
    const next = events.slice(index + 1).find((candidate) => {
      return candidate.trialId === event.trialId && candidate.participantKey !== event.participantKey;
    });
    if (!next) return;
    const source = `${participantShort(event.participantKey)} ${event.label}`;
    if (!triggers[source]) triggers[source] = {};
    const target = `${participantShort(next.participantKey)} ${next.label}`;
    triggers[source][target] = (triggers[source][target] || 0) + 1;
  });

  const rows = Object.entries(triggers)
    .map(([source, counts]) => {
      const [target, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      return [source, `${target} (${count})`, count];
    })
    .sort((a, b) => b[2] - a[2])
    .slice(0, 8)
    .map(([source, target]) => [source, target]);
  return simpleTable(["When Used", "Next Other Skill"], rows, "No trigger patterns yet.");
}

function streakSummary(events) {
  const rows = [];
  ["participant1", "participant2"].forEach((participantKey) => {
    const participantEvents = events.filter((event) => event.participantKey === participantKey);
    const runs = buildRuns(participantEvents);
    const longestHigh = longestRun(runs, "High");
    const longestLow = longestRun(runs, "Low");
    const shiftCount = runs.filter((run, index) => index > 0 && run.band !== runs[index - 1].band).length;
    rows.push([participantShort(participantKey), `High ${longestHigh}, Low ${longestLow}`, shiftCount]);
  });
  return simpleTable(["Who", "Longest Runs", "Shifts"], rows, "No streaks yet.");
}

function categoryStreakSummary(events) {
  const rows = [];
  ["participant1", "participant2"].forEach((participantKey) => {
    const participantEvents = events.filter((event) => event.participantKey === participantKey);
    const runs = buildCategoryRuns(participantEvents);
    const longestUp = longestRun(runs, "5 Up");
    const longestDown = longestRun(runs, "5 Down");
    const longestFive = longestRun(runs, "5");
    const shiftCount = runs.filter((run, index) => index > 0 && run.band !== runs[index - 1].band).length;
    rows.push([participantShort(participantKey), `Up ${longestUp}, Alone ${longestFive}, Down ${longestDown}`, shiftCount]);
  });
  return simpleTable(["Who", "Longest Runs", "Shifts"], rows, "No category streaks yet.");
}

function beforeAfterTable(events) {
  const effects = {};
  events.forEach((event, index) => {
    const next = nextEventsInTrial(events, event, index, 3);
    if (!next.length) return;
    const key = `${event.value} ${event.label}`;
    if (!effects[key]) effects[key] = { count: 0, beforeTotal: 0, afterTotal: 0 };
    effects[key].count += 1;
    effects[key].beforeTotal += event.numeric;
    effects[key].afterTotal += averageNumeric(next);
  });

  const rows = Object.entries(effects)
    .map(([skill, value]) => {
      const before = value.beforeTotal / value.count;
      const after = value.afterTotal / value.count;
      return [skill, `${after.toFixed(2)} (${formatDelta(after - before)})`, Math.abs(after - before)];
    })
    .sort((a, b) => b[2] - a[2])
    .slice(0, 8)
    .map(([skill, result]) => [skill, result]);
  return simpleTable(["Skill", "Next 3 Avg"], rows, "No before/after data yet.");
}

function simpleTable(headers, rows, emptyText) {
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = emptyText;
    return empty;
  }
  const table = document.createElement("table");
  table.className = "analysis-table";
  table.innerHTML = `
    <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
  `;
  return table;
}

function nextEventsInTrial(events, event, index, count) {
  const next = [];
  for (let i = index + 1; i < events.length && next.length < count; i += 1) {
    if (events[i].trialId !== event.trialId) break;
    next.push(events[i]);
  }
  return next;
}

function averageNumeric(events) {
  return average(events.map((event) => event.numeric));
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function formatDelta(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

function formatSeconds(ms) {
  if (!Number.isFinite(ms)) return "0s";
  return `${(ms / 1000).toFixed(1)}s`;
}

function participantShort(participantKey) {
  return participantKey === "participant2" ? "P2" : "P1";
}

function intensityBand(event) {
  if (event.numeric >= 7) return "High";
  if (event.numeric <= 4.5) return "Low";
  return "Mid";
}

function buildRuns(events) {
  const runs = [];
  events.forEach((event) => {
    const band = intensityBand(event);
    const last = runs[runs.length - 1];
    if (last && last.band === band) {
      last.count += 1;
    } else {
      runs.push({ band, count: 1 });
    }
  });
  return runs;
}

function buildCategoryRuns(events) {
  const runs = [];
  events.forEach((event) => {
    const band = event.value;
    const last = runs[runs.length - 1];
    if (last && last.band === band) {
      last.count += 1;
    } else {
      runs.push({ band, count: 1 });
    }
  });
  return runs;
}

function longestRun(runs, band) {
  return Math.max(0, ...runs.filter((run) => run.band === band).map((run) => run.count));
}

function renderBarRow(events, p1Events, p2Events) {
  els.barChartRow.innerHTML = "";
  [
    ["Combined", events],
    [els.participantOne.value.trim() || "Party 1", p1Events],
    [els.participantTwo.value.trim() || "Party 2", p2Events]
  ].forEach(([title, panelEvents]) => {
    const panel = document.createElement("div");
    panel.className = "mini-chart";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const chart = document.createElement("div");
    chart.className = "bar-chart";
    panel.append(heading, chart);
    els.barChartRow.append(panel);
    renderBars(panelEvents, chart);
  });
}

function renderBars(events, target) {
  const counts = Object.fromEntries(skills.map((skill) => [skill.value, 0]));
  events.forEach((event) => counts[event.value] += 1);
  const max = Math.max(1, ...Object.values(counts));
  target.innerHTML = "";
  skills.forEach((skill) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${skill.value} ${skill.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(counts[skill.value] / max) * 100}%"></div></div>
      <strong>${counts[skill.value]}</strong>
    `;
    target.append(row);
  });
}

function renderCategoryPieRow(events, p1Events, p2Events) {
  els.categoryPieChartRow.innerHTML = "";
  [
    ["Combined", events],
    [els.participantOne.value.trim() || "Party 1", p1Events],
    [els.participantTwo.value.trim() || "Party 2", p2Events]
  ].forEach(([title, panelEvents]) => {
    const panel = document.createElement("div");
    panel.className = "mini-chart";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const layout = document.createElement("div");
    layout.className = "pie-layout";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "pie-chart");
    svg.setAttribute("viewBox", "0 0 180 180");
    const legend = document.createElement("div");
    legend.className = "pie-legend";
    layout.append(svg, legend);
    panel.append(heading, layout);
    els.categoryPieChartRow.append(panel);
    renderCategoryPie(panelEvents, svg, legend);
  });
}

function renderCategoryBarRow(events, p1Events, p2Events) {
  els.categoryBarChartRow.innerHTML = "";
  [
    ["Combined", events],
    [els.participantOne.value.trim() || "Party 1", p1Events],
    [els.participantTwo.value.trim() || "Party 2", p2Events]
  ].forEach(([title, panelEvents]) => {
    const panel = document.createElement("div");
    panel.className = "mini-chart";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const chart = document.createElement("div");
    chart.className = "bar-chart";
    panel.append(heading, chart);
    els.categoryBarChartRow.append(panel);
    renderCategoryBars(panelEvents, chart);
  });
}

function categoryCounts(events) {
  const counts = { "5 Down": 0, "5 Alone": 0, "5 Up": 0 };
  events.forEach((event) => counts[categoryFor(event)] += 1);
  return counts;
}

function renderCategoryBars(events, target) {
  const counts = categoryCounts(events);
  const max = Math.max(1, ...Object.values(counts));
  target.innerHTML = "";
  fiveCategories.forEach((category, index) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${category.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(counts[category.value] / max) * 100}%; background:${pieColor(index)}"></div></div>
      <strong>${counts[category.value]}</strong>
    `;
    target.append(row);
  });
}

function renderCategoryPie(events, pieChart, pieLegend) {
  const counts = categoryCounts(events);
  const total = events.length;
  pieChart.innerHTML = "";
  pieLegend.innerHTML = "";

  if (!total) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "90");
    circle.setAttribute("cy", "90");
    circle.setAttribute("r", "70");
    circle.setAttribute("fill", "#edf1f5");
    pieChart.append(circle);
    pieLegend.innerHTML = '<p class="empty">No events.</p>';
    return;
  }

  let start = -90;
  fiveCategories.forEach((category, index) => {
    const count = counts[category.value];
    if (!count) return;
    const sweep = (count / total) * 360;
    const color = pieColor(index);
    if (sweep >= 359.99) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "90");
      circle.setAttribute("cy", "90");
      circle.setAttribute("r", "70");
      circle.setAttribute("fill", color);
      pieChart.append(circle);
    } else {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pieSlicePath(90, 90, 70, start, start + sweep));
      path.setAttribute("fill", color);
      pieChart.append(path);
    }
    start += sweep;

    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <span class="legend-swatch" style="background:${color}"></span>
      <span>${category.label}</span>
      <strong>${Math.round((count / total) * 100)}%</strong>
    `;
    pieLegend.append(item);
  });
}

function renderCategoryLine(trials) {
  els.categoryLineChart.innerHTML = "";
  const width = 360;
  const height = 160;
  const pad = 20;
  const sorted = [...trials].sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
  const points = sorted.map((trial, index) => {
    const x = sorted.length === 1 ? width / 2 : pad + (index / (sorted.length - 1)) * (width - pad * 2);
    const avg = trial.events.length ? average(trial.events.map(categoryScoreFor)) : 0;
    const y = height - pad - (avg / 2) * (height - pad * 2);
    return `${x},${y}`;
  });
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "path");
  grid.setAttribute("d", `M${pad},${height - pad}H${width - pad}M${pad},${pad}V${height - pad}`);
  grid.setAttribute("stroke", "#d9e1ea");
  grid.setAttribute("fill", "none");
  els.categoryLineChart.append(grid);

  if (points.length) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", points.join(" "));
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#00856f");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    els.categoryLineChart.append(line);
  }
}

function renderLine(trials) {
  els.lineChart.innerHTML = "";
  const width = 360;
  const height = 160;
  const pad = 20;
  const sorted = [...trials].sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
  const points = sorted.map((trial, index) => {
    const x = sorted.length === 1 ? width / 2 : pad + (index / (sorted.length - 1)) * (width - pad * 2);
    const y = height - pad - (averageFor(trial) / 10) * (height - pad * 2);
    return `${x},${y}`;
  });

  const grid = document.createElementNS("http://www.w3.org/2000/svg", "path");
  grid.setAttribute("d", `M${pad},${height - pad}H${width - pad}M${pad},${pad}V${height - pad}`);
  grid.setAttribute("stroke", "#d9e1ea");
  grid.setAttribute("fill", "none");
  els.lineChart.append(grid);

  if (points.length) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("points", points.join(" "));
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#1268b3");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    els.lineChart.append(line);
  }
}

function renderPieRow(events, p1Events, p2Events) {
  els.pieChartRow.innerHTML = "";
  [
    ["Combined", events],
    [els.participantOne.value.trim() || "Party 1", p1Events],
    [els.participantTwo.value.trim() || "Party 2", p2Events]
  ].forEach(([title, panelEvents]) => {
    const panel = document.createElement("div");
    panel.className = "mini-chart";
    const heading = document.createElement("h3");
    heading.textContent = title;
    const layout = document.createElement("div");
    layout.className = "pie-layout";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "pie-chart");
    svg.setAttribute("viewBox", "0 0 180 180");
    const legend = document.createElement("div");
    legend.className = "pie-legend";
    layout.append(svg, legend);
    panel.append(heading, layout);
    els.pieChartRow.append(panel);
    renderPie(panelEvents, svg, legend);
  });
}

function renderPie(events, pieChart, pieLegend) {
  const counts = Object.fromEntries(skills.map((skill) => [skill.value, 0]));
  events.forEach((event) => counts[event.value] += 1);
  const total = Math.max(0, events.length);
  pieChart.innerHTML = "";
  pieLegend.innerHTML = "";

  if (!total) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "90");
    circle.setAttribute("cy", "90");
    circle.setAttribute("r", "70");
    circle.setAttribute("fill", "#edf1f5");
    pieChart.append(circle);
    pieLegend.innerHTML = '<p class="empty">No events.</p>';
    return;
  }

  let start = -90;
  skills.forEach((skill, index) => {
    const count = counts[skill.value];
    if (!count) return;
    const sweep = (count / total) * 360;
    const color = pieColor(index);
    if (sweep >= 359.99) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "90");
      circle.setAttribute("cy", "90");
      circle.setAttribute("r", "70");
      circle.setAttribute("fill", color);
      pieChart.append(circle);
    } else {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pieSlicePath(90, 90, 70, start, start + sweep));
      path.setAttribute("fill", color);
      pieChart.append(path);
    }
    start += sweep;

    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <span class="legend-swatch" style="background:${color}"></span>
      <span>${skill.value} ${skill.label}</span>
      <strong>${Math.round((count / total) * 100)}%</strong>
    `;
    pieLegend.append(item);
  });
}

function pieSlicePath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z"
  ].join(" ");
}

function polarToCartesian(cx, cy, radius, angle) {
  const radians = (angle - 90) * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
}

function pieColor(index) {
  const colors = ["#4b9cd3", "#2a9d8f", "#8ab17d", "#e9c46a", "#f4a261", "#e76f51", "#d1495b", "#9d4edd", "#577590", "#f77f00", "#006d77", "#b56576", "#6d597a"];
  return colors[index % colors.length];
}

function renderTrials() {
  const trials = completedTrials().sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  els.trialList.innerHTML = "";
  if (!trials.length) {
    els.trialList.innerHTML = '<p class="empty">No completed events yet.</p>';
    return;
  }
  trials.forEach((trial) => els.trialList.append(trialCard(trial, false)));
}

function toggleDescriptions() {
  els.descriptionBox.classList.toggle("hidden");
  renderDescriptionBox();
}

function renderDescriptionBox() {
  els.descriptionBox.innerHTML = skills.map((skill) => {
    return `<p><strong>${escapeHtml(skill.value)} ${escapeHtml(skill.label)}:</strong> ${escapeHtml(skillDescriptions[skill.value])}</p>`;
  }).join("");
}

function renderShared() {
  els.sharedList.innerHTML = "";
  if (!state.shared.length) {
    els.sharedList.innerHTML = '<p class="empty">No events submitted to the shared pool.</p>';
    return;
  }
  state.shared
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .forEach((trial) => els.sharedList.append(trialCard(trial, true)));
}

function renderTools() {
  els.appVersion.textContent = appVersion;
  renderConnectionStatus();
  els.lastSaved.textContent = state.lastSavedAt ? new Date(state.lastSavedAt).toLocaleString() : "Never";
  renderReminderNotes();
}

function renderConnectionStatus() {
  els.connectionStatus.textContent = navigator.onLine ? "Online" : "Offline";
  els.connectionStatus.classList.toggle("score-low", navigator.onLine);
  els.connectionStatus.classList.toggle("score-high", !navigator.onLine);
}

function exportBackup() {
  const backup = {
    app: "!fThen Mobile",
    version: appVersion,
    exportedAt: new Date().toISOString(),
    state
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ifthen-mobile-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const incoming = parsed.state || parsed;
      if (!incoming || !Array.isArray(incoming.trials)) throw new Error("Backup does not contain trials.");
      state.trials = incoming.trials || [];
      state.shared = incoming.shared || [];
      state.recommendedVideos = incoming.recommendedVideos || [];
      activeTrialId = incoming.activeTrialId || null;
      saveState();
      render();
      alert("Backup imported.");
    } catch (error) {
      alert(`Could not import backup: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function clearData() {
  if (!confirm("Clear all local events, shared pool entries, and recommended videos? Export a backup first if you need this data.")) return;
  state.trials = [];
  state.shared = [];
  state.recommendedVideos = [];
  activeTrialId = null;
  saveState();
  render();
}

function loadDemoEvent() {
  const demo = {
    id: uid("trial"),
    client: "Demo Client",
    name: "Demo Event",
    participants: { participant1: "Party 1", participant2: "Party 2" },
    tags: ["demo", "training"],
    outcome: "De-escalated",
    video: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    paused: false,
    submittedAt: null,
    events: []
  };
  [
    ["participant1", skills[4]],
    ["participant2", skills[7]],
    ["participant1", skills[5]],
    ["participant2", skills[8]],
    ["participant1", skills[3]],
    ["participant2", skills[4]],
    ["participant1", skills[1]]
  ].forEach(([participantKey, skill], index) => {
    demo.events.push({
      id: uid("event"),
      sequenceNumber: index + 1,
      value: skill.value,
      numeric: skill.numeric,
      label: skill.label,
      participantKey,
      participantName: demo.participants[participantKey],
      timestamp: new Date(Date.now() + index * 1000).toISOString()
    });
  });
  state.trials.push(demo);
  saveState();
  render();
}

function renderReminderNotes() {
  const notes = [
    "r1: Define the final description/rules text for every skill button.",
    "r4: Decide how recommended videos should be curated or imported.",
    "r5: Define exact redundancy rules for comparing multiple scorers on the same video.",
    "r7: Choose where the PWA files will be hosted for iPhone install/update."
  ];
  els.reminderNotes.innerHTML = notes.map((note) => `<p>${escapeHtml(note)}</p>`).join("");
}

function creatorTrial() {
  return activeTrial() || [...completedTrials()].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0] || null;
}

function renderCreator() {
  const trial = creatorTrial();
  const events = trial?.events || [];
  els.creatorNodes.textContent = events.length;
  els.creatorAverage.textContent = averageEvents(events).toFixed(2);
  els.creatorPeak.textContent = peakFor(events) === null ? "None" : peakFor(events);
  els.creatorMode.textContent = modeFor(events);
  renderLiveTimeline(trial, els.creatorTimeline);
  renderBars(events, els.creatorBars);
  renderPie(events, els.creatorPie, els.creatorPieLegend);
  renderRecommendedVideos();
  renderRedundancyReview();
}

function renderLiveTimeline(trial, target) {
  target.innerHTML = "";
  const events = trial?.events || [];
  const p1Name = trial?.participants?.participant1 || "Party 1";
  const p2Name = trial?.participants?.participant2 || "Party 2";
  const p1Avatar = avatarNode(p1Name, "p1");
  const p2Avatar = avatarNode(p2Name, "p2");
  target.append(p1Avatar, p2Avatar);
  const width = Math.max(720, events.length * 56 + 160);
  const height = 260;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("class", "creator-svg");
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "path");
  grid.setAttribute("d", `M70,25V225M70,225H${width - 28}`);
  grid.setAttribute("stroke", "#d9e1ea");
  grid.setAttribute("fill", "none");
  svg.append(grid);
  events.forEach((event, index) => {
    const x = 90 + index * 56;
    const y = 225 - (event.numeric / 10) * 200;
    const color = (event.participantKey || "participant1") === "participant2" ? "#00856f" : "#1268b3";
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "13");
    circle.setAttribute("fill", color);
    svg.append(circle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 4);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "11");
    text.setAttribute("font-weight", "800");
    text.setAttribute("fill", "#fff");
    text.textContent = event.value;
    svg.append(text);
  });
  target.append(svg);
  target.scrollLeft = target.scrollWidth;
}

function avatarNode(label, partyClass) {
  const node = document.createElement("div");
  node.className = `creator-avatar ${partyClass}`;
  node.textContent = label.slice(0, 2).toUpperCase();
  return node;
}

function renderRecommendedVideos() {
  const videos = state.recommendedVideos || [];
  els.recommendedVideos.innerHTML = "";
  if (!videos.length) {
    els.recommendedVideos.innerHTML = '<p class="empty">No recommended videos yet.</p>';
    return;
  }
  videos.slice().reverse().forEach((video) => {
    const card = document.createElement("article");
    card.className = "trial-card";
    card.innerHTML = `<h3>${escapeHtml(video.title)}</h3><p>${escapeHtml(video.url)}</p>`;
    const use = document.createElement("button");
    use.className = "secondary";
    use.type = "button";
    use.textContent = "Use Video";
    use.addEventListener("click", () => {
      els.videoUrl.value = video.url;
      renderVideoEmbed();
      saveVideoMeta();
    });
    card.append(use);
    els.recommendedVideos.append(card);
  });
}

function renderRedundancyReview() {
  els.redundancyReview.innerHTML = "";
  const grouped = {};
  completedTrials().forEach((trial) => {
    const url = trial.video?.url;
    if (!url) return;
    if (!grouped[url]) grouped[url] = [];
    grouped[url].push(trial);
  });
  const rows = Object.entries(grouped)
    .filter(([, trials]) => trials.length > 1)
    .map(([url, trials]) => {
      const averages = trials.map((trial) => averageFor(trial));
      const spread = Math.max(...averages) - Math.min(...averages);
      return [url, `${trials.length} scores`, `avg spread ${spread.toFixed(2)}`];
    });
  els.redundancyReview.append(simpleTable(["Video", "Redundancy", "Agreement"], rows, "Score the same video more than once to compare redundancy."));
}

function renderParticipants() {
  const profiles = participantProfiles();
  syncParticipantSelect(els.profileSelect, profiles, 0);
  syncParticipantSelect(els.compareA, profiles, 0);
  syncParticipantSelect(els.compareB, profiles, 1);
  renderProfileDashboard(profiles);
  renderCompareDashboard(profiles);
}

function participantProfiles() {
  const profiles = {};
  sortedEvents(completedTrials()).forEach((event) => {
    const name = event.participantName || participantShort(event.participantKey);
    if (!profiles[name]) profiles[name] = { name, events: [], trials: new Set() };
    profiles[name].events.push(event);
    profiles[name].trials.add(event.trialId);
  });
  return Object.values(profiles).sort((a, b) => a.name.localeCompare(b.name));
}

function syncParticipantSelect(select, profiles, fallbackIndex) {
  const selected = select.value;
  select.innerHTML = "";
  if (!profiles.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No parties";
    select.append(option);
    return;
  }
  profiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.name;
    option.textContent = profile.name;
    select.append(option);
  });
  select.value = profiles.some((profile) => profile.name === selected)
    ? selected
    : profiles[Math.min(fallbackIndex, profiles.length - 1)].name;
}

function renderProfileDashboard(profiles) {
  els.profileDashboard.innerHTML = "";
  const profile = profiles.find((item) => item.name === els.profileSelect.value);
  if (!profile) {
    els.profileDashboard.innerHTML = '<p class="empty">Complete an event to create party profiles.</p>';
    return;
  }
  els.profileDashboard.append(profileSummary(profile));
  els.profileDashboard.append(profileCharts(profile));
}

function renderCompareDashboard(profiles) {
  els.compareDashboard.innerHTML = "";
  const first = profiles.find((item) => item.name === els.compareA.value);
  const second = profiles.find((item) => item.name === els.compareB.value);
  if (!first || !second) return;
  const row = document.createElement("div");
  row.className = "comparison-row";
  row.append(comparePanel(first), comparePanel(second));
  els.compareDashboard.append(row);
}

function profileSummary(profile) {
  const wrap = document.createElement("div");
  wrap.className = "profile-summary";
  [
    ["Events", profile.trials.size],
    ["Nodes", profile.events.length],
    ["Avg", profile.events.length ? average(profile.events.map((event) => event.numeric)).toFixed(2) : "0.00"],
    ["Floor", floorFor(profile.events) === null ? "None" : floorFor(profile.events)],
    ["Mode", modeFor(profile.events)],
    ["5's Mode", categoryModeFor(profile.events)]
  ].forEach(([label, value]) => {
    const metric = document.createElement("div");
    metric.className = "metric";
    metric.innerHTML = `<span>${label}</span><strong>${escapeHtml(value)}</strong>`;
    wrap.append(metric);
  });
  return wrap;
}

function profileCharts(profile) {
  const row = document.createElement("div");
  row.className = "chart-row";
  row.append(profilePiePanel("Skills", profile.events));
  row.append(profileBarPanel("Skill Totals", profile.events));
  row.append(profileCategoryPanel("5's", profile.events));
  return row;
}

function profilePiePanel(title, events) {
  const panel = document.createElement("div");
  panel.className = "mini-chart";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const layout = document.createElement("div");
  layout.className = "pie-layout";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "pie-chart");
  svg.setAttribute("viewBox", "0 0 180 180");
  const legend = document.createElement("div");
  legend.className = "pie-legend";
  layout.append(svg, legend);
  panel.append(heading, layout);
  renderPie(events, svg, legend);
  return panel;
}

function profileBarPanel(title, events) {
  const panel = document.createElement("div");
  panel.className = "mini-chart";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const chart = document.createElement("div");
  chart.className = "bar-chart";
  panel.append(heading, chart);
  renderBars(events, chart);
  return panel;
}

function profileCategoryPanel(title, events) {
  const panel = document.createElement("div");
  panel.className = "mini-chart";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const chart = document.createElement("div");
  chart.className = "bar-chart";
  panel.append(heading, chart);
  renderCategoryBars(events, chart);
  return panel;
}

function comparePanel(profile) {
  const panel = document.createElement("div");
  panel.className = "comparison-panel";
  const avg = profile.events.length ? average(profile.events.map((event) => event.numeric)).toFixed(2) : "0.00";
  panel.innerHTML = `<h3>${escapeHtml(profile.name)}</h3>`;
  panel.append(simpleTable(
    ["Metric", "Value"],
    [
      ["Events", profile.trials.size],
      ["Nodes", profile.events.length],
      ["Average", avg],
      ["Floor", floorFor(profile.events) === null ? "None" : floorFor(profile.events)],
      ["Skill Mode", modeFor(profile.events)],
      ["5's Mode", categoryModeFor(profile.events)]
    ],
    "No data."
  ));
  panel.append(profileBarPanel("Skill Totals", profile.events));
  panel.append(profileCategoryPanel("5's Totals", profile.events));
  return panel;
}

function trialCard(trial, shared) {
  const card = document.createElement("article");
  card.className = "trial-card";
  const date = new Date(trial.startedAt).toLocaleString();
  const p1Name = trial.participants?.participant1 || "Party 1";
  const p2Name = trial.participants?.participant2 || "Party 2";
  card.innerHTML = `
    <header>
      <div>
        <h3>${escapeHtml(trial.name)}</h3>
        <p>${escapeHtml(trial.client)} - ${date}</p>
      </div>
      <strong>${trial.events.length}</strong>
    </header>
    <p>Average ${averageFor(trial).toFixed(2)} - Mode ${modeFor(trial.events)}</p>
    <p>Date ${escapeHtml(trial.eventDate || "Not set")} - Time ${escapeHtml(trial.eventTime || "Not set")}</p>
    <p>Outcome ${escapeHtml(trial.outcome || "Not set")} - Tags ${escapeHtml(tagText(trial.tags))}</p>
    <p>Video ${trial.video?.url ? `<a href="${escapeHtml(trial.video.url)}" target="_blank" rel="noreferrer">${escapeHtml(trial.video.url)}</a>` : "None"}</p>
    <div class="sequence-legend">
      <span style="--dot:#1268b3">${escapeHtml(p1Name)}</span>
      <span style="--dot:#00856f">${escapeHtml(p2Name)}</span>
    </div>
  `;
  card.append(eventSummaryDropdown(trial));
  card.append(scrollWrap(sequenceChart(trial)));
  const categoryLabel = document.createElement("p");
  categoryLabel.textContent = "5's sequence";
  card.append(categoryLabel);
  card.append(scrollWrap(categorySequenceChart(trial)));
  if (!shared) {
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const submit = document.createElement("button");
    submit.className = "secondary";
    submit.type = "button";
    submit.textContent = trial.submittedAt ? "Submitted" : "Submit Shared";
    submit.disabled = Boolean(trial.submittedAt);
    submit.addEventListener("click", () => submitTrial(trial.id));
    const remove = document.createElement("button");
    remove.className = "danger";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteCompletedTrial(trial.id));
    actions.append(submit, remove);
    card.append(actions);
  }
  return card;
}

function eventSummaryDropdown(trial) {
  const details = document.createElement("details");
  details.className = "event-summary";
  const summary = document.createElement("summary");
  summary.textContent = "Event Summary";
  const events = trial.events;
  const p1Events = events.filter((event) => (event.participantKey || "participant1") === "participant1");
  const p2Events = events.filter((event) => (event.participantKey || "participant1") === "participant2");
  const body = document.createElement("div");
  body.className = "event-summary-body";
  body.append(eventReportCard(trial));
  body.append(simpleTable(
    ["Metric", "Value"],
    [
      ["Nodes", events.length],
      ["Average", averageEvents(events).toFixed(2)],
      ["Floor", floorFor(events) === null ? "None" : floorFor(events)],
      ["Mode", modeFor(events)],
      ["5's Mode", categoryModeFor(events)],
      ["P1 Avg/Floor", `${averageEvents(p1Events).toFixed(2)} / ${floorFor(p1Events) === null ? "None" : floorFor(p1Events)}`],
      ["P2 Avg/Floor", `${averageEvents(p2Events).toFixed(2)} / ${floorFor(p2Events) === null ? "None" : floorFor(p2Events)}`]
    ],
    "No data."
  ));
  const turningHeading = document.createElement("h4");
  turningHeading.textContent = "Turning Points";
  body.append(turningHeading);
  body.append(simpleTable(["Point", "Detected"], turningPoints(trial), "No turning points yet."));
  const heatmapHeading = document.createElement("h4");
  heatmapHeading.textContent = "Transition Heat Map";
  body.append(heatmapHeading);
  body.append(eventTransitionHeatmap(sortedEvents([trial])));
  details.append(summary, body);
  return details;
}

function eventReportCard(trial) {
  const events = trial.events;
  const p1Events = events.filter((event) => (event.participantKey || "participant1") === "participant1");
  const p2Events = events.filter((event) => (event.participantKey || "participant1") === "participant2");
  const card = document.createElement("div");
  card.className = "report-card";
  const rows = [
      ["Outcome", trial.outcome || "Not set"],
      ["Tags", tagText(trial.tags)],
      ["Date", trial.eventDate || "Not set"],
      ["Time", trial.eventTime || "Not set"],
    ["Nodes", events.length],
    ["Average", averageEvents(events).toFixed(2)],
    ["Floor", floorFor(events) === null ? "None" : floorFor(events)],
    ["Peak", peakFor(events) === null ? "None" : peakFor(events)],
    ["Mode", modeFor(events)],
    ["P1 Avg", averageEvents(p1Events).toFixed(2)],
    ["P2 Avg", averageEvents(p2Events).toFixed(2)],
    ["Most Common Transition", topTransition(sortedEvents([trial]))]
  ];
  rows.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "report-item";
    item.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
    card.append(item);
  });
  return card;
}

function topTransition(events) {
  const counts = {};
  for (let i = 0; i < events.length - 1; i += 1) {
    if (events[i].trialId !== events[i + 1].trialId) continue;
    const key = `${events[i].value} -> ${events[i + 1].value}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top ? `${top[0]} (${top[1]})` : "None";
}

function scrollWrap(element) {
  const wrap = document.createElement("div");
  wrap.className = "timeline-scroll";
  wrap.append(element);
  return wrap;
}

function categorySequenceChart(trial) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "sequence-chart");
  svg.setAttribute("viewBox", "0 0 760 150");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Order of 5's party button presses");

  const events = trial.events;
  const padX = 24;
  const top = 20;
  const bottom = 124;
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "path");
  grid.setAttribute("d", `M${padX},${bottom}H736M${padX},${top}V${bottom}`);
  grid.setAttribute("stroke", "#d9e1ea");
  grid.setAttribute("fill", "none");
  svg.append(grid);

  if (!events.length) return svg;

  const points = events.map((event, index) => {
    const x = events.length === 1 ? 380 : padX + (index / (events.length - 1)) * (736 - padX);
    const y = bottom - (categoryScoreFor(event) / 2) * (bottom - top);
    return { x, y, event };
  });

  addPolyline(svg, points.map((point) => `${point.x},${point.y}`).join(" "), "#687383");

  points.forEach((point) => {
    const participantKey = point.event.participantKey || "participant1";
    const color = participantKey === "participant2" ? "#00856f" : "#1268b3";
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);
    svg.append(circle);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", point.x);
    label.setAttribute("y", Math.max(12, point.y - 9));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "9");
    label.setAttribute("font-weight", "700");
    label.setAttribute("fill", "#17202a");
    label.textContent = categoryFor(point.event).replace("5 ", "");
    svg.append(label);
  });

  return svg;
}

function sequenceChart(trial) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "sequence-chart");
  svg.setAttribute("viewBox", "0 0 760 150");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Order of party button presses");

  const events = trial.events;
  const padX = 24;
  const top = 20;
  const bottom = 124;
  const grid = document.createElementNS("http://www.w3.org/2000/svg", "path");
  grid.setAttribute("d", `M${padX},${bottom}H736M${padX},${top}V${bottom}`);
  grid.setAttribute("stroke", "#d9e1ea");
  grid.setAttribute("fill", "none");
  svg.append(grid);

  if (!events.length) return svg;

  const points = events.map((event, index) => {
    const x = events.length === 1 ? 380 : padX + (index / (events.length - 1)) * (736 - padX);
    const y = bottom - (event.numeric / 10) * (bottom - top);
    return { x, y, event };
  });

  addPolyline(svg, points.map((point) => `${point.x},${point.y}`).join(" "), "#687383");

  const p1Path = points
    .filter((point) => (point.event.participantKey || "participant1") === "participant1")
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  const p2Path = points
    .filter((point) => (point.event.participantKey || "participant1") === "participant2")
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  addPolyline(svg, p1Path, "#1268b3");
  addPolyline(svg, p2Path, "#00856f");

  points.forEach((point) => {
    const participantKey = point.event.participantKey || "participant1";
    const color = participantKey === "participant2" ? "#00856f" : "#1268b3";
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);
    svg.append(circle);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", point.x);
    label.setAttribute("y", Math.max(12, point.y - 9));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "10");
    label.setAttribute("font-weight", "700");
    label.setAttribute("fill", "#17202a");
    label.textContent = point.event.value;
    svg.append(label);
  });

  return svg;
}

function addPolyline(svg, points, color) {
  if (!points) return;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  line.setAttribute("points", points);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", "2");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("stroke-linejoin", "round");
  line.setAttribute("opacity", "0.55");
  svg.append(line);
}

function submitTrial(id) {
  const trial = state.trials.find((item) => item.id === id);
  if (!trial) return;
  trial.submittedAt = new Date().toISOString();
  state.shared.push({ ...trial, events: [...trial.events] });
  saveState();
  render();
}

function deleteCompletedTrial(id) {
  const trial = state.trials.find((item) => item.id === id);
  if (!trial) return;
  if (!confirm(`Delete completed event "${trial.name}"?`)) return;
  state.trials = state.trials.filter((item) => item.id !== id);
  saveState();
  render();
}

function exportCsv() {
  const rows = completedTrials().map((trial) => {
    const counts = countsFor(trial);
    const categories = categoryCounts(trial.events);
    const row = {
      client: trial.client,
      event: trial.name,
      startedAt: trial.startedAt,
      endedAt: trial.endedAt,
      nodes: trial.events.length,
      averageScore: averageFor(trial).toFixed(2),
      mode: modeFor(trial.events),
      tags: tagText(trial.tags),
      outcome: trial.outcome || "",
      videoUrl: trial.video?.url || "",
      eventDate: trial.eventDate || "",
      eventTime: trial.eventTime || "",
      submittedToShared: trial.submittedAt ? "yes" : "no"
    };
    row["5 Down"] = categories["5 Down"];
    row["5 Alone"] = categories["5 Alone"];
    row["5 Up"] = categories["5 Up"];
    row.party1 = trial.participants?.participant1 || "Party 1";
    row.party2 = trial.participants?.participant2 || "Party 2";
    const p1Categories = categoryCounts(trial.events.filter((event) => (event.participantKey || "participant1") === "participant1"));
    const p2Categories = categoryCounts(trial.events.filter((event) => (event.participantKey || "participant1") === "participant2"));
    row["P1 5 Down"] = p1Categories["5 Down"];
    row["P1 5 Alone"] = p1Categories["5 Alone"];
    row["P1 5 Up"] = p1Categories["5 Up"];
    row["P2 5 Down"] = p2Categories["5 Down"];
    row["P2 5 Alone"] = p2Categories["5 Alone"];
    row["P2 5 Up"] = p2Categories["5 Up"];
    skills.forEach((skill) => {
      row[`${skill.value} ${skill.label}`] = counts[skill.value];
      row[`P1 ${skill.value} ${skill.label}`] = countsForParticipant(trial, "participant1")[skill.value];
      row[`P2 ${skill.value} ${skill.label}`] = countsForParticipant(trial, "participant2")[skill.value];
    });
    return row;
  });

  if (!rows.length) {
    alert("No completed events to export.");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")]
    .concat(rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "trial-summaries.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function switchTab(tabName) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  document.querySelector("#summaryPanel").classList.toggle("hidden", tabName !== "summary");
  document.querySelector("#trialsPanel").classList.toggle("hidden", tabName !== "trials");
  document.querySelector("#creatorPanel").classList.toggle("hidden", tabName !== "creator");
  document.querySelector("#participantsPanel").classList.toggle("hidden", tabName !== "participants");
  document.querySelector("#toolsPanel").classList.toggle("hidden", tabName !== "tools");
  document.querySelector("#sharedPanel").classList.toggle("hidden", tabName !== "shared");
}

function setupFilters() {
  skills.forEach((skill) => {
    const option = document.createElement("option");
    option.value = skill.value;
    option.textContent = `${skill.value} ${skill.label}`;
    els.buttonFilter.append(option);
  });
}

function render() {
  renderStatus();
  renderButtons();
  renderDashboard();
  renderTrials();
  renderCreator();
  renderParticipants();
  renderTools();
  renderShared();
}

els.startTrial.addEventListener("click", startTrial);
els.pauseTrial.addEventListener("click", togglePauseTrial);
els.endTrial.addEventListener("click", requestFinishTrial);
els.deleteTrial.addEventListener("click", deleteActiveTrial);
els.openTagPicker.addEventListener("click", () => openTagModal(false));
els.closeTagModal.addEventListener("click", closeOrFinishTagModal);
els.saveTags.addEventListener("click", saveSelectedTags);
els.finishFromTags.addEventListener("click", finishAfterTags);
els.descriptionToggle.addEventListener("click", toggleDescriptions);
els.exportCsv.addEventListener("click", exportCsv);
els.saveVideoMeta.addEventListener("click", saveVideoMeta);
els.addRecommendedVideo.addEventListener("click", addRecommendedVideo);
els.openOverlay.addEventListener("click", openOverlay);
els.renderEmbed.addEventListener("click", renderVideoEmbed);
els.exportBackup.addEventListener("click", exportBackup);
els.importBackup.addEventListener("change", importBackup);
els.loadDemo.addEventListener("click", loadDemoEvent);
els.clearData.addEventListener("click", clearData);
window.addEventListener("online", renderConnectionStatus);
window.addEventListener("offline", renderConnectionStatus);
els.dateFilter.addEventListener("change", renderDashboard);
els.buttonFilter.addEventListener("change", renderDashboard);
els.profileSelect.addEventListener("change", renderParticipants);
els.compareA.addEventListener("change", renderParticipants);
els.compareB.addEventListener("change", renderParticipants);
document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));

registerServiceWorker();

setupFilters();
renderTagGrid();
render();

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  let waitingWorker = null;
  navigator.serviceWorker.register("./service-worker.js").then((registration) => {
    if (registration.waiting) {
      showUpdateToast(registration.waiting);
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          showUpdateToast(newWorker);
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });

  function showUpdateToast(worker) {
    waitingWorker = worker;
    els.updateToast.classList.remove("hidden");
  }

  els.reloadApp.addEventListener("click", () => {
    if (waitingWorker) {
      waitingWorker.postMessage("SKIP_WAITING");
    } else {
      window.location.reload();
    }
  });
}
