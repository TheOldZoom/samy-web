"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Cat, PawPrint, type LucideIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  motionValue,
  useAnimationFrame,
  useMotionValue,
  useSpring,
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

const CAT_COUNT = 55;

function generateCats(): CatItem[] {
  const items: CatItem[] = [];
  const shapes: ("cat" | "paw")[] = ["cat", "paw", "paw"];

  for (let i = 0; i < CAT_COUNT; i++) {
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

const PROXIMITY_RADIUS = 260;

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

  const dropShadow = useTransform(
    glow,
    [0, 1],
    [
      "drop-shadow(0 0 0px rgba(196,132,252,0))",
      "drop-shadow(0 0 14px rgba(196,132,252,0.9))",
    ],
  );

  const scaleBoost = useTransform(glow, [0, 1], [1, 1.3]);
  const opacityBoost = useTransform(glow, [0, 1], [0, 0.85]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${cat.left}%`,
        top: `${cat.top}%`,
        width: cat.size,
        height: cat.size,
        rotate: cat.rotate,
        scaleX: cat.flip ? -1 : 1,
        scale: scaleBoost,
        filter: dropShadow,
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
      <motion.div
        className="absolute inset-0 text-accent-deep"
        style={{ opacity: 0.09 }}
        animate={{ opacity: [0.06, 0.13, 0.06] }}
        transition={{
          duration: cat.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: cat.delay,
        }}
      >
        <Icon className="h-full w-full" strokeWidth={1.6} />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          opacity: opacityBoost,
          color: "rgb(216,180,254)",
        }}
      >
        <Icon className="h-full w-full" strokeWidth={1.6} />
      </motion.div>
    </motion.div>
  );
}

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  rotate: number;
}

function usePawTrail() {
  const [points, setPoints] = useState<TrailPoint[]>([]);

  const lastPos = useRef({
    x: -1000,
    y: -1000,
  });

  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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
      const distance = Math.hypot(dx, dy);

      resetInactivityTimer();

      if (distance < 55) {
        return;
      }

      const angle = (Math.atan2(dy, dx) * 180) / Math.PI - 180;

      lastPos.current = {
        x,
        y,
      };

      const id = idRef.current++;

      setPoints((previous) => [
        ...previous.slice(-14),
        {
          id,
          x,
          y,
          rotate: angle,
        },
      ]);

      window.setTimeout(() => {
        setPoints((previous) => previous.filter((point) => point.id !== id));
      }, 900);
    }

    function onMouseMove(event: MouseEvent) {
      stamp(event.clientX, event.clientY);
    }

    function onTouchMove(event: TouchEvent) {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      stamp(touch.clientX, touch.clientY);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return points;
}

interface Sparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

const SPARKLE_COUNT = 45;

function generateSparkles(): Sparkle[] {
  const items: Sparkle[] = [];

  for (let i = 0; i < SPARKLE_COUNT; i++) {
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

function SparkleLayer() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(generateSparkles());
  }, []);

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
            boxShadow: "0 0 6px 1px rgba(232,121,249,0.8)",
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

function CatBackgroundContent() {
  const [cats, setCats] = useState<CatItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);

  const cursorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCats(generateCats());
    setMounted(true);
  }, []);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, {
    stiffness: 60,
    damping: 18,
    mass: 0.4,
  });

  const springY = useSpring(mouseY, {
    stiffness: 60,
    damping: 18,
    mass: 0.4,
  });

  const glowSize = 420;

  const glowTransform = useTransform(
    [springX, springY],
    ([x, y]: number[]) => ({
      x: x - glowSize / 2,
      y: y - glowSize / 2,
    }),
  );

  const glowX = useTransform(glowTransform, (value) => value.x);

  const glowY = useTransform(glowTransform, (value) => value.y);

  const cursorPointX = useTransform(springX, (x) => x - 5);

  const cursorPointY = useTransform(springY, (y) => y - 5);

  const catRefs = useMemo(
    () =>
      cats.map(() => ({
        current: null as HTMLDivElement | null,
      })),
    [cats],
  );

  const catGlows = useMemo(() => cats.map(() => motionValue(0)), [cats]);

  const pawPoints = usePawTrail();

  useEffect(() => {
    function activateCursor(x: number, y: number) {
      mouseX.set(x);
      mouseY.set(y);

      setCursorActive(true);

      if (cursorTimeout.current) {
        clearTimeout(cursorTimeout.current);
      }

      cursorTimeout.current = setTimeout(() => {
        setCursorActive(false);

        mouseX.set(-1000);
        mouseY.set(-1000);
      }, 3000);
    }

    function onMouseMove(event: MouseEvent) {
      activateCursor(event.clientX, event.clientY);
    }

    function onTouchMove(event: TouchEvent) {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      activateCursor(touch.clientX, touch.clientY);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);

      if (cursorTimeout.current) {
        clearTimeout(cursorTimeout.current);
      }
    };
  }, [mouseX, mouseY]);

  useAnimationFrame(() => {
    if (!mounted) {
      return;
    }

    const mx = mouseX.get();
    const my = mouseY.get();

    for (let i = 0; i < cats.length; i++) {
      const element = catRefs[i].current;

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
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-bg-base" />

      {glowBlobs.map((blob, index) => (
        <motion.div
          key={`blob-${index}`}
          className="absolute rounded-full blur-[120px]"
          style={{
            top: blob.top,
            left: blob.left,
            width: "50vw",
            height: "50vw",
            background: blob.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            opacity: [0.6, 1, 0.7, 0.6],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}

      <SparkleLayer />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: glowSize,
          height: glowSize,
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle, rgba(216,180,254,0.20) 0%, rgba(168,85,247,0.10) 35%, rgba(168,85,247,0) 70%)",
          filter: "blur(4px)",
        }}
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {mounted &&
        cats.map((cat, index) => (
          <div
            key={cat.id}
            ref={(node) => {
              catRefs[index].current = node;
            }}
            className="absolute"
            style={{
              left: `${cat.left}%`,
              top: `${cat.top}%`,
              width: cat.size,
              height: cat.size,
            }}
          >
            <div className="absolute inset-0">
              <CatSprite cat={cat} glow={catGlows[index]} />
            </div>
          </div>
        ))}

      <AnimatePresence>
        {cursorActive && (
          <>
            <motion.div
              className="absolute rounded-full"
              style={{
                width: glowSize,
                height: glowSize,
                x: glowX,
                y: glowY,
                background:
                  "radial-gradient(circle, rgba(216,180,254,0.20) 0%, rgba(168,85,247,0.10) 35%, rgba(168,85,247,0) 70%)",
                filter: "blur(4px)",
              }}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
              }}
            />

            <motion.div
              className="absolute rounded-full"
              style={{
                width: 10,
                height: 10,
                x: cursorPointX,
                y: cursorPointY,
                background: "rgb(232,121,249)",
                boxShadow:
                  "0 0 8px 2px rgba(232,121,249,0.9), 0 0 24px 6px rgba(168,85,247,0.5)",
              }}
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                duration: 0.25,
              }}
            />
          </>
        )}
      </AnimatePresence>

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
    </div>
  );
}

export default function CatBackground() {
  const pathname = usePathname();

  if (pathname && (pathname === "/docs" || pathname.startsWith("/docs/"))) {
    return null;
  }

  return <CatBackgroundContent />;
}
