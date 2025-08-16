import React, { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "../../../core/api/trpc";
import FormModal from "../../../presentation/components/FormModal";
import { COLORS } from "../../../core/constants/palette";

/** helpers */
const sanitizeUsername = (v: string) => v.replace(/[<>&"'`]/g, "");
const validateUsername = (v: string) => {
  if (v.trim().length < 3) return "Must be at least 3 characters";
  if (v.trim().length > 20) return "Must be at most 20 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(v)) return "Only letters, numbers, and underscore are allowed";
  return null;
};

const sanitizeTeam = (v: string) => v.replace(/[<>&"'`]/g, ""); // allow spaces
const validateTeam = (v: string) => {
  const t = v.trim();
  if (t.length < 3) return "Must be at least 3 characters";
  if (t.length > 40) return "Must be at most 40 characters";
  return null;
};

type Step = "HIDDEN" | "USERNAME" | "TEAM_NAME" | "CREATING" | "BUDGET";

/** simple budget animation */
function useCounter(to: number, durationMs = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.floor(to * (1 - Math.pow(1 - t, 3)))); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);
  return value;
}

export default function OnboardingGate() {
  // queries & mutations
  const utils = trpc.useUtils();
  const me = trpc.identity.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const setUsername = trpc.identity.setUsername.useMutation();
  const requestCreate = trpc.team.requestCreate.useMutation();

  // poll job status only when needed
  const jobStatus = trpc.team.jobStatus.useQuery(undefined, {
    enabled: false,
    refetchInterval: 1000,
  });

  /** derive initial step from server */
  const initialStep: Step = useMemo(() => {
    const u = me.data?.user;
    const team = me.data?.team;
    const job = me.data?.job;
    if (!u) return "HIDDEN";
    if (u.onboardingStep === "NEED_USERNAME" || !u.username) return "USERNAME";
    if (!team && (!job || job.status === "failed")) return "TEAM_NAME";
    if (!team && job && (job.status === "queued" || job.status === "running")) return "CREATING";
    return "HIDDEN";
  }, [me.data]);

  const [step, setStep] = useState<Step>("HIDDEN");
  const [teamNameDraft, setTeamNameDraft] = useState("");

  useEffect(() => setStep(initialStep), [initialStep]);

  // ----- STEP: USERNAME -----
  const handleSetUsername = async (username: string) => {
    await setUsername.mutateAsync({ username });
    await utils.identity.me.invalidate();
    setStep("TEAM_NAME");
  };

  // ----- STEP: TEAM NAME -----
  const handleRequestTeam = async (name: string) => {
    setTeamNameDraft(name);
    await requestCreate.mutateAsync({ teamName: name });
    // start polling job
    jobStatus.refetch(); // first hit
    jobStatus.refetchInterval = 1000 as any;
    setStep("CREATING");
  };

  // ----- STEP: CREATING (progress simulation + polling) -----
  // Fake progress while we poll job status
  const [progress, setProgress] = useState(5);
  const doneOnce = useRef(false);

  useEffect(() => {
    if (step !== "CREATING") return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setProgress((p) => Math.min(97, p + dt * 0.03)); // creep towards 97%
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  useEffect(() => {
    if (step !== "CREATING") return;

    const unsub = setInterval(async () => {
      const r = await jobStatus.refetch();
      const s = r.data?.status;
      if ((s === "done" || s === "failed") && !doneOnce.current) {
        doneOnce.current = true;
        // finalize
        await utils.identity.me.invalidate();
        if (s === "done") {
          setProgress(100);
          // small pause then budget step
          setTimeout(() => setStep("BUDGET"), 500);
        } else {
          // failed case: return to TEAM_NAME
          setStep("TEAM_NAME");
        }
      }
    }, 900);

    return () => clearInterval(unsub);
  }, [step, jobStatus, utils]);

  // ----- STEP: BUDGET -----
  const budgetCents = me.data?.team?.budgetCents ?? 500000000; // fallback
  const target = Math.floor(budgetCents / 100);
  const counter = useCounter(target, 1600);

  const finish = async () => {
    await utils.identity.me.invalidate();
    setStep("HIDDEN");
  };

  // Render nothing if not gating
  if (step === "HIDDEN") return null;

  // USERNAME
  if (step === "USERNAME") {
    return (
      <FormModal
        open
        title="Choose your username"
        label="Username"
        placeholder="e.g. enes_celebi"
        primaryText="Continue"
        onPrimary={handleSetUsername}
        validate={validateUsername}
        sanitize={sanitizeUsername}
        busy={setUsername.isPending}
        loadingText="Saving…"
      />
    );
  }

  // TEAM NAME
  if (step === "TEAM_NAME") {
    return (
      <FormModal
        open
        title="Name your team"
        label="Team name"
        placeholder="e.g. Galata Wonders"
        primaryText="Create team"
        onPrimary={handleRequestTeam}
        validate={validateTeam}
        sanitize={sanitizeTeam}
        busy={requestCreate.isPending}
        loadingText="Starting…"
      />
    );
  }

  // CREATING
  if (step === "CREATING") {
    return (
      <FormModal
        open
        title="Creating your team"
        primaryText="Continue"
        inputAllowed={false}
        onPrimary={() => {}}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-gray-700">Populating players for <b>{teamNameDraft}</b>…</div>
          <div className="w-full max-w-lg h-3 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${Math.floor(progress)}%`,
                background: COLORS.primary,
                transition: "width .2s linear",
              }}
            />
          </div>
          <div className="text-sm text-gray-600">{Math.floor(progress)}%</div>
          <div className="text-xs text-gray-400">(This may take a few seconds)</div>
        </div>
      </FormModal>
    );
  }

  // BUDGET
  if (step === "BUDGET") {
    return (
      <FormModal
        open
        title="Starting Budget"
        primaryText="Start managing!"
        onPrimary={finish}
        inputAllowed={false}
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="text-5xl font-bold" style={{ color: COLORS.primary }}>
            ${counter.toLocaleString()}
          </div>
          <div className="text-gray-600">This is your initial transfer budget.</div>
        </div>
      </FormModal>
    );
  }

  return null;
}
