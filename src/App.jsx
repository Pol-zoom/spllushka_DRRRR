
import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const NAME = "Саша";
const BIRTHDAY = "11.10";
const MUSIC = "/music/birthday.mp3";

const BOOT_LINES = [
  "INITIALIZING MEMORY............... OK",
  "LOADING VISUAL CORE............... OK",
  "CHECKING USER ENVIRONMENT......... OK",
  "ESTABLISHING SECURE CHANNEL....... OK",
  "SYSTEM READY",
];

const TERMINAL_LINES = [
  "> ./birthday_protocol --init",
  "> loading encrypted package...",
  "> checking destination...",
  "> locating user...",
  "> user signature detected",
  "> preparing secure connection...",
  "> bypassing local restrictions...",
  "> connection established",
];

const SCAN_LINES = [
  "SCANNING USER DATA",
  "ANALYZING DIGITAL SIGNATURE",
  "CHECKING MEMORY FRAGMENTS",
  "SEARCHING PERSONAL ARCHIVE",
  "DECODING EVENT TIMESTAMP",
  "VERIFYING DESTINATION",
];

function MatrixCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];
    let animationFrame;

    const chars =
      "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{}[]<>/\\$#@%&*+=-";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontSize = width < 600 ? 13 : 15;
      columns = Math.floor(width / fontSize);

      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * -80)
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = active
        ? "rgba(3, 2, 8, 0.075)"
        : "rgba(3, 2, 8, 0.18)";

      ctx.fillRect(0, 0, width, height);

      const fontSize = width < 600 ? 13 : 15;
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const opacity = Math.random() * 0.55 + 0.15;

        ctx.fillStyle = `rgba(174, 96, 255, ${opacity})`;

        if (Math.random() > 0.94) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity + 0.15})`;
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -30);
        }

        drops[i] += active ? 0.72 : 0.28;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
}

function GlitchText({ children, className = "" }) {
  return (
    <span className={`glitch-text ${className}`} data-text={children}>
      {children}
    </span>
  );
}

function ProgressBar({ progress }) {
  const blocks = 32;
  const filled = Math.floor((progress / 100) * blocks);

  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        {Array.from({ length: blocks }).map((_, index) => (
          <span
            key={index}
            className={index < filled ? "filled" : ""}
          />
        ))}
      </div>

      <div className="progress-number">
        {Math.floor(progress).toString().padStart(3, "0")}%
      </div>
    </div>
  );
}

function SystemWindow({
  title,
  children,
  className = "",
  status = "ONLINE",
}) {
  return (
    <div className={`system-window ${className}`}>
      <div className="window-top">
        <div className="window-title">
          <span className="window-dot" />
          {title}
        </div>

        <div className="window-status">
          <span className="status-light" />
          {status}
        </div>
      </div>

      <div className="window-content">{children}</div>
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("boot");
  const [progress, setProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState([]);
  const [scanIndex, setScanIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const addTimer = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };

  const startExperience = () => {
    if (started) return;

    setStarted(true);
    setPhase("boot");

    const audio = new Audio(MUSIC);
    audio.loop = false;
    audio.volume = 0.65;
    audioRef.current = audio;

    audio.play().catch(() => {
      console.log("Audio playback was blocked.");
    });

    addTimer(() => setPhase("terminal"), 4500);

    addTimer(() => {
      setPhase("connection");
      setProgress(0);
    }, 12500);

    addTimer(() => {
      setPhase("scan");
      setProgress(0);
    }, 21000);

    addTimer(() => setPhase("identity"), 32500);

    addTimer(() => setPhase("override"), 41500);

    addTimer(() => setPhase("warning"), 49000);

    addTimer(() => setPhase("critical"), 55500);

    addTimer(() => setPhase("reboot"), 62500);

    addTimer(() => setPhase("final"), 69000);
  };

  useEffect(() => {
    if (!started) return;

    clearTimers();

    const timeline = [
      ["terminal", 4500],
      ["connection", 12500],
      ["scan", 21000],
      ["identity", 32500],
      ["override", 41500],
      ["warning", 49000],
      ["critical", 55500],
      ["reboot", 62500],
      ["final", 69000],
    ];

    timeline.forEach(([nextPhase, delay]) => {
      addTimer(() => setPhase(nextPhase), delay);
    });

    return () => clearTimers();
  }, [started]);

  useEffect(() => {
    if (phase !== "terminal") return;

    setTerminalLines([]);

    TERMINAL_LINES.forEach((line, index) => {
      addTimer(() => {
        setTerminalLines((current) => [...current, line]);
      }, index * 850);
    });
  }, [phase]);

  useEffect(() => {
    if (phase !== "connection" && phase !== "scan") return;

    setProgress(0);

    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 3.5 + 0.8;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);
      }

      setProgress(value);
    }, 120);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "scan") return;

    setScanIndex(0);

    SCAN_LINES.forEach((_, index) => {
      addTimer(() => {
        setScanIndex(index + 1);
      }, index * 950);
    });
  }, [phase]);

  useEffect(() => {
    if (phase === "reboot") {
      setTimeout(() => {
        document.body.classList.add("reboot-flash");
      }, 200);

      setTimeout(() => {
        document.body.classList.remove("reboot-flash");
      }, 900);
    }
  }, [phase]);

  useEffect(() => {
    return () => {
      clearTimers();

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  return (
    <main className={`app phase-${phase}`}>
      <MatrixCanvas active={started} />

      <div className="noise" />
      <div className="scanlines" />
      <div className="vignette" />

      {!started && (
        <section className="boot-screen">
          <div className="boot-header">
            <span>Сплюхина темка</span>
            <span>BUILD 10.10.26</span>
          </div>

          <div className="boot-center">
            <div className="system-logo">
              <span>S</span>
            </div>

            <div className="boot-label">
              PERSONAL BIRTHDAY PROTOCOL
            </div>

            <h1>
              <GlitchText>SYSTEM READY</GlitchText>
            </h1>

            <div className="boot-terminal">
              {BOOT_LINES.map((line, index) => (
                <div
                  key={line}
                  className={`boot-line ${
                    index === BOOT_LINES.length - 1 ? "success" : ""
                  }`}
                >
                  <span className="line-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{line}</span>

                  {index === BOOT_LINES.length - 1 && (
                    <span className="cursor" />
                  )}
                </div>
              ))}
            </div>

            <button className="execute-button" onClick={startExperience}>
              <span className="button-bracket">[</span>
              EXECUTE PROTOCOL
              <span className="button-bracket">]</span>
            </button>

            <div className="boot-hint">
              PRESS TO INITIALIZE
            </div>
          </div>

          <div className="boot-footer">
            <span>MEM: 64K / 64K</span>
            <span>SECURE CONNECTION</span>
            <span>ENCRYPTION: ACTIVE</span>
          </div>
        </section>
      )}

      {started && !showCard && (
        <section className="experience">
          <header className="hud">
            <div className="hud-left">
              <span className="hud-brand">Сплюха</span>
              <span className="hud-separator">/</span>
              <span>BIRTHDAY_PROTOCOL</span>
            </div>

            <div className="hud-right">
              <span className="hud-status">
                <i />
                SYSTEM ONLINE
              </span>

              <button
                className="mute-button"
                onClick={toggleMute}
                aria-label="Toggle music"
              >
                {muted ? "SOUND OFF" : "SOUND ON"}
              </button>
            </div>
          </header>

          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          {phase === "boot" && (
            <div className="scene boot-scene">
              <div className="big-counter">
                <span>INITIALIZING</span>
                <strong>01</strong>
              </div>

              <div className="center-terminal">
                <div className="terminal-prompt">
                  root@system:~$
                </div>

                <GlitchText className="large">
                  ./birthday_protocol
                </GlitchText>

                <div className="terminal-cursor" />
              </div>
            </div>
          )}

          {phase === "terminal" && (
            <div className="scene">
              <div className="scene-index">
                02 / EXECUTION
              </div>

              <SystemWindow
                title="terminal.exe"
                status="RUNNING"
                className="terminal-window"
              >
                <div className="terminal-output">
                  {terminalLines.map((line, index) => (
                    <div
                      key={`${line}-${index}`}
                      className={
                        index === terminalLines.length - 1
                          ? "terminal-current"
                          : ""
                      }
                    >
                      <span className="terminal-time">
                        [{String(index + 1).padStart(2, "0")}]
                      </span>

                      {line}
                    </div>
                  ))}

                  <div className="terminal-input">
                    <span>root@birthday:~$</span>
                    <span className="cursor" />
                  </div>
                </div>
              </SystemWindow>
            </div>
          )}

          {phase === "connection" && (
            <div className="scene">
              <div className="scene-index">
                03 / CONNECTION
              </div>

              <div className="connection-layout">
                <SystemWindow
                  title="network_link"
                  status="CONNECTING"
                >
                  <div className="connection-map">
                    <div className="node node-main">
                      <span>LOCAL</span>
                      <b>01</b>
                    </div>

                    <div className="connection-line">
                      <i />
                    </div>

                    <div className="node">
                      <span>REMOTE</span>
                      <b>??</b>
                    </div>
                  </div>

                  <div className="connection-log">
                    <p>HANDSHAKE.................. OK</p>
                    <p>PACKET ROUTE.............. OK</p>
                    <p>SECURE TUNNEL............. OK</p>
                    <p className="purple">DESTINATION.............. FOUND</p>
                  </div>
                </SystemWindow>

                <SystemWindow
                  title="transfer"
                  status="ACTIVE"
                >
                  <div className="transfer-label">
                    DOWNLOADING EVENT DATA
                  </div>

                  <ProgressBar progress={progress} />

                  <div className="transfer-info">
                    <span>PACKETS</span>
                    <strong>
                      {Math.floor(progress * 12).toString().padStart(4, "0")}
                    </strong>
                  </div>
                </SystemWindow>
              </div>
            </div>
          )}

          {phase === "scan" && (
            <div className="scene">
              <div className="scene-index">
                04 / DEEP SCAN
              </div>

              <div className="scan-layout">
                <div className="scan-main">
                  <div className="scan-target">
                    <div className="scan-crosshair">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="scan-center">
                      <div className="scan-number">
                        {Math.floor(progress)
                          .toString()
                          .padStart(3, "0")}
                      </div>

                      <span>SCANNING</span>
                    </div>
                  </div>

                  <ProgressBar progress={progress} />
                </div>

                <SystemWindow
                  title="scan.log"
                  status="ANALYZING"
                >
                  <div className="scan-list">
                    {SCAN_LINES.map((line, index) => (
                      <div
                        key={line}
                        className={
                          index < scanIndex
                            ? "scan-complete"
                            : ""
                        }
                      >
                        <span>
                          {index < scanIndex ? "✓" : "·"}
                        </span>

                        {line}
                      </div>
                    ))}
                  </div>
                </SystemWindow>
              </div>
            </div>
          )}

          {phase === "identity" && (
            <div className="scene">
              <div className="scene-index">
                05 / IDENTITY FOUND
              </div>

              <div className="identity-layout">
                <div className="identity-number">
                  <span>USER ID</span>
                  <strong>23</strong>
                </div>

                <SystemWindow
                  title="personal_data.dat"
                  status="DECRYPTED"
                >
                  <div className="identity-data">
                    <div>
                      <span>DESIGNATION</span>
                      <strong>{NAME}</strong>
                    </div>

                    <div>
                      <span>EVENT DATE</span>
                      <strong>{BIRTHDAY}</strong>
                    </div>

                    <div>
                      <span>CLASSIFICATION</span>
                      <strong>очень особенный</strong>
                    </div>

                    <div>
                      <span>ACCESS LEVEL</span>
                      <strong className="purple">
                        Сверхсекретнейший
                      </strong>
                    </div>
                  </div>
                </SystemWindow>
              </div>
            </div>
          )}

          {phase === "override" && (
            <div className="scene override-scene">
              <div className="override-text">
                <span>SECURITY PROTOCOL</span>

                <h2>
                  <GlitchText>ACCESS GRANTED</GlitchText>
                </h2>

                <p>
                  STANDARD SECURITY MEASURES HAVE BEEN
                  OVERRIDDEN.
                </p>
              </div>

              <div className="access-grid">
                {[
                  "IDENTITY",
                  "MEMORY",
                  "EVENT",
                  "MESSAGE",
                  "ARCHIVE",
                  "SYSTEM",
                ].map((item) => (
                  <div key={item} className="access-item">
                    <span>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "warning" && (
            <div className="scene warning-scene">
              <div className="warning-box">
                <div className="warning-icon">!</div>

                <div>
                  <span className="warning-label">
                    SYSTEM WARNING
                  </span>

                  <h2>
                    UNAUTHORIZED FILE DETECTED
                  </h2>

                  <p>
                    This file should not exist inside
                    the current system.
                  </p>
                </div>
              </div>

              <div className="warning-code">
                FILE_11_10_BIRTHDAY.exe
              </div>
            </div>
          )}

          {phase === "critical" && (
            <div className="scene critical-scene">
              <div className="critical-glitch">
                <GlitchText>CRITICAL ERROR</GlitchText>
              </div>

              <div className="critical-code">
                <span>ERROR_CODE: 0xB11</span>
                <span>MEMORY CORRUPTION: 11%</span>
                <span>PROTOCOL FAILURE: UNKNOWN</span>
                <span>RECOVERY: IMPOSSIBLE</span>
              </div>
            </div>
          )}

          {phase === "reboot" && (
            <div className="scene reboot-scene">
              <div className="reboot-text">
                <span>SYSTEM FAILURE</span>
                <strong>REBOOTING</strong>

                <div className="reboot-loader">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          )}

          {phase === "final" && (
            <div className="scene final-scene">
              <div className="final-system">
                <span className="final-small">
                  SYSTEM REBOOT COMPLETE
                </span>

                <div className="final-line" />

                <h1>
                  <GlitchText>HAPPY BIRTHDAY</GlitchText>
                </h1>

                <p>
                  ONE SPECIAL FILE HAS BEEN RECOVERED.
                </p>

                <button
                  className="open-message"
                  onClick={() => setShowCard(true)}
                >
                  OPEN MESSAGE
                </button>
              </div>
            </div>
          )}

          <footer className="system-footer">
            <span>BIRTHDAY_PROTOCOL</span>
            <span>© 2026</span>
            <span>
              STATUS:{" "}
              <b>{phase.toUpperCase()}</b>
            </span>
          </footer>
        </section>
      )}

      {showCard && (
        <section className="message-screen">
          <div className="message-grid" />

          <div className="message-card">
            <div className="message-card-top">
              <span>RECOVERED_FILE</span>
              <span>11.10</span>
            </div>

            <div className="message-card-content">
              <div className="message-icon">
                ✦
              </div>

              <span className="message-label">
                PERSONAL MESSAGE
              </span>

              <h1>
                С ДНЁМ
                <br />
                РОЖДЕНИЯ СПЛЮХА!!!!!!!
              </h1>

              <div className="message-line" />

              <p>
                Пусть этот новый год твоей жизни будет
                наполнен просто ебейше крутыми моментами, людьми,
                которые будут рядом которые всегда поддержат и заставят тебя постоянно улыбаться
                причин улыбаться.
              </p>

              <p>
                Желаю, чтобы всё задуманное постепенно
                превращалось в реальность, а каждый
                новый день приносил не просто что нибудь хорошее а ебейшее завозное короче эмоций туда сюда мне слов не хватит чтобы описать
                Короче всё давай Сань ебейшего дня .
              </p>

              <div className="message-sign">
                <span>from pol_zoom</span>
              </div>
            </div>

            <div className="message-card-bottom">
              <span>FILE_STATUS: READABLE</span>
              <span>END_OF_MESSAGE</span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;

