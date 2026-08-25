"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cat, PawPrint, type LucideIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  motionValue,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface CatItem {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  shape: "cat" | "paw";
  flip: boolean;
}

const DESKTOP_CAT_COUNT = 55;
const MOBILE_CAT_COUNT = 18;
const DESKTOP_SPARKLE_COUNT = 45;
const MOBILE_SPARKLE_COUNT = 12;
const PROXIMITY_RADIUS = 260;

const glowBlobs = [
  {
    top: "10%",
    left: "20%",
    duration: 18,
    delay: 0,
    color: "rgba(168, 85, 247, 0.12)",
  },
  {
    top: "60%",
    left: "70%",
    duration: 22,
    delay: 3,
    color: "rgba(107, 33, 168, 0.15)",
  },
  {
    top: "30%",
    left: "50%",
    duration: 20,
    delay: 6,
    color: "rgba(168, 85, 247, 0.08)",
  },
];

function generateCats(count: number): CatItem[] {
  const items: CatItem[] = [];
  const shapes: ("cat" | "paw")[] = ["cat", "paw", "paw"];

  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      left: Math.random() * 96,
      top: Math.random() * 96,
      size: 24 + Math.random() * 60,
      duration: 35 + Math.random() * 55,
      delay: Math.random() * -60,
      rotate: -15 + Math.random() * 30,
      shape: shapes[i % 3],
      flip: Math.random() > 0.5,
    });
  }

  return items;
}

interface Sparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

function generateSparkles(count: number): Sparkle[] {
  const items: Sparkle[] = [];

  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 6,
    });
  }

  return items;
}

type PawIconElement =
  | {
      type: "circle";
      cx: number;
      cy: number;
      r: number;
    }
  | {
      type: "path";
      d: string;
    };

const pawIcon: {
  viewBox: string;
  elements: PawIconElement[];
} = {
  viewBox: "0 0 24 24",
  elements: [
    { type: "circle", cx: 11, cy: 4, r: 2 },
    { type: "circle", cx: 18, cy: 8, r: 2 },
    { type: "circle", cx: 20, cy: 16, r: 2 },
    {
      type: "path",
      d: "M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z",
    },
  ],
};

function CatSprite({ cat, glow }: { cat: CatItem; glow: MotionValue<number> }) {
  const Icon: LucideIcon = cat.shape === "cat" ? Cat : PawPrint;

  const randomGlow = useMemo(
    () => ({
      delay: Math.random() * 8,
      duration: 3 + Math.random() * 4,
      repeatDelay: 4 + Math.random() * 10,
    }),
    [],
  );

  const cursorDropShadow = useTransform(
    glow,
    [0, 1],
    [
      "drop-shadow(0 0 0px rgba(196,132,252,0))",
      "drop-shadow(0 0 14px rgba(196,132,252,0.9))",
    ],
  );

  const cursorScale = useTransform(glow, [0, 1], [1, 1.3]);

  return (
    <motion.div
      className="absolute"
      style={{
        width: cat.size,
        height: cat.size,
        rotate: cat.rotate,
        scaleX: cat.flip ? -1 : 1,
        scale: cursorScale,
        filter: cursorDropShadow,
      }}
      animate={{
        y: [0, -40, 0],
        x: [0, 10, -10, 0],
        rotate: [cat.rotate, cat.rotate - 5, cat.rotate + 5, cat.rotate],
      }}
      transition={{
        duration: cat.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: cat.delay,
      }}
    >
      <div className="absolute inset-0 text-accent-deep opacity-[0.09]">
        <Icon className="h-full w-full" strokeWidth={1.6} />
      </div>

      <motion.div
        className="absolute inset-[-25%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(216,180,254,0.55) 0%, rgba(168,85,247,0.25) 35%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={{
          opacity: [0, 0, 0.8, 1, 0, 0, 0],
          scale: [0.8, 0.8, 1, 1.15, 0.8, 0.8, 0.8],
        }}
        transition={{
          duration: randomGlow.duration,
          delay: randomGlow.delay,
          repeat: Infinity,
          repeatDelay: randomGlow.repeatDelay,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          color: "rgb(216,180,254)",
        }}
        animate={{
          opacity: [0, 0, 0.8, 0.95, 0, 0, 0],
        }}
        transition={{
          duration: randomGlow.duration,
          delay: randomGlow.delay,
          repeat: Infinity,
          repeatDelay: randomGlow.repeatDelay,
          ease: "easeInOut",
        }}
      >
        <Icon className="h-full w-full" strokeWidth={1.6} />
      </motion.div>
    </motion.div>
  );
}

function SparkleLayer({ mobile }: { mobile: boolean }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(
      generateSparkles(mobile ? MOBILE_SPARKLE_COUNT : DESKTOP_SPARKLE_COUNT),
    );
  }, [mobile]);

  return (
    <>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
            background: "rgb(232,121,249)",
            boxShadow: mobile ? undefined : "0 0 6px 1px rgba(232,121,249,0.8)",
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.6, 1.2, 0.6],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay,
          }}
        />
      ))}
    </>
  );
}

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  rotate: number;
}

function usePawTrail(enabled: boolean) {
  const [points, setPoints] = useState<TrailPoint[]>([]);
  const lastPos = useRef({ x: -1000, y: -1000 });
  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removalTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function clearTrail() {
      setPoints([]);
    }

    function resetInactivityTimer() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(clearTrail, 3000);
    }

    function stamp(x: number, y: number) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;

      if (Math.hypot(dx, dy) < 55) {
        return;
      }

      resetInactivityTimer();

      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 30;

      lastPos.current = { x, y };

      const id = idRef.current++;

      setPoints((previous) => [
        ...previous.slice(-8),
        {
          id,
          x,
          y,
          rotate: angle,
        },
      ]);

      const timeout = setTimeout(() => {
        removalTimeouts.current.delete(timeout);

        setPoints((previous) => previous.filter((point) => point.id !== id));
      }, 900);

      removalTimeouts.current.add(timeout);
    }

    function onMouseMove(event: MouseEvent) {
      stamp(event.clientX, event.clientY);
    }

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      for (const timeout of removalTimeouts.current) {
        clearTimeout(timeout);
      }

      removalTimeouts.current.clear();
    };
  }, [enabled]);

  return points;
}

function CatBackgroundContent() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const cats = useMemo(
    () => generateCats(mobile ? MOBILE_CAT_COUNT : DESKTOP_CAT_COUNT),
    [mobile],
  );

  const catGlows = useMemo(() => cats.map(() => motionValue(0)), [cats]);

  const catRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pawPoints = usePawTrail(!mobile);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setMobile(media.matches);
    };

    update();
    media.addEventListener("change", update);
    setMounted(true);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (mobile) {
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [mobile, mouseX, mouseY]);

  useEffect(() => {
    if (mobile || !mounted) {
      return;
    }

    let frame = 0;

    const updateGlows = () => {
      const mx = mouseX.get();
      const my = mouseY.get();

      for (let i = 0; i < cats.length; i++) {
        const element = catRefs.current[i];

        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(mx - cx, my - cy);

        const target = Math.max(0, 1 - distance / PROXIMITY_RADIUS);

        const current = catGlows[i].get();

        catGlows[i].set(current + (target - current) * 0.15);
      }

      frame = requestAnimationFrame(updateGlows);
    };

    frame = requestAnimationFrame(updateGlows);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [mobile, mounted, cats, catGlows, mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-bg-base" />

      {glowBlobs.slice(0, mobile ? 2 : 3).map((blob, index) => (
        <motion.div
          key={`blob-${index}`}
          className={`absolute rounded-full ${
            mobile ? "blur-[80px]" : "blur-[120px]"
          }`}
          style={{
            top: blob.top,
            left: blob.left,
            width: mobile ? "70vw" : "50vw",
            height: mobile ? "70vw" : "50vw",
            background: blob.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            opacity: mobile ? [0.5, 0.75, 0.5] : [0.6, 1, 0.7, 0.6],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}

      <SparkleLayer mobile={mobile} />

      {mounted &&
        cats.map((cat, index) => (
          <div
            key={cat.id}
            ref={(node) => {
              catRefs.current[index] = node;
            }}
            className="absolute"
            style={{
              left: `${cat.left}%`,
              top: `${cat.top}%`,
              width: cat.size,
              height: cat.size,
              willChange: "transform",
            }}
          >
            <CatSprite cat={cat} glow={catGlows[index]} />
          </div>
        ))}

      {!mobile && (
        <AnimatePresence>
          {pawPoints.map((point) => (
            <motion.svg
              key={point.id}
              viewBox={pawIcon.viewBox}
              className="absolute"
              style={{
                left: point.x - 9,
                top: point.y - 9,
                width: 18,
                height: 18,
                rotate: point.rotate,
              }}
              initial={{
                opacity: 0.9,
                scale: 1,
              }}
              animate={{
                opacity: 0.9,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
              fill="rgb(216,180,254)"
              stroke="none"
            >
              {pawIcon.elements.map((element, index) =>
                element.type === "circle" ? (
                  <circle
                    key={index}
                    cx={element.cx}
                    cy={element.cy}
                    r={element.r}
                  />
                ) : (
                  <path key={index} d={element.d} />
                ),
              )}
            </motion.svg>
          ))}
        </AnimatePresence>
      )}

      {!mobile && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>

          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      )}
    </div>
  );
}

export default function CatBackground() {
  return <CatBackgroundContent />;
}
