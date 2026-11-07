/* SQ 密钥授权系统 · 产品宣传页交互（原生 JS，无依赖） */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("nav-toggle");
  var progressBar = document.getElementById("progress-bar");

  function onScroll() {
    var top = window.scrollY || document.documentElement.scrollTop || 0;
    if (header) {
      header.classList.toggle("is-scrolled", top > 8);
    }
    if (progressBar) {
      var height =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      progressBar.style.width = Math.min(100, (top / height) * 100) + "%";
    }
    var hud = document.querySelector(".hud");
    if (hud) {
      hud.classList.toggle("is-visible", top > 320);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 四端产品切换 */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = Array.prototype.slice.call(
    document.querySelectorAll(".tab-panel")
  );

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var name = tab.getAttribute("data-tab");
      tabs.forEach(function (item) {
        var active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      panels.forEach(function (panel) {
        panel.classList.toggle(
          "is-active",
          panel.getAttribute("data-panel") === name
        );
      });
    });
  });

  /* 章节索引高亮 */
  var railLinks = Array.prototype.slice.call(
    document.querySelectorAll(".rail a[data-rail]")
  );
  if (railLinks.length && "IntersectionObserver" in window) {
    var railObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          var id = entry.target.id;
          railLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("data-rail") === id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    railLinks.forEach(function (link) {
      var section = document.getElementById(link.getAttribute("data-rail"));
      if (section) {
        railObserver.observe(section);
      }
    });
  }

  /* 滚动渐显 */
  var revealTargets = Array.prototype.slice.call(
    document.querySelectorAll(
      ".section-head, .tabs, .tab-panels, .feature-grid, .layer-stack, .terminal, .alert-grid, .channel-row, .flow, .two-col, .deploy-grid, .code-block, .api-grid, .switch-row, .faq, .cta-inner"
    )
  );
  revealTargets.forEach(function (target) {
    target.classList.add("reveal");
    if (target.classList.contains("section-head")) {
      target.classList.add("reveal-left");
    } else if (
      target.classList.contains("terminal") ||
      target.classList.contains("code-block")
    ) {
      target.classList.add("reveal-scale");
    } else if (
      target.classList.contains("tab-panels") ||
      target.classList.contains("alert-grid") ||
      target.classList.contains("api-grid")
    ) {
      target.classList.add("reveal-right");
    }
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add("is-visible");
    });
  }

  /* 复制按钮 */
  Array.prototype.slice
    .call(document.querySelectorAll(".copy[data-copy]"))
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var text = button.getAttribute("data-copy") || "";
        var done = function () {
          var original = button.textContent;
          button.textContent = "已复制";
          window.setTimeout(function () {
            button.textContent = original;
          }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          var area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          try {
            document.execCommand("copy");
          } catch (error) {
            /* 忽略复制失败 */
          }
          document.body.removeChild(area);
          done();
        }
      });
    });

  /* 数字滚动 */
  function animateCount(element) {
    var target = parseFloat(element.getAttribute("data-count"));
    if (!isFinite(target)) {
      return;
    }
    var comma = element.getAttribute("data-comma") === "1";
    var duration = 1100;
    var startTime = null;
    function frame(time) {
      if (startTime === null) {
        startTime = time;
      }
      var progress = Math.min(1, (time - startTime) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      element.textContent = comma
        ? value.toLocaleString("en-US")
        : String(value);
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  var counters = Array.prototype.slice.call(
    document.querySelectorAll("[data-count]")
  );
  var statCards = Array.prototype.slice.call(document.querySelectorAll(".stat"));

  counters.forEach(function (element) {
    var delay = 0;
    var stat = element.closest(".stat");
    if (stat) {
      delay = 700 + Math.max(0, statCards.indexOf(stat)) * 90;
    } else if (element.closest(".hero-meta")) {
      delay = 620;
    }
    var start = function () {
      window.setTimeout(function () {
        animateCount(element);
      }, delay);
    };
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              start();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(element);
    } else {
      start();
    }
  });

  /* 阶梯递进：给每个子元素分配索引，并在进入视口时整组触发 */
  var staggerGroups = Array.prototype.slice.call(
    document.querySelectorAll("[data-stagger]")
  );
  staggerGroups.forEach(function (group) {
    Array.prototype.slice.call(group.children).forEach(function (child, index) {
      child.style.setProperty("--i", String(index));
    });
    if ("IntersectionObserver" in window) {
      var staggerObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              group.classList.add("is-visible");
              staggerObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      staggerObserver.observe(group);
    } else {
      group.classList.add("is-visible");
    }
  });

  /* 鼠标聚光 */
  var heroSection = document.querySelector(".hero");
  if (heroSection && window.matchMedia("(pointer: fine)").matches) {
    heroSection.addEventListener(
      "pointermove",
      function (event) {
        var rect = heroSection.getBoundingClientRect();
        if (!rect.width || !rect.height) {
          return;
        }
        heroSection.style.setProperty(
          "--mx",
          ((event.clientX - rect.left) / rect.width) * 100 + "%"
        );
        heroSection.style.setProperty(
          "--my",
          ((event.clientY - rect.top) / rect.height) * 100 + "%"
        );
      },
      { passive: true }
    );
  }

  /* 回到顶部 */
  var toTop = document.getElementById("to-top");
  if (toTop) {
    var syncToTop = function () {
      var top = window.scrollY || document.documentElement.scrollTop || 0;
      toTop.classList.toggle("is-visible", top > 600);
    };
    window.addEventListener("scroll", syncToTop, { passive: true });
    syncToTop();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 深浅主题切换 */
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeColor(theme) {
    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        theme === "dark" ? "#0b0e14" : "#f4f6fa"
      );
    }
  }

  syncThemeColor(document.documentElement.getAttribute("data-theme") || "light");

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var root = document.documentElement;
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.classList.add("theme-switching");
      root.setAttribute("data-theme", next);
      syncThemeColor(next);
      try {
        window.localStorage.setItem("sq-theme", next);
      } catch (error) {
        /* 隐私模式下忽略存储失败 */
      }
      window.setTimeout(function () {
        root.classList.remove("theme-switching");
      }, 420);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 3D 粒子画布 */
  var fxCanvas = document.getElementById("fx-canvas");
  if (fxCanvas && fxCanvas.getContext) {
    var fxContext = fxCanvas.getContext("2d");
    var fxParticles = [];
    var fxWidth = 0;
    var fxHeight = 0;
    var fxDpr = Math.min(window.devicePixelRatio || 1, 2);
    var fxVisible = true;
    var fxPointer = { x: 0, y: 0 };
    var fxPointerPx = { x: 0, y: 0, inside: false };
    var fxRipples = [];
    window.__fxEvents = { clicks: 0, ripples: 0 };
    var fxCount =
      window.innerWidth < 700 ? 30 : window.innerWidth < 1100 ? 52 : 76;

    function fxResize() {
      var rect = fxCanvas.parentElement.getBoundingClientRect();
      fxWidth = rect.width;
      fxHeight = rect.height;
      fxCanvas.width = Math.max(1, Math.round(fxWidth * fxDpr));
      fxCanvas.height = Math.max(1, Math.round(fxHeight * fxDpr));
      fxContext.setTransform(fxDpr, 0, 0, fxDpr, 0, 0);
    }

    function fxSeed() {
      fxParticles = [];
      for (var index = 0; index < fxCount; index += 1) {
        fxParticles.push({
          x: Math.random() * fxWidth,
          y: Math.random() * fxHeight,
          vx: (Math.random() - 0.5) * 0.26,
          vy: (Math.random() - 0.5) * 0.26,
          r: 0.8 + Math.random() * 1.5,
          z: 0.45 + Math.random() * 0.55,
          fx: 0,
          fy: 0,
        });
      }
    }

    function fxDraw() {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      var accent = dark ? "74,134,255" : "47,107,228";
      var cyan = dark ? "34,211,197" : "10,165,160";
      fxContext.clearRect(0, 0, fxWidth, fxHeight);

      var boost =
        1 +
        Math.min(
          (window.scrollY || 0) / Math.max(1, window.innerHeight),
          1
        ) *
          0.7;

      fxContext.save();
      fxContext.globalAlpha = dark ? 0.06 : 0.045;
      fxContext.fillStyle = "rgb(" + accent + ")";
      fxContext.font =
        "700 " +
        Math.round(fxHeight * 0.4) +
        "px 'Segoe UI', 'PingFang SC', sans-serif";
      fxContext.textAlign = "center";
      fxContext.textBaseline = "middle";
      fxContext.fillText(
        "SQ",
        fxWidth * 0.72 + fxPointer.x * 12,
        fxHeight * 0.42 + fxPointer.y * 10
      );
      fxContext.restore();

      for (var rippleIndex = fxRipples.length - 1; rippleIndex >= 0; rippleIndex -= 1) {
        var ripple = fxRipples[rippleIndex];
        ripple.r += 2.6;
        ripple.alpha -= 0.013;
        if (ripple.alpha <= 0) {
          fxRipples.splice(rippleIndex, 1);
          continue;
        }
        fxContext.beginPath();
        fxContext.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        fxContext.strokeStyle =
          "rgba(" + accent + "," + ripple.alpha.toFixed(3) + ")";
        fxContext.lineWidth = 1.2;
        fxContext.stroke();
      }
      window.__fxEvents.ripples = fxRipples.length;

      for (var i = 0; i < fxParticles.length; i += 1) {
        var particle = fxParticles[i];
        particle.x += particle.vx * particle.z * boost + particle.fx;
        particle.y += particle.vy * particle.z * boost + particle.fy;
        particle.fx *= 0.9;
        particle.fy *= 0.9;
        if (fxPointerPx.inside) {
          var ddx = particle.x - fxPointerPx.x;
          var ddy = particle.y - fxPointerPx.y;
          var dd = ddx * ddx + ddy * ddy;
          if (dd < 26000 && dd > 1) {
            var force = (1 - dd / 26000) * 0.9;
            var length = Math.sqrt(dd);
            particle.fx += (ddx / length) * force;
            particle.fy += (ddy / length) * force;
          }
        }
        if (particle.x < -24) particle.x = fxWidth + 24;
        if (particle.x > fxWidth + 24) particle.x = -24;
        if (particle.y < -24) particle.y = fxHeight + 24;
        if (particle.y > fxHeight + 24) particle.y = -24;

        var px = particle.x;
        var py = particle.y;

        for (var j = i + 1; j < fxParticles.length; j += 1) {
          var other = fxParticles[j];
          var ox = other.x;
          var oy = other.y;
          var dx = px - ox;
          var dy = py - oy;
          var distance = dx * dx + dy * dy;
          if (distance < 16000) {
            var alpha = (1 - distance / 16000) * 0.16;
            fxContext.strokeStyle = "rgba(" + accent + "," + alpha.toFixed(3) + ")";
            fxContext.lineWidth = 1;
            fxContext.beginPath();
            fxContext.moveTo(px, py);
            fxContext.lineTo(ox, oy);
            fxContext.stroke();
          }
        }

        fxContext.beginPath();
        fxContext.arc(px, py, particle.r * particle.z, 0, Math.PI * 2);
        fxContext.fillStyle =
          "rgba(" +
          (i % 6 === 0 ? cyan : accent) +
          "," +
          (0.3 + particle.z * 0.35).toFixed(2) +
          ")";
        fxContext.fill();
      }
    }

    function fxLoop() {
      if (fxVisible && !document.hidden) {
        fxDraw();
      }
      window.requestAnimationFrame(fxLoop);
    }

    var fxTicking = false;
    window.addEventListener(
      "resize",
      function () {
        if (fxTicking) {
          return;
        }
        fxTicking = true;
        window.requestAnimationFrame(function () {
          fxTicking = false;
          fxResize();
          fxSeed();
          if (reduceMotion) {
            fxDraw();
          }
        });
      },
      { passive: true }
    );

    window.addEventListener(
      "pointermove",
      function (event) {
        fxPointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        fxPointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
        var rect = fxCanvas.getBoundingClientRect();
        fxPointerPx.x = event.clientX - rect.left;
        fxPointerPx.y = event.clientY - rect.top;
        fxPointerPx.inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
      },
      { passive: true }
    );

    var fxHost = fxCanvas.parentElement;
    fxHost.addEventListener(
      "pointerdown",
      function (event) {
        var rect = fxCanvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
          return;
        }
        fxRipples.push({ x: x, y: y, r: 4, alpha: 0.5 });
        window.__fxEvents.clicks += 1;
        fxParticles.forEach(function (particle) {
          var dx = particle.x - x;
          var dy = particle.y - y;
          var distance = Math.sqrt(dx * dx + dy * dy) || 1;
          if (distance < 240) {
            var force = (1 - distance / 240) * 4.2;
            particle.fx += (dx / distance) * force;
            particle.fy += (dy / distance) * force;
          }
        });
      },
      { passive: true }
    );

    if ("IntersectionObserver" in window) {
      var fxObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            fxVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.02 }
      );
      fxObserver.observe(fxCanvas.parentElement);
    }

    fxResize();
    fxSeed();
    if (reduceMotion) {
      fxDraw();
    } else {
      window.requestAnimationFrame(fxLoop);
    }
    window.__fxStats = { particles: fxCount };
  }

  /* 首屏全景触控：指针 / 触摸 / 陀螺仪驱动 4D 分层 */
  var tiltElement = document.querySelector("[data-tilt]");
  if (tiltElement && !reduceMotion) {
    var tiltChips = Array.prototype.slice.call(
      tiltElement.querySelectorAll(".float-chip")
    );
    var tiltValue = { x: 0, y: 0 };
    var tiltFrame = 0;
    var tiltClamp = function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    };

    var paintTilt = function (x, y) {
      tiltValue.x = x;
      tiltValue.y = y;
      tiltElement.style.setProperty("--tilt-x", x.toFixed(2) + "deg");
      tiltElement.style.setProperty("--tilt-y", y.toFixed(2) + "deg");
      tiltElement.style.setProperty("--mx", (50 + y * 2.4).toFixed(1) + "%");
      tiltElement.style.setProperty("--my", (50 - x * 2.4).toFixed(1) + "%");
      tiltChips.forEach(function (chip, index) {
        var depth = index % 2 === 0 ? 1.8 : -1.8;
        chip.style.translate =
          (y * depth).toFixed(1) + "px " + (-x * depth * 1.2).toFixed(1) + "px";
      });
    };

    var stopTiltFrame = function () {
      if (tiltFrame) {
        window.cancelAnimationFrame(tiltFrame);
        tiltFrame = 0;
      }
    };

    var applyTilt = function (x, y) {
      stopTiltFrame();
      paintTilt(x, y);
    };

    var resetTilt = function () {
      stopTiltFrame();
      /* 松手后带回弹，而不是硬切回正 */
      var spring = function () {
        tiltValue.x += (0 - tiltValue.x) * 0.14;
        tiltValue.y += (0 - tiltValue.y) * 0.14;
        paintTilt(tiltValue.x, tiltValue.y);
        if (Math.abs(tiltValue.x) > 0.06 || Math.abs(tiltValue.y) > 0.06) {
          tiltFrame = window.requestAnimationFrame(spring);
        } else {
          tiltFrame = 0;
          paintTilt(0, 0);
        }
      };
      tiltFrame = window.requestAnimationFrame(spring);
    };

    /*
     * 入场动画结束后要把可见状态显式落下来再撤掉 animation：
     * .hero-visual 的基础样式是 opacity:0，只靠 forwards 撑着，
     * 直接 animation="none" 会让整块模拟窗闪一下就永久消失。
     */
    var tiltReveal = function (event) {
      if (event.target !== tiltElement) {
        return;
      }
      tiltElement.style.opacity = "1";
      tiltElement.style.animation = "none";
      tiltElement.removeEventListener("animationend", tiltReveal);
      resetTilt();
    };
    tiltElement.addEventListener("animationend", tiltReveal);

    if (window.matchMedia("(pointer: fine)").matches) {
      tiltElement.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch") {
          return;
        }
        var rect = tiltElement.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        tiltElement.classList.add("is-pointing");
        applyTilt(-py * 11, px * 14);
      });
      tiltElement.addEventListener("pointerleave", function () {
        tiltElement.classList.remove("is-pointing");
        resetTilt();
      });
    }

    /* 触摸：整块首屏视觉都能拖着转 */
    var tiltOrigin = null;
    tiltElement.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse") {
        return;
      }
      tiltOrigin = { x: event.clientX, y: event.clientY };
      stopTiltFrame();
      tiltElement.classList.add("is-dragging");
    });
    tiltElement.addEventListener("pointermove", function (event) {
      if (!tiltOrigin || event.pointerType === "mouse") {
        return;
      }
      var dx = (event.clientX - tiltOrigin.x) / window.innerWidth;
      var dy = (event.clientY - tiltOrigin.y) / window.innerHeight;
      paintTilt(
        tiltClamp(-dy * 96, -14, 14),
        tiltClamp(dx * 128, -18, 18)
      );
    });
    var endTiltDrag = function () {
      if (!tiltOrigin) {
        return;
      }
      tiltOrigin = null;
      tiltElement.classList.remove("is-dragging");
      resetTilt();
    };
    tiltElement.addEventListener("pointerup", endTiltDrag);
    tiltElement.addEventListener("pointercancel", endTiltDrag);

    /* 安卓浏览器多半能直接读陀螺仪；iOS 需要授权弹窗，这里不主动打扰 */
    if (
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission !== "function"
    ) {
      window.addEventListener(
        "deviceorientation",
        function (event) {
          if (tiltOrigin || event.gamma === null || event.beta === null) {
            return;
          }
          applyTilt(
            tiltClamp((event.beta - 45) / 4.5, -12, 12),
            tiltClamp(event.gamma / 4.5, -14, 14)
          );
        },
        true
      );
    }
  }

  /* 滚动视差 */
  var parallaxWindow = document.querySelector(".app-window");
  if (!reduceMotion && (parallaxWindow || fxCanvas)) {
    var parallaxTicking = false;
    var applyParallax = function () {
      parallaxTicking = false;
      var top = window.scrollY || document.documentElement.scrollTop || 0;
      var factor = Math.min(top, window.innerHeight);
      if (parallaxWindow) {
        parallaxWindow.style.transform =
          "translate3d(0," + (factor * 0.045).toFixed(1) + "px,0)";
      }
      if (fxCanvas) {
        fxCanvas.style.transform =
          "translate3d(0," + (factor * -0.03).toFixed(1) + "px,0)";
      }
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!parallaxTicking) {
          parallaxTicking = true;
          window.requestAnimationFrame(applyParallax);
        }
      },
      { passive: true }
    );
  }

  /* ============================================================
     交互演示区
     ============================================================ */
  var simLog = document.getElementById("sim-log");
  var simAlert = document.getElementById("sim-alert");
  var simHint = document.getElementById("sim-hint");
  var simState = document.getElementById("sim-license-state");
  var simFacts = {
    status: document.getElementById("sim-fact-status"),
    device: document.getElementById("sim-fact-device"),
    expiry: document.getElementById("sim-fact-expiry"),
    session: document.getElementById("sim-fact-session"),
  };
  var KEY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var KEY_PATTERN =
    /^GSQ-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}(-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}){3}$/;
  var SAMPLE_KEYS = {
    valid: "GSQ-7K2MF-9QXAR-4TZWD-2HN8P",
    expired: "GSQ-3M8PT-KQ2WE-7YR4N-5ZAHB",
    revoked: "GSQ-9TW4K-M2PDH-6QX8R-NZ3FA",
    exhausted: "GSQ-5HR7N-WQ9KM-3PTZ8-X2D4E",
  };
  var KEY_STATUS = {
    "GSQ-3M8PT-KQ2WE-7YR4N-5ZAHB": {
      status: "expired",
      text: "已过期",
      hint: "该密钥已于 2026-08-30 过期，无法激活；可在管理端续期后继续使用。",
    },
    "GSQ-9TW4K-M2PDH-6QX8R-NZ3FA": {
      status: "revoked",
      text: "已吊销",
      hint: "该密钥已被吊销，无法激活；吊销状态可在管理端恢复。",
    },
    "GSQ-5HR7N-WQ9KM-3PTZ8-X2D4E": {
      status: "exhausted",
      text: "次数用尽",
      hint: "该激活次数卡已用尽并自动吊销，无法恢复或续期。",
    },
  };
  var sim = { activated: false, status: "unused", heartbeats: 0 };

  var simProgressBar = document.getElementById("sim-progress");

  function randomGsqKey() {
    var groups = [];
    for (var group = 0; group < 4; group += 1) {
      var chunk = "";
      for (var index = 0; index < 5; index += 1) {
        chunk += KEY_ALPHABET[Math.floor(Math.random() * KEY_ALPHABET.length)];
      }
      groups.push(chunk);
    }
    return "GSQ-" + groups.join("-");
  }

  function simSetProgress(percent) {
    if (!simProgressBar) {
      return;
    }
    var fill = simProgressBar.firstElementChild;
    if (fill) {
      fill.style.width = Math.max(0, Math.min(100, percent)) + "%";
    }
  }

  function simRunWithProgress(callback) {
    var value = 0;
    simSetProgress(0);
    var timer = window.setInterval(function () {
      value += 14 + Math.random() * 20;
      simSetProgress(value);
      if (value >= 100) {
        window.clearInterval(timer);
        simSetProgress(100);
        window.setTimeout(function () {
          simSetProgress(0);
          callback();
        }, 180);
      }
    }, 45);
  }

  function simReadKey() {
    var input = document.getElementById("sim-key");
    return input ? input.value.trim().toUpperCase() : "";
  }

  function simMarkKeyError() {
    var input = document.getElementById("sim-key");
    if (!input) {
      return;
    }
    input.classList.remove("is-error");
    void input.offsetWidth;
    input.classList.add("is-error");
    window.setTimeout(function () {
      input.classList.remove("is-error");
    }, 650);
  }

  function simBlocked() {
    if (sim.status === "frozen") return "frozen";
    if (sim.status === "revoked") return "revoked";
    if (sim.status === "expired") return "expired";
    if (sim.status === "exhausted") return "exhausted";
    return "";
  }

  function simNow() {
    var now = new Date();
    var pad = function (value) {
      return String(value).padStart(2, "0");
    };
    return pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
  }

  function simPrint(message, kind) {
    if (!simLog) {
      return;
    }
    var line = document.createElement("div");
    line.className = "sim-log-line";
    line.innerHTML =
      '<span class="dim">[' +
      simNow() +
      "]</span> " +
      (kind ? '<span class="' + kind + '">' + message + "</span>" : message);
    simLog.appendChild(line);
    while (simLog.children.length > 26) {
      simLog.removeChild(simLog.firstChild);
    }
    simLog.scrollTop = simLog.scrollHeight;
  }

  function simSetHint(text, kind) {
    if (!simHint) {
      return;
    }
    simHint.textContent = text;
    simHint.classList.remove("is-ok", "is-warn");
    if (kind) {
      simHint.classList.add(kind);
    }
  }

  function simSetState(text, className) {
    if (!simState) {
      return;
    }
    simState.textContent = text;
    simState.classList.remove("is-active", "is-frozen");
    if (className) {
      simState.classList.add(className);
    }
    if (simFacts.status) {
      simFacts.status.textContent = text;
    }
  }

  function simShowAlert(text, info) {
    if (!simAlert) {
      return;
    }
    simAlert.hidden = false;
    simAlert.textContent = text;
    simAlert.classList.toggle("is-info", Boolean(info));
  }

  function simReset() {
    sim.activated = false;
    sim.status = "unused";
    sim.heartbeats = 0;
    if (simAlert) {
      simAlert.hidden = true;
      simAlert.textContent = "";
    }
    simSetState("未激活", "");
    if (simFacts.device) simFacts.device.textContent = "—";
    if (simFacts.expiry) simFacts.expiry.textContent = "—";
    if (simFacts.session) simFacts.session.textContent = "—";
    if (simLog) {
      simLog.innerHTML = '<div class="sim-log-line">[demo] 等待操作…</div>';
    }
    var keyInput = document.getElementById("sim-key");
    if (keyInput) {
      keyInput.classList.remove("is-error");
    }
    var deviceActions = document.getElementById("sim-device-actions");
    if (deviceActions) {
      deviceActions.hidden = true;
    }
    simSetProgress(0);
    simSetHint("提示：先点「激活」，再点「校验」或「心跳」。", "");
  }

  function simActivate() {
    var key = simReadKey();
    if (!key) {
      simMarkKeyError();
      simPrint("校验失败：授权密钥为空，服务端直接拒绝", "bad");
      simSetHint("请输入授权密钥，格式为 GSQ-XXXXX-XXXXX-XXXXX-XXXXX。", "is-warn");
      return;
    }
    if (!KEY_PATTERN.test(key)) {
      simMarkKeyError();
      simPrint("密钥格式不正确：" + key, "bad");
      simPrint(
        "正确格式：GSQ-XXXXX-XXXXX-XXXXX-XXXXX（大写，不含 I / O / 0 / 1）",
        "dim"
      );
      simSetHint("格式不符合真实密钥规则，请检查 GSQ 前缀与 4 组 × 5 位字符。", "is-warn");
      return;
    }
    var preset = KEY_STATUS[key];
    if (preset) {
      sim.activated = false;
      sim.status = preset.status;
      simSetState(preset.text, "is-frozen");
      simPrint("POST /api/client/activate → 400 " + preset.status, "bad");
      simPrint(preset.hint, "warn");
      simShowAlert(preset.hint, preset.status === "expired");
      simSetHint(preset.hint, "is-warn");
      return;
    }
    if (sim.status === "frozen" || sim.status === "revoked") {
      simPrint("POST /api/client/activate → 403 " + sim.status, "bad");
      simSetHint(
        "该密钥当前为「" + sim.status + "」，需在管理端解冻或恢复后才能重新激活。",
        "is-warn"
      );
      return;
    }
    if (sim.activated) {
      simPrint("POST /api/client/activate → 200 already（幂等，不重复计数）", "ok");
      simSetHint("同一设备重复激活不会重复扣减次数。", "is-ok");
      return;
    }
    simRunWithProgress(function () {
      sim.activated = true;
      sim.status = "active";
      simSetState("已激活", "is-active");
      var machine = document.getElementById("sim-machine");
      var machineText = machine ? machine.value : "8F3A1-0C4D9-7E2B5";
      var expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      if (simFacts.device) simFacts.device.textContent = machineText;
      if (simFacts.expiry) {
        simFacts.expiry.textContent =
          expiry.toISOString().slice(0, 10) + " · 365 天";
      }
      if (simFacts.session) {
        simFacts.session.textContent =
          "sess_" + Math.random().toString(16).slice(2, 10) + "…";
      }
      var deviceActions = document.getElementById("sim-device-actions");
      if (deviceActions) {
        deviceActions.hidden = false;
      }
      simPrint("POST /api/client/activate → 200 activated", "ok");
      simPrint("设备位原子占用 1/1，重复激活幂等", "dim");
      simPrint("会话密钥已下发（库内 AES-GCM 加密存储）", "dim");
      simSetHint("激活成功。可以点「校验」或「心跳」，或注入风险看裁决。", "is-ok");
    });
  }

  function simVerify() {
    if (!sim.activated) {
      simPrint("POST /api/client/verify → 422 not_activated", "warn");
      simSetHint("设备尚未激活，请先点「① 激活」。", "is-warn");
      return;
    }
    var blocked = simBlocked();
    if (blocked) {
      simPrint(
        "POST /api/client/verify → 403 " + blocked + "（已拒绝授权操作）",
        "bad"
      );
      simSetHint("密钥状态为「" + blocked + "」，校验被拒绝。", "is-warn");
      return;
    }
    simPrint("HMAC-SHA256 请求签名 + nonce 防重放校验通过", "dim");
    simPrint("POST /api/client/verify → 200 valid", "ok");
    simSetHint("校验通过，响应带 Ed25519 服务端签名。", "is-ok");
  }

  function simHeartbeat() {
    if (!sim.activated) {
      simPrint("POST /api/client/heartbeat → 422 not_activated", "warn");
      simSetHint("设备尚未激活，请先点「① 激活」。", "is-warn");
      return;
    }
    var blocked = simBlocked();
    if (blocked) {
      simPrint("POST /api/client/heartbeat → 403 " + blocked, "bad");
      simSetHint("密钥状态为「" + blocked + "」，心跳被拒绝。", "is-warn");
      return;
    }
    sim.heartbeats += 1;
    var interval = 18 + Math.round(Math.random() * 10);
    simPrint(
      "POST /api/client/heartbeat → 200 alive · 第 " + sim.heartbeats + " 次",
      "ok"
    );
    simPrint("服务端返回抖动间隔 " + interval + "s，在线口径已更新", "dim");
    simSetHint("心跳正常，服务端持续更新在线并发。", "is-ok");
  }

  function simRisk(kind) {
    if (kind === "machine") {
      sim.status = "frozen";
      simSetState("已冻结", "is-frozen");
      simPrint("device_count = max_devices，仍出现新硬件码", "warn");
      simPrint("risk_event: machine_mismatch（high）", "bad");
      simPrint("冻结密钥 + 通知绑定邮箱与管理员", "bad");
      simShowAlert(
        "machine_mismatch：新硬件码抢占已满设备位，密钥已冻结，告警已发送到绑定邮箱与管理员。",
        false
      );
      simSetHint("密钥已被冻结，后续校验与心跳都会被拒绝。", "is-warn");
    } else if (kind === "ip") {
      simPrint("risk_event: ip_jump（warning）", "warn");
      simPrint("10 分钟内出现 3 个不同 IP 网段（阈值 2）", "warn");
      simPrint("告警已入队：邮件 / Webhook / 钉钉 / 企微 / 飞书", "dim");
      simShowAlert(
        "ip_jump：同一密钥 10 分钟内 3 个网段，已触发告警并通知管理员（不自动封禁）。",
        true
      );
      simSetHint("IP 跳动只告警，不影响正常授权。", "");
    } else if (kind === "tamper") {
      simPrint("POST /api/client/attest → 403 unknown_build", "bad");
      simPrint("tamper_events 写入：完整性校验未通过", "bad");
      simPrint("已拒绝授权操作，并触发完整性告警规则", "bad");
      simShowAlert(
        "完整性校验未通过：未知版本被 attest 白名单拒绝，已记录并触发告警。",
        false
      );
      simSetHint("被篡改的客户端无法完成激活 / 校验 / 心跳。", "is-warn");
    }
  }

  Array.prototype.slice
    .call(document.querySelectorAll("[data-sim-action]"))
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-sim-action");
        if (action === "activate") simActivate();
        else if (action === "verify") simVerify();
        else simHeartbeat();
      });
    });

  Array.prototype.slice
    .call(document.querySelectorAll("[data-sim-risk]"))
    .forEach(function (button) {
      button.addEventListener("click", function () {
        simRisk(button.getAttribute("data-sim-risk"));
      });
    });

  var simResetButton = document.getElementById("sim-reset");
  if (simResetButton) {
    simResetButton.addEventListener("click", simReset);
  }

  /* 样本密钥与随机密钥 */
  Array.prototype.slice
    .call(document.querySelectorAll("[data-sample]"))
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var kind = button.getAttribute("data-sample");
        var input = document.getElementById("sim-key");
        if (!input) {
          return;
        }
        input.value =
          kind === "random"
            ? randomGsqKey()
            : SAMPLE_KEYS[kind] || SAMPLE_KEYS.valid;
        input.classList.remove("is-error");
        simPrint(
          kind === "random"
            ? "已生成随机 GSQ 密钥（真实格式）"
            : "已填入样本密钥：「" + button.textContent + "」",
          "dim"
        );
        simSetHint("点「① 激活」查看该密钥的裁决结果。", "");
      });
    });

  /* 设备操作 */
  Array.prototype.slice
    .call(document.querySelectorAll("[data-sim-device]"))
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-sim-device");
        if (!sim.activated && action !== "restore") {
          simPrint("设备操作失败：当前没有已激活的设备", "warn");
          simSetHint("请先完成激活，再对设备执行解绑 / 冻结 / 吊销。", "is-warn");
          return;
        }
        if (action === "unbind") {
          sim.activated = false;
          sim.status = "unused";
          simSetState("未激活", "");
          if (simFacts.device) simFacts.device.textContent = "—";
          if (simFacts.session) simFacts.session.textContent = "—";
          var actions = document.getElementById("sim-device-actions");
          if (actions) {
            actions.hidden = true;
          }
          simPrint("POST /api/license/unbind → 200（设备已解绑，可换机）", "ok");
          simSetHint("设备已解绑，可在另一台设备重新激活。", "is-ok");
        } else if (action === "freeze") {
          sim.status = "frozen";
          simSetState("已冻结", "is-frozen");
          simPrint("POST /api/license/freeze → 200（冻结 1 小时）", "warn");
          simSetHint("密钥已冻结，校验与心跳会被拒绝，到期后自动恢复。", "is-warn");
        } else if (action === "revoke") {
          sim.status = "revoked";
          simSetState("已吊销", "is-frozen");
          simPrint("POST /api/license/revoke → 200", "bad");
          simSetHint("密钥已吊销，可在管理端恢复。", "is-warn");
        } else if (action === "restore") {
          if (sim.status !== "revoked" && sim.status !== "frozen") {
            simPrint("恢复失败：当前状态不可恢复", "warn");
            return;
          }
          sim.status = sim.activated ? "active" : "unused";
          simSetState(
            sim.activated ? "已激活" : "未激活",
            sim.activated ? "is-active" : ""
          );
          simPrint("POST /api/license/restore → 200（恢复成功）", "ok");
          simSetHint("密钥已恢复，设备绑定保持不变。", "is-ok");
        }
      });
    });

  /* 密钥批量生成器 */
  var keygenCount = document.getElementById("keygen-count");
  var keygenCountValue = document.getElementById("keygen-count-value");
  var keygenList = document.getElementById("keygen-list");
  var keygenRun = document.getElementById("keygen-run");
  var keygenCopy = document.getElementById("keygen-copy");
  var keygenCsvButton = document.getElementById("keygen-csv");
  var lastGenerated = [];

  function keygenScramble(codeElement, finalKey) {
    var frames = 0;
    var timer = window.setInterval(function () {
      frames += 1;
      var reveal = frames;
      var text = "";
      for (var index = 0; index < finalKey.length; index += 1) {
        text +=
          index < reveal
            ? finalKey[index]
            : KEY_ALPHABET[Math.floor(Math.random() * KEY_ALPHABET.length)];
      }
      codeElement.textContent = text;
      if (reveal >= finalKey.length) {
        window.clearInterval(timer);
        codeElement.textContent = finalKey;
      }
    }, 20);
  }

  function keygenRender() {
    if (!keygenList) {
      return;
    }
    var count = keygenCount ? Number(keygenCount.value) : 8;
    lastGenerated = [];
    keygenList.innerHTML = "";
    for (var index = 0; index < count; index += 1) {
      var key = randomGsqKey();
      lastGenerated.push(key);
      var row = document.createElement("div");
      row.className = "keygen-row";
      row.innerHTML =
        '<span class="keygen-idx">' +
        String(index + 1).padStart(2, "0") +
        '</span><code class="scramble">' +
        randomGsqKey() +
        '</code><button type="button" data-key="' +
        key +
        '">复制</button>';
      keygenList.appendChild(row);
      (function (element, finalKey) {
        window.setTimeout(function () {
          keygenScramble(element, finalKey);
        }, index * 70);
      })(row.querySelector("code"), key);
    }
  }

  function keygenClipboard(text, button) {
    var done = function () {
      if (!button) {
        return;
      }
      var original = button.textContent;
      button.textContent = "已复制";
      window.setTimeout(function () {
        button.textContent = original;
      }, 1400);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, done);
      return;
    }
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      /* 忽略复制失败 */
    }
    document.body.removeChild(area);
    done();
  }

  if (keygenCount && keygenCountValue) {
    keygenCount.addEventListener("input", function () {
      keygenCountValue.textContent = keygenCount.value;
    });
  }

  if (keygenRun) {
    keygenRun.addEventListener("click", function () {
      keygenRender();
      simPrint("已生成 " + lastGenerated.length + " 枚演示密钥（真实 GSQ 格式）", "ok");
    });
  }

  if (keygenList) {
    keygenList.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-key]");
      if (button) {
        keygenClipboard(button.getAttribute("data-key"), button);
      }
    });
  }

  if (keygenCopy) {
    keygenCopy.addEventListener("click", function () {
      keygenClipboard(lastGenerated.join("\n"), keygenCopy);
    });
  }

  if (keygenCsvButton) {
    keygenCsvButton.addEventListener("click", function () {
      var typeSelect = document.getElementById("keygen-type");
      var durationSelect = document.getElementById("keygen-duration");
      var devicesSelect = document.getElementById("keygen-devices");
      var rows = ["key_code,card_type,duration_or_limit,max_devices"];
      lastGenerated.forEach(function (key) {
        rows.push(
          [
            key,
            typeSelect ? typeSelect.value : "duration",
            durationSelect ? durationSelect.value : "365",
            devicesSelect ? devicesSelect.value : "3",
          ].join(",")
        );
      });
      var blob = new Blob(["\ufeff" + rows.join("\n")], {
        type: "text/csv;charset=utf-8",
      });
      var url = URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "sq-demo-keys.csv";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
      var original = keygenCsvButton.textContent;
      keygenCsvButton.textContent = "已导出";
      window.setTimeout(function () {
        keygenCsvButton.textContent = original;
      }, 1500);
    });
  }

  /* 告警规则沙盒 */
  var ruleMetric = document.getElementById("rule-metric");
  var ruleOperator = document.getElementById("rule-operator");
  var ruleThreshold = document.getElementById("rule-threshold");
  var ruleThresholdValue = document.getElementById("rule-threshold-value");
  var ruleWindow = document.getElementById("rule-window");
  var ruleLine = document.getElementById("rule-line");
  var ruleArea = document.getElementById("rule-area");
  var ruleThresholdLine = document.getElementById("rule-threshold-line");
  var rulePoint = document.getElementById("rule-point");
  var ruleResult = document.getElementById("rule-result");
  var ruleEvaluate = document.getElementById("rule-evaluate");
  var ruleSeries = [];
  var RULE_MAX = {
    online_devices: 1200,
    activation_rate: 100,
    expiration_rate: 100,
    failed_activations: 60,
    tamper_events: 20,
  };

  function ruleSeed(metric) {
    var points = [];
    for (var index = 0; index < 24; index += 1) {
      var wave = Math.sin(index / 3.1) * 0.5 + 0.5;
      var noise = Math.random() * 0.24;
      var value;
      if (metric === "activation_rate") {
        value = 62 + wave * 26 + noise * 14;
      } else if (metric === "expiration_rate") {
        value = 2 + wave * 7 + noise * 5;
      } else if (metric === "failed_activations") {
        value = 4 + wave * 18 + noise * 26;
      } else if (metric === "tamper_events") {
        value = wave * 4 + noise * 6;
      } else {
        value = 220 + wave * 480 + noise * 240;
      }
      points.push(Math.max(0, value));
    }
    return points;
  }

  function ruleRender() {
    if (!ruleLine || !ruleArea) {
      return;
    }
    var max = RULE_MAX[ruleMetric.value] || 100;
    var threshold = Number(ruleThreshold.value);
    var width = 440;
    var height = 150;
    var padding = 12;
    var step = (width - padding * 2) / (ruleSeries.length - 1);
    var path = "";
    var area = "";
    ruleSeries.forEach(function (value, index) {
      var x = padding + index * step;
      var y = height - padding - (Math.min(value, max) / max) * (height - padding * 2);
      path += (index === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    });
    area = path + " L" + (width - padding) + " " + (height - padding) + " L" + padding + " " + (height - padding) + " Z";
    ruleLine.setAttribute("d", path);
    ruleArea.setAttribute("d", area);

    var thresholdY =
      height - padding - (Math.min(threshold, max) / max) * (height - padding * 2);
    ruleThresholdLine.setAttribute("y1", thresholdY.toFixed(1));
    ruleThresholdLine.setAttribute("y2", thresholdY.toFixed(1));

    var operator = ruleOperator.value;
    var index = -1;
    for (var i = 0; i < ruleSeries.length; i += 1) {
      var hit =
        operator === "gte" ? ruleSeries[i] >= threshold : ruleSeries[i] <= threshold;
      if (hit) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      var pointX = padding + index * step;
      var pointY =
        height -
        padding -
        (Math.min(ruleSeries[index], max) / max) * (height - padding * 2);
      rulePoint.setAttribute("cx", pointX.toFixed(1));
      rulePoint.setAttribute("cy", pointY.toFixed(1));
    } else {
      rulePoint.setAttribute("cx", "-20");
      rulePoint.setAttribute("cy", "-20");
    }
    return index;
  }

  function ruleUpdateMetric() {
    var metric = ruleMetric.value;
    var max = RULE_MAX[metric] || 100;
    ruleThreshold.max = String(max);
    ruleThreshold.value = String(Math.round(max * 0.5));
    ruleThresholdValue.textContent = ruleThreshold.value;
    ruleSeries = ruleSeed(metric);
    ruleRender();
    if (ruleResult) {
      ruleResult.className = "rule-result";
      ruleResult.textContent = "调整参数后点「评估一次」。";
    }
  }

  if (ruleMetric && ruleThreshold && ruleLine) {
    ruleSeries = ruleSeed(ruleMetric.value);
    ruleRender();

    ruleMetric.addEventListener("change", ruleUpdateMetric);
    ruleOperator.addEventListener("change", ruleRender);
    ruleWindow.addEventListener("change", ruleRender);
    ruleThreshold.addEventListener("input", function () {
      ruleThresholdValue.textContent = ruleThreshold.value;
      ruleRender();
    });

    ruleEvaluate.addEventListener("click", function () {
      var index = ruleRender();
      var metricLabel =
        ruleMetric.options[ruleMetric.selectedIndex].textContent;
      var operatorLabel =
        ruleOperator.options[ruleOperator.selectedIndex].textContent;
      if (index >= 0) {
        var value = Math.round(ruleSeries[index]);
        ruleResult.className = "rule-result is-fired";
        ruleResult.textContent =
          "触发：第 " +
          (index + 1) +
          " 个采样点 " +
          metricLabel +
          " = " +
          value +
          "，" +
          operatorLabel +
          " 阈值 " +
          ruleThreshold.value +
          "。已生成告警事件，冷却期内不重复触发；通知渠道：邮件 / Webhook / 钉钉 / 企微 / 飞书。";
      } else {
        ruleResult.className = "rule-result is-clear";
        ruleResult.textContent =
          "未触发：" +
          metricLabel +
          " 在当前窗口内没有达到 " +
          operatorLabel +
          " " +
          ruleThreshold.value +
          "，事件保持 resolved。";
      }
      rulePoint.style.transition = "none";
      rulePoint.style.transform = "scale(1.6)";
      window.requestAnimationFrame(function () {
        rulePoint.style.transition = "transform .35s ease";
        rulePoint.style.transform = "scale(1)";
      });
    });
  }

  /* 方案推荐器 */
  var recState = { deploy: "local", distribute: "direct", offline: "yes" };
  var recChips = document.getElementById("rec-chips");
  var recSummary = document.getElementById("rec-summary");
  var recCopy = document.getElementById("rec-copy");

  function recBuild() {
    var modules = ["本地服务器 · SQLite", "管理端", "审计日志", "告警中心（7 指标）"];
    if (recState.deploy === "server") {
      modules.push("HTTPS 远程部署", "主控端", "备份与恢复", "发布白名单");
    } else {
      modules.push("127.0.0.1:8765 单机部署", "本地备份");
    }
    if (recState.distribute === "channel") {
      modules.push("批次管理", "CSV 导出", "整批吊销 / 恢复", "邮箱账号绑定");
    } else {
      modules.push("验证端邮箱登录", "SMTP 邮件", "找回密码");
    }
    if (recState.offline === "yes") {
      modules.push("离线激活码", "发布清单校验", "standalone 验证端");
    } else {
      modules.push("attest 白名单", "在线激活", "心跳在线统计");
    }
    modules.push("Python SDK");
    return modules;
  }

  function recRender() {
    var modules = recBuild();
    if (recChips) {
      recChips.innerHTML = modules
        .map(function (name) {
          return "<span>" + name + "</span>";
        })
        .join("");
    }
    var summary = [
      "# SQ 密钥授权系统 · 推荐组合（测试阶段）",
      "部署位置：" + (recState.deploy === "server" ? "服务器 / 远程" : "单机 / 内网"),
      "分发方式：" + (recState.distribute === "channel" ? "渠道批量分发" : "邮件 / 人工发卡"),
      "离线设备：" + (recState.offline === "yes" ? "有" : "全部联网"),
      "",
      "模块：" + modules.join(" · "),
      "",
      "关键配置：",
      "  security.attest_mode = auto",
      "  security.sdk_attest_exempt = false",
      "  security.channel_allow_private_hosts = false",
      "",
      "下一步：先在独立环境验证激活 / 离线 / 告警全链路，再按 release_package 流程发布。",
    ].join("\n");
    if (recSummary) {
      recSummary.textContent = summary;
    }
    return summary;
  }

  Array.prototype.slice
    .call(document.querySelectorAll(".seg[data-rec]"))
    .forEach(function (group) {
      group.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-value]");
        if (!button) {
          return;
        }
        Array.prototype.slice.call(group.children).forEach(function (item) {
          item.classList.toggle("on", item === button);
        });
        recState[group.getAttribute("data-rec")] = button.getAttribute("data-value");
        recRender();
      });
    });

  if (recCopy) {
    recCopy.addEventListener("click", function () {
      var text = recRender();
      var done = function () {
        var original = recCopy.textContent;
        recCopy.textContent = "已复制";
        window.setTimeout(function () {
          recCopy.textContent = original;
        }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          document.execCommand("copy");
        } catch (error) {
          /* 忽略复制失败 */
        }
        document.body.removeChild(area);
        done();
      }
    });
  }

  recRender();

  /* 按钮点击涟漪（事件委托，覆盖动态生成的按钮） */
  document.addEventListener("click", function (event) {
    var target = event.target.closest(
      ".btn, .sim-risk button, .sim-samples button, .sim-device-actions button, .seg button, .tab, .keygen-row button, .sim-reset, .copy"
    );
    if (!target) {
      return;
    }
    if (!target.classList.contains("ripple-host")) {
      target.classList.add("ripple-host");
    }
    var rect = target.getBoundingClientRect();
    var span = document.createElement("span");
    span.className = "ripple";
    span.style.left = event.clientX - rect.left + "px";
    span.style.top = event.clientY - rect.top + "px";
    target.appendChild(span);
    window.setTimeout(function () {
      span.remove();
    }, 620);
  });

  /* 卡片悬浮倾斜（桌面指针设备） */
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    Array.prototype.slice
      .call(document.querySelectorAll(".sim-card, .feature-card, .deploy-card"))
      .forEach(function (card) {
        card.classList.add("tilt-card");
        card.addEventListener("pointermove", function (event) {
          var rect = card.getBoundingClientRect();
          if (!rect.width || !rect.height) {
            return;
          }
          var px = (event.clientX - rect.left) / rect.width - 0.5;
          var py = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform =
            "perspective(900px) rotateX(" +
            (-py * 2.6).toFixed(2) +
            "deg) rotateY(" +
            (px * 3.2).toFixed(2) +
            "deg) translateY(-2px)";
          card.classList.add("is-tilting");
        });
        card.addEventListener("pointerleave", function () {
          card.style.transform = "";
          card.classList.remove("is-tilting");
        });
      });
  }

  /* ============================================================
     提示条：默认停留 6.5 秒 · 带进度条 · 可关闭 · 悬停/按住暂停
     ============================================================ */
  var toastLayer = document.getElementById("toast-layer");
  var toastStats = { shown: 0, closed: 0, auto: 0, paused: 0 };

  function sqToast(title, text, kind, duration) {
    if (!toastLayer) {
      return null;
    }
    var tone = kind || "info";
    var total = typeof duration === "number" && duration > 0 ? duration : 6500;

    while (toastLayer.children.length >= 4) {
      toastLayer.removeChild(toastLayer.firstElementChild);
    }

    var el = document.createElement("div");
    el.className = "toast toast-" + tone;
    el.style.setProperty("--dur", total + "ms");

    var close = document.createElement("button");
    close.type = "button";
    close.className = "toast-close";
    close.setAttribute("aria-label", "关闭提示");
    close.textContent = "\u00d7";

    var heading = document.createElement("b");
    heading.textContent = title || "提示";

    var body = document.createElement("p");
    body.textContent = text || "";

    var bar = document.createElement("span");
    bar.className = "toast-progress";

    el.appendChild(close);
    el.appendChild(heading);
    el.appendChild(body);
    el.appendChild(bar);
    toastLayer.appendChild(el);
    toastStats.shown += 1;

    var remaining = total;
    var startedAt = Date.now();
    var timer = null;
    var paused = false;
    var closed = false;

    function remove(byUser) {
      if (closed) {
        return;
      }
      closed = true;
      if (timer) {
        window.clearTimeout(timer);
      }
      el.classList.add("is-out");
      if (byUser) {
        toastStats.closed += 1;
      } else {
        toastStats.auto += 1;
      }
      window.setTimeout(function () {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 300);
    }

    function schedule() {
      startedAt = Date.now();
      timer = window.setTimeout(function () {
        remove(false);
      }, remaining);
    }

    function pause() {
      if (paused || closed) {
        return;
      }
      paused = true;
      remaining -= Date.now() - startedAt;
      if (remaining < 1) {
        remaining = 0;
      }
      if (timer) {
        window.clearTimeout(timer);
      }
      el.classList.add("is-paused");
      toastStats.paused += 1;
    }

    function resume() {
      if (!paused || closed) {
        return;
      }
      paused = false;
      el.classList.remove("is-paused");
      if (remaining <= 1) {
        remove(false);
        return;
      }
      schedule();
    }

    close.addEventListener("click", function () {
      remove(true);
    });
    el.addEventListener("pointerenter", function (event) {
      if (event.pointerType !== "touch") {
        pause();
      }
    });
    el.addEventListener("pointerleave", function (event) {
      if (event.pointerType !== "touch") {
        resume();
      }
    });
    el.addEventListener("pointerdown", function () {
      pause();
    });
    el.addEventListener("pointerup", resume);
    el.addEventListener("pointercancel", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    schedule();
    return el;
  }

  window.__sqToast = sqToast;
  window.__sqToastStats = toastStats;

  /* ============================================================
     04 软件全景模拟 · 管理端控制台
     ============================================================ */
  var studioApp = document.getElementById("studio-app");
  var studioStage = document.getElementById("studio-stage");
  var studioActiveView = "overview";
  var studioCounted = false;

  var studioKeys = [
    { code: "GSQ-82K4M-F7Q2N-7F1AT-2HN8P", edition: "专业版", state: "有效", device: "2 / 3", expiry: "2027-03-18", email: "lin@example.com" },
    { code: "GSQ-51QZ3-K9WDM-2C9DX-7RV4T", edition: "企业版", state: "有效", device: "5 / 5", expiry: "2026-12-02", email: "wang@example.com" },
    { code: "GSQ-39MN7-X2LBP-8ABQK-4TK6H", edition: "标准版", state: "已冻结", device: "1 / 1", expiry: "2026-11-21", email: "zhao@example.com" },
    { code: "GSQ-77XT4-N8VJC-4E62M-9QW3R", edition: "专业版", state: "未使用", device: "—", expiry: "2027-01-09", email: "chen@example.com" },
    { code: "GSQ-14PL9-D3C7K-9D3C2-5MZ8V", edition: "标准版", state: "已吊销", device: "0 / 1", expiry: "2026-08-30", email: "liu@example.com" },
    { code: "GSQ-63BR5-Q7YHN-5P5W8-6KD2J", edition: "企业版", state: "有效", device: "3 / 5", expiry: "2027-06-14", email: "sun@example.com" }
  ];

  var studioUsers = [
    { email: "lin@example.com", key: "GSQ-82K4M-F7Q2N-7F1AT-2HN8P", state: "已激活", device: "Windows · 2 台", last: "今天 10:42" },
    { email: "wang@example.com", key: "GSQ-51QZ3-K9WDM-2C9DX-7RV4T", state: "已激活", device: "Windows · 5 台", last: "今天 09:18" },
    { email: "zhao@example.com", key: "GSQ-39MN7-X2LBP-8ABQK-4TK6H", state: "已冻结", device: "Windows · 1 台", last: "昨天 22:07" },
    { email: "chen@example.com", key: "GSQ-77XT4-N8VJC-4E62M-9QW3R", state: "待激活", device: "—", last: "从未登录" },
    { email: "liu@example.com", key: "GSQ-14PL9-D3C7K-9D3C2-5MZ8V", state: "已失效", device: "Windows · 1 台", last: "2026-08-30" }
  ];

  var studioAudit = [
    { time: "10:42:16", cat: "key", text: "admin 吊销密钥 GSQ-14PL9-****-5MZ8V", from: "127.0.0.1" },
    { time: "10:38:02", cat: "mail", text: "告警邮件投递成功 → user@example.com", from: "SMTP 队列" },
    { time: "10:31:44", cat: "risk", text: "风控冻结 GSQ-39MN7-****-4TK6H（新硬件码抢占）", from: "自动裁决" },
    { time: "10:22:09", cat: "key", text: "admin 生成 240 枚密钥并写入批次「双十一渠道批次」", from: "127.0.0.1" },
    { time: "10:07:51", cat: "auth", text: "验证端邮箱登录成功 zhao@example.com", from: "192.168.1.24" },
    { time: "09:58:33", cat: "auth", text: "管理端登录成功 admin", from: "127.0.0.1" },
    { time: "09:44:12", cat: "risk", text: "IP 网段跳变 3 次，触发阈值告警并发送邮件", from: "规则引擎" },
    { time: "09:12:47", cat: "mail", text: "到期提醒邮件投递成功 → wang@example.com", from: "SMTP 队列" },
    { time: "08:55:20", cat: "key", text: "admin 恢复密钥 GSQ-39MN7-****-4TK6H", from: "127.0.0.1" }
  ];

  var studioCatLabel = { auth: "登录认证", key: "密钥操作", risk: "风控与告警", mail: "邮件投递" };

  var studioModal = document.getElementById("studio-modal");
  var studioModalTitle = document.getElementById("studio-modal-title");
  var studioModalText = document.getElementById("studio-modal-text");
  var studioModalOk = document.getElementById("studio-modal-ok");
  var studioModalAction = null;

  function studioOpenModal(title, text, okLabel, onOk) {
    if (!studioModal) {
      if (onOk) {
        onOk();
      }
      return;
    }
    studioModalTitle.textContent = title;
    studioModalText.textContent = text;
    studioModalOk.textContent = okLabel || "确认";
    studioModalAction = onOk || null;
    studioModal.hidden = false;
    studioModalOk.focus();
  }

  function studioCloseModal() {
    if (!studioModal || studioModal.hidden) {
      return;
    }
    studioModal.hidden = true;
    studioModalAction = null;
  }

  if (studioModal) {
    Array.prototype.slice
      .call(studioModal.querySelectorAll("[data-modal-close]"))
      .forEach(function (el) {
        el.addEventListener("click", studioCloseModal);
      });
    studioModalOk.addEventListener("click", function () {
      var action = studioModalAction;
      studioCloseModal();
      if (action) {
        action();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        studioCloseModal();
      }
    });
    /* 焦点锁在弹窗内，避免 Tab 跑到背后的页面 */
    studioModal.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") {
        return;
      }
      var focusables = Array.prototype.slice.call(
        studioModal.querySelectorAll("button:not([disabled])")
      );
      if (focusables.length < 2) {
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    });
  }

  function studioStateClass(state) {
    if (state === "有效" || state === "已激活") {
      return "tag tag-ok";
    }
    if (state === "已冻结" || state === "冻结") {
      return "tag tag-warn";
    }
    if (state === "已吊销" || state === "已失效") {
      return "tag tag-bad";
    }
    return "tag tag-dim";
  }

  var studioKeysHost = document.getElementById("studio-keys");
  var studioKeysMeta = document.getElementById("studio-keys-meta");
  var studioSearch = document.getElementById("studio-search");
  var studioFilter = document.getElementById("studio-filter");
  var studioFilterValue = "all";

  function studioRowActions(item) {
    var wrap = document.createElement("div");
    wrap.className = "studio-row-actions";

    function addButton(label, action) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "mini";
      button.textContent = label;
      button.addEventListener("click", function () {
        action();
      });
      wrap.appendChild(button);
    }

    if (item.state === "有效" || item.state === "未使用") {
      addButton("冻结", function () {
        studioOpenModal(
          "确认冻结",
          item.code + " 冻结后验证端会立即拒绝授权，直到手动恢复。",
          "冻结",
          function () {
            item.state = "已冻结";
            studioRenderKeys();
            sqToast("已冻结密钥", item.code + " 已停止授权，操作已写入审计日志。", "warn");
          }
        );
      });
    }
    if (item.state === "已冻结") {
      addButton("恢复", function () {
        item.state = "有效";
        studioRenderKeys();
        sqToast("已恢复授权", item.code + " 恢复为有效状态。", "ok");
      });
    }
    if (item.state !== "已吊销") {
      addButton("吊销", function () {
        studioOpenModal(
          "确认吊销",
          item.code + " 吊销后不可恢复，绑定用户会收到一封邮件通知。",
          "吊销",
          function () {
            item.state = "已吊销";
            studioRenderKeys();
            sqToast("已吊销密钥", item.code + " 已作废，通知邮件已加入队列。", "bad");
          }
        );
      });
    } else {
      addButton("恢复", function () {
        item.state = "有效";
        studioRenderKeys();
        sqToast("已恢复授权", item.code + " 重新生效。", "ok");
      });
    }
    return wrap;
  }

  function studioRenderKeys() {
    if (!studioKeysHost) {
      return;
    }
    var keyword = studioSearch ? studioSearch.value.trim().toLowerCase() : "";
    var shown = 0;
    studioKeysHost.innerHTML = "";

    studioKeys.forEach(function (item, index) {
      if (studioFilterValue !== "all" && item.state !== studioFilterValue) {
        return;
      }
      if (
        keyword &&
        item.code.toLowerCase().indexOf(keyword) === -1 &&
        item.email.toLowerCase().indexOf(keyword) === -1
      ) {
        return;
      }
      shown += 1;
      var row = document.createElement("div");
      row.className = "studio-tr";
      row.style.animationDelay = (shown - 1) * 40 + "ms";

      var code = document.createElement("code");
      code.textContent = item.code;
      row.appendChild(code);

      var edition = document.createElement("span");
      edition.textContent = item.edition;
      row.appendChild(edition);

      var state = document.createElement("span");
      state.className = studioStateClass(item.state);
      state.textContent = item.state;
      row.appendChild(state);

      var device = document.createElement("span");
      device.textContent = item.device;
      row.appendChild(device);

      var expiry = document.createElement("span");
      expiry.textContent = item.expiry;
      row.appendChild(expiry);

      row.appendChild(studioRowActions(item));
      studioKeysHost.appendChild(row);
      void index;
    });

    if (!shown) {
      var empty = document.createElement("div");
      empty.className = "studio-tr";
      empty.textContent = "没有匹配的密钥，换个关键词或筛选条件。";
      studioKeysHost.appendChild(empty);
    }

    if (studioKeysMeta) {
      studioKeysMeta.textContent =
        "显示 " + shown + " / " + studioKeys.length + " 条演示数据";
    }
  }

  var studioUsersHost = document.getElementById("studio-users");

  function studioRenderUsers() {
    if (!studioUsersHost) {
      return;
    }
    studioUsersHost.innerHTML = "";
    studioUsers.forEach(function (user, index) {
      var row = document.createElement("div");
      row.className = "studio-tr";
      row.style.animationDelay = index * 45 + "ms";

      var mail = document.createElement("span");
      mail.textContent = user.email;
      row.appendChild(mail);

      var key = document.createElement("code");
      key.textContent = user.key;
      row.appendChild(key);

      var state = document.createElement("span");
      state.className = studioStateClass(user.state);
      state.textContent = user.state;
      row.appendChild(state);

      var device = document.createElement("span");
      device.textContent = user.device;
      row.appendChild(device);

      var last = document.createElement("span");
      last.textContent = user.last;
      row.appendChild(last);

      var actions = document.createElement("div");
      actions.className = "studio-row-actions";
      var bind = document.createElement("button");
      bind.type = "button";
      bind.className = "mini";
      bind.textContent = user.state === "待激活" ? "发激活邮件" : "解绑";
      bind.addEventListener("click", function () {
        if (user.state === "待激活") {
          sqToast("激活邮件已发送", user.email + " 会收到绑定指引与密钥明文（仅一次）。", "ok");
        } else {
          studioOpenModal(
            "确认解绑",
            user.email + " 与密钥解绑后，该密钥回到未使用状态，可重新分配。",
            "解绑",
            function () {
              user.state = "待激活";
              user.key = "—";
              user.device = "—";
              studioRenderUsers();
              sqToast("已解绑", user.email + " 已与密钥解除绑定。", "warn");
            }
          );
        }
      });
      actions.appendChild(bind);
      row.appendChild(actions);
      studioUsersHost.appendChild(row);
    });
  }

  var studioAuditHost = document.getElementById("studio-audit");
  var studioAuditFilter = "all";

  function studioRenderAudit() {
    if (!studioAuditHost) {
      return;
    }
    studioAuditHost.innerHTML = "";
    var shown = 0;
    studioAudit.forEach(function (entry) {
      if (studioAuditFilter !== "all" && entry.cat !== studioAuditFilter) {
        return;
      }
      shown += 1;
      var li = document.createElement("li");
      li.style.animationDelay = (shown - 1) * 35 + "ms";

      var time = document.createElement("time");
      time.textContent = entry.time;
      li.appendChild(time);

      var tag = document.createElement("span");
      tag.className = "tag tag-dim";
      tag.textContent = studioCatLabel[entry.cat] || "系统";
      li.appendChild(tag);

      var text = document.createElement("span");
      text.textContent = entry.text;
      li.appendChild(text);

      var from = document.createElement("em");
      from.textContent = entry.from;
      li.appendChild(from);

      studioAuditHost.appendChild(li);
    });
    if (!shown) {
      var empty = document.createElement("li");
      empty.textContent = "该分类暂无记录。";
      studioAuditHost.appendChild(empty);
    }
  }

  function studioCountUp() {
    if (studioCounted) {
      return;
    }
    studioCounted = true;
    Array.prototype.slice
      .call(document.querySelectorAll("[data-studio-count]"))
      .forEach(function (el) {
        var target = Number(el.getAttribute("data-studio-count")) || 0;
        if (reduceMotion) {
          el.textContent = target.toLocaleString("en-US");
          return;
        }
        var start = null;
        var duration = 1100;
        function step(now) {
          if (start === null) {
            start = now;
          }
          var progress = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-US");
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        }
        window.requestAnimationFrame(step);
      });
  }

  function studioSetView(name) {
    if (!studioApp || !name) {
      return;
    }
    var matched = false;
    Array.prototype.slice
      .call(studioApp.querySelectorAll(".studio-nav"))
      .forEach(function (button) {
        var on = button.getAttribute("data-view") === name;
        button.classList.toggle("is-active", on);
        button.setAttribute("aria-selected", String(on));
        if (on) {
          matched = true;
        }
      });
    if (!matched) {
      return;
    }
    Array.prototype.slice
      .call(studioApp.querySelectorAll(".studio-view"))
      .forEach(function (view) {
        view.classList.toggle(
          "is-active",
          view.getAttribute("data-view-panel") === name
        );
      });
    studioActiveView = name;
    if (name === "overview") {
      studioCountUp();
    }
  }

  if (studioApp) {
    Array.prototype.slice
      .call(studioApp.querySelectorAll(".studio-nav"))
      .forEach(function (button) {
        button.addEventListener("click", function () {
          studioSetView(button.getAttribute("data-view"));
        });
      });

    Array.prototype.slice
      .call(studioApp.querySelectorAll("[data-studio-quick]"))
      .forEach(function (button) {
        button.addEventListener("click", function () {
          studioSetView(button.getAttribute("data-studio-quick"));
        });
      });

    /* 侧栏按 WAI-ARIA tab 习惯支持方向键 */
    var studioSide = studioApp.querySelector(".studio-side");
    if (studioSide) {
      studioSide.addEventListener("keydown", function (event) {
        var handled = [
          "ArrowDown",
          "ArrowRight",
          "ArrowUp",
          "ArrowLeft",
          "Home",
          "End",
        ].indexOf(event.key);
        if (handled === -1) {
          return;
        }
        var buttons = Array.prototype.slice.call(
          studioApp.querySelectorAll(".studio-nav")
        );
        var current = buttons.indexOf(document.activeElement);
        if (current === -1) {
          return;
        }
        var next = current;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          next = (current + 1) % buttons.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          next = (current - 1 + buttons.length) % buttons.length;
        } else if (event.key === "Home") {
          next = 0;
        } else {
          next = buttons.length - 1;
        }
        buttons[next].focus();
        studioSetView(buttons[next].getAttribute("data-view"));
        event.preventDefault();
      });
    }

    if (studioFilter) {
      studioFilter.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-filter]");
        if (!button) {
          return;
        }
        studioFilterValue = button.getAttribute("data-filter");
        Array.prototype.slice
          .call(studioFilter.querySelectorAll("button"))
          .forEach(function (item) {
            item.classList.toggle("is-on", item === button);
          });
        studioRenderKeys();
      });
    }

    if (studioSearch) {
      studioSearch.addEventListener("input", studioRenderKeys);
    }

    var studioAuditFilterEl = document.getElementById("studio-audit-filter");
    if (studioAuditFilterEl) {
      studioAuditFilterEl.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-audit]");
        if (!button) {
          return;
        }
        studioAuditFilter = button.getAttribute("data-audit");
        Array.prototype.slice
          .call(studioAuditFilterEl.querySelectorAll("button"))
          .forEach(function (item) {
            item.classList.toggle("is-on", item === button);
          });
        studioRenderAudit();
      });
    }

    var studioCountInput = document.getElementById("studio-count");
    var studioCountValue = document.getElementById("studio-count-value");
    if (studioCountInput && studioCountValue) {
      studioCountInput.addEventListener("input", function () {
        studioCountValue.textContent = studioCountInput.value;
      });
    }

    var studioOutput = document.getElementById("studio-output");
    var studioOutputMeta = document.getElementById("studio-output-meta");
    var studioLastKeys = [];

    function studioExpiry(label) {
      if (label === "永久") {
        return "永久";
      }
      var days = Number(String(label).replace(/[^0-9]/g, "")) || 365;
      var date = new Date();
      date.setDate(date.getDate() + days);
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return (
        date.getFullYear() +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    }

    function studioBatch() {
      var count = studioCountInput ? Number(studioCountInput.value) : 6;
      var editionEl = document.getElementById("studio-edition");
      var durationEl = document.getElementById("studio-duration");
      var devicesEl = document.getElementById("studio-devices");
      var noteEl = document.getElementById("studio-note");
      var edition = editionEl ? editionEl.value : "专业版";
      var duration = durationEl ? durationEl.value : "365 天";
      var devices = devicesEl ? devicesEl.value : "5 台";
      var note = noteEl && noteEl.value.trim() ? noteEl.value.trim() : "未命名批次";

      studioOpenModal(
        "确认生成 " + count + " 枚密钥",
        edition + " · " + duration + " · " + devices + " · 批次「" + note + "」。生成后立即写入密钥管理。",
        "生成",
        function () {
          studioLastKeys = [];
          studioOutput.innerHTML = "";
          for (var index = 0; index < count; index += 1) {
            var code = randomGsqKey();
            studioLastKeys.push({
              code: code,
              edition: edition,
              state: "未使用",
              device: "—",
              expiry: studioExpiry(duration),
              email: "待分配"
            });
            var row = document.createElement("div");
            row.className = "studio-key-row";
            row.style.animationDelay = index * 45 + "ms";
            var codeEl = document.createElement("code");
            codeEl.textContent = code;
            row.appendChild(codeEl);
            var tag = document.createElement("span");
            tag.className = "tag tag-dim";
            tag.textContent = "未使用";
            row.appendChild(tag);
            var copy = document.createElement("button");
            copy.type = "button";
            copy.className = "mini";
            copy.textContent = "复制";
            copy.addEventListener("click", function () {
              var value = this.parentNode.querySelector("code").textContent;
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(value);
              }
              sqToast("已复制", value, "ok", 3200);
            });
            row.appendChild(copy);
            studioOutput.appendChild(row);
          }
          studioKeys = studioLastKeys.slice(0, 3).concat(studioKeys);
          studioRenderKeys();
          if (studioOutputMeta) {
            studioOutputMeta.textContent = count + " 枚 · " + edition + " · " + note;
          }
          sqToast(
            "已生成 " + count + " 枚密钥",
            "批次「" + note + "」写入成功，可在密钥管理里冻结或吊销。",
            "ok"
          );
        }
      );
    }

    var studioGenerate = document.getElementById("studio-generate");
    if (studioGenerate) {
      studioGenerate.addEventListener("click", studioBatch);
    }

    var studioCsv = document.getElementById("studio-generate-csv");
    if (studioCsv) {
      studioCsv.addEventListener("click", function () {
        if (!studioLastKeys.length) {
          sqToast("还没有可导出的结果", "先点「生成并写入批次」。", "warn", 5200);
          return;
        }
        var lines = ["key,edition,state,expiry"];
        studioLastKeys.forEach(function (item) {
          lines.push([item.code, item.edition, item.state, item.expiry].join(","));
        });
        var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "sq-studio-keys.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1500);
        sqToast("已导出 CSV", studioLastKeys.length + " 条记录已下载。", "ok");
      });
    }

    Array.prototype.slice
      .call(studioApp.querySelectorAll("[data-batch-action]"))
      .forEach(function (button) {
        button.addEventListener("click", function () {
          var batch = button.closest(".studio-batch");
          var name = batch ? batch.querySelector("strong").textContent : "该批次";
          var action = button.getAttribute("data-batch-action");
          if (action === "revoke") {
            studioOpenModal(
              "确认整批吊销",
              "批次「" + name + "」内的全部密钥会立即失效，绑定用户会收到邮件通知。",
              "整批吊销",
              function () {
                var tag = batch ? batch.querySelector(".tag") : null;
                if (tag) {
                  tag.className = "tag tag-bad";
                  tag.textContent = "已吊销";
                }
                sqToast("整批已吊销", "批次「" + name + "」已作废，通知邮件进入队列。", "bad");
              }
            );
          } else {
            sqToast("整批已延期", "批次「" + name + "」内密钥到期时间统一延长 30 天。", "ok");
          }
        });
      });

    var studioAlerts = document.getElementById("studio-alerts");
    var studioAlertMeta = document.getElementById("studio-alert-meta");
    if (studioAlerts) {
      studioAlerts.addEventListener("click", function (event) {
        var button = event.target.closest("[data-alert-action]");
        if (!button) {
          return;
        }
        var item = button.closest("li");
        if (!item) {
          return;
        }
        item.classList.add("is-handled");
        button.textContent = "已处理";
        button.disabled = true;
        var left = studioAlerts.querySelectorAll("li:not(.is-handled)").length;
        if (studioAlertMeta) {
          studioAlertMeta.textContent =
            left > 0 ? left + " 条待处理" : "全部已处理";
        }
        sqToast("告警已处理", "已标记为处理完成，处理人 admin，时间已写入审计日志。", "ok");
      });
    }

    var studioFlow = document.getElementById("studio-flow");
    var studioVerdict = document.getElementById("studio-verdict");
    var studioOfflineRun = document.getElementById("studio-offline-run");
    if (studioOfflineRun && studioFlow) {
      studioOfflineRun.addEventListener("click", function () {
        var steps = Array.prototype.slice.call(studioFlow.children);
        steps.forEach(function (step) {
          step.classList.remove("is-active", "is-done");
        });
        if (studioVerdict) {
          studioVerdict.className = "studio-verdict";
          studioVerdict.textContent = "正在校验签名与硬件指纹…";
        }
        steps[2].classList.add("is-active");
        window.setTimeout(function () {
          steps[2].classList.remove("is-active");
          steps[2].classList.add("is-done");
          steps[3].classList.add("is-active");
          if (studioVerdict) {
            studioVerdict.textContent = "验签通过，正在写入本地授权文件…";
          }
        }, 900);
        window.setTimeout(function () {
          steps[3].classList.remove("is-active");
          steps[3].classList.add("is-done");
          if (studioVerdict) {
            studioVerdict.className = "studio-verdict is-ok";
            studioVerdict.textContent =
              "离线激活成功：Ed25519 验签通过，设备指纹 8F3A1-0C4D9-7E2B5 已绑定。";
          }
          sqToast(
            "离线激活成功",
            "签名与设备指纹双重校验通过，授权文件已写入本地。",
            "ok"
          );
        }, 1900);
      });
    }

    var studioOfflineCopy = document.getElementById("studio-offline-copy");
    if (studioOfflineCopy) {
      studioOfflineCopy.addEventListener("click", function () {
        var lic = document.getElementById("studio-lic");
        var value = lic ? lic.textContent.trim() : "";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value);
        }
        sqToast("已复制激活码", "LICACT1 激活码已复制到剪贴板。", "ok", 4000);
      });
    }

    studioRenderKeys();
    studioRenderUsers();
    studioRenderAudit();
  }

  window.__studio = {
    keys: function () {
      return studioKeys.slice();
    },
    view: function () {
      return studioActiveView;
    },
    setView: studioSetView,
    toastCount: function () {
      return toastLayer ? toastLayer.children.length : 0;
    },
    openModal: studioOpenModal,
    modalOpen: function () {
      return Boolean(studioModal && !studioModal.hidden);
    }
  };

  /* ============================================================
     05 三维观影 · 拖拽 / 滑动 / 方向键 / 自动巡览
     ============================================================ */
  var cinemaStage = document.getElementById("cinema-stage");
  var cinemaRail = document.getElementById("cinema-rail");
  var cinemaDots = document.getElementById("cine-dots");
  var cinemaCaption = document.getElementById("cine-caption");
  var cinemaPlay = document.getElementById("cine-play");

  var cineCaptions = [
    "系统概览：密钥总量、激活率、在线并发与待处理告警，一屏看完。",
    "生成密钥：数量、版本、有效期、设备数一次设定，按真实 GSQ 字符集批量出码。",
    "密钥管理：搜索、筛选、冻结、吊销、恢复，危险操作一律二次确认。",
    "离线激活：设备指纹加 Ed25519 签名激活码，断网环境也能完成授权。",
    "告警中心：阈值触发、风控冻结、邮件投递状态集中处理，处理完自动留痕。",
    "邮箱账号：一个邮箱绑定一枚密钥，到期提醒与异常登录都会发信。",
    "审计日志：登录、生成、冻结、吊销、发信全留痕，可按类别筛选。"
  ];

  var cineCards = cinemaRail
    ? Array.prototype.slice.call(cinemaRail.querySelectorAll(".cine-card"))
    : [];
  var cineIndex = 0;
  var cinePos = 0;
  var cinePlaying = false;
  var cineTimer = null;
  var cineDragging = false;
  var cineStartX = 0;
  var cineStartPos = 0;
  var cineMoved = 0;
  var cineLastTime = 0;
  var cineResumeTimer = null;

  function cineStep() {
    if (cineCards.length === 0) {
      return 260;
    }
    /* 用布局宽度，避免被 3D 缩放的 transform 影响步长 */
    var width = cineCards[0].offsetWidth || 320;
    return Math.max(150, width * 0.6);
  }

  function cineLayout(progress) {
    var step = cineStep();
    cineCards.forEach(function (card, index) {
      var offset = index - progress;
      var abs = Math.abs(offset);
      var depth = Math.min(abs, 5);
      var translateX = offset * step;
      var translateZ = -depth * 148;
      var rotateY = Math.max(-44, Math.min(44, -offset * 33));
      var rotateZ = Math.max(-6, Math.min(6, offset * 4));
      var scale = Math.max(0.66, 1 - depth * 0.115);
      card.style.transform =
        "translate3d(calc(-50% + " +
        translateX.toFixed(1) +
        "px), -50%, " +
        translateZ.toFixed(0) +
        "px) rotateY(" +
        rotateY.toFixed(1) +
        "deg) rotate(" +
        rotateZ.toFixed(1) +
        "deg) scale(" +
        scale.toFixed(3) +
        ")";
      card.style.opacity = abs > 4.6 ? "0" : String(Math.max(0.12, 1 - depth * 0.2));
      card.style.filter = abs < 0.55 ? "none" : "blur(" + Math.min(3.6, abs * 1.15).toFixed(2) + "px)";
      card.style.zIndex = String(120 - Math.round(abs * 10));
      card.classList.toggle("is-active", Math.abs(offset) < 0.5);
      card.setAttribute("aria-hidden", abs < 0.5 ? "false" : "true");
    });
  }

  function cineSyncDots() {
    if (!cinemaDots) {
      return;
    }
    Array.prototype.slice
      .call(cinemaDots.querySelectorAll("button"))
      .forEach(function (dot, index) {
        dot.classList.toggle("is-on", index === cineIndex);
        dot.setAttribute("aria-current", index === cineIndex ? "true" : "false");
      });
    if (cinemaCaption) {
      cinemaCaption.textContent = cineCaptions[cineIndex] || "";
    }
  }

  function cineGo(index, immediate) {
    if (!cineCards.length) {
      return;
    }
    var last = cineCards.length - 1;
    cineIndex = Math.max(0, Math.min(last, index));
    cinePos = cineIndex;
    cineCards.forEach(function (card) {
      card.classList.toggle("is-dragging", Boolean(immediate));
    });
    cineLayout(cinePos);
    if (immediate) {
      window.requestAnimationFrame(function () {
        cineCards.forEach(function (card) {
          card.classList.remove("is-dragging");
        });
      });
    }
    cineSyncDots();
  }

  function cineStop() {
    cinePlaying = false;
    if (cineTimer) {
      window.clearInterval(cineTimer);
      cineTimer = null;
    }
    if (cinemaPlay) {
      cinemaPlay.setAttribute("aria-pressed", "false");
      cinemaPlay.textContent = "自动巡览";
    }
  }

  function cineStart() {
    if (reduceMotion || cineCards.length < 2) {
      cineStop();
      sqToast("已开启减少动效", "系统检测到「减少动态效果」，自动巡览不会启动。", "warn");
      return;
    }
    cinePlaying = true;
    if (cinemaPlay) {
      cinemaPlay.setAttribute("aria-pressed", "true");
      cinemaPlay.textContent = "巡览中 · 点击暂停";
    }
    if (cineTimer) {
      window.clearInterval(cineTimer);
    }
    cineTimer = window.setInterval(function () {
      var next = cineIndex + 1;
      if (next >= cineCards.length) {
        next = 0;
      }
      cineGo(next);
    }, 4200);
  }

  function cinePauseThenResume() {
    if (!cinePlaying) {
      return;
    }
    if (cineTimer) {
      window.clearInterval(cineTimer);
      cineTimer = null;
    }
    if (cineResumeTimer) {
      window.clearTimeout(cineResumeTimer);
    }
    cineResumeTimer = window.setTimeout(function () {
      if (cinePlaying) {
        cineStart();
      }
    }, 7000);
  }

  if (cinemaStage && cineCards.length) {
    var cineAutoStarted = false;
    if (cinemaDots) {
      cineCards.forEach(function (card, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "切换到第 " + (index + 1) + " 屏");
        dot.addEventListener("click", function () {
          cineGo(index);
          cinePauseThenResume();
        });
        cinemaDots.appendChild(dot);
      });
    }

    var cinePrev = document.getElementById("cine-prev");
    var cineNext = document.getElementById("cine-next");
    if (cinePrev) {
      cinePrev.addEventListener("click", function () {
        cineGo(cineIndex - 1);
        cinePauseThenResume();
      });
    }
    if (cineNext) {
      cineNext.addEventListener("click", function () {
        cineGo(cineIndex + 1);
        cinePauseThenResume();
      });
    }
    if (cinemaPlay) {
      cinemaPlay.addEventListener("click", function () {
        if (cinePlaying) {
          cineStop();
        } else {
          cineStart();
        }
      });
    }

    cinemaStage.addEventListener("pointerdown", function (event) {
      cineDragging = true;
      cineStartX = event.clientX;
      cineStartPos = cinePos;
      cineMoved = 0;
      cineLastTime = Date.now();
      cinemaStage.classList.add("is-dragging");
      cineCards.forEach(function (card) {
        card.classList.add("is-dragging");
      });
      if (cineTimer) {
        window.clearInterval(cineTimer);
        cineTimer = null;
      }
      if (cinemaStage.setPointerCapture) {
        try {
          cinemaStage.setPointerCapture(event.pointerId);
        } catch (error) {
          void error;
        }
      }
    });

    cinemaStage.addEventListener("pointermove", function (event) {
      if (!cineDragging) {
        return;
      }
      var delta = event.clientX - cineStartX;
      cineMoved = delta;
      var step = cineStep();
      var pos = cineStartPos - delta / step;
      var last = cineCards.length - 1;
      if (pos < 0) {
        pos = pos * 0.35;
      } else if (pos > last) {
        pos = last + (pos - last) * 0.35;
      }
      cinePos = pos;
      cineLayout(cinePos);
      if (Math.abs(delta) > 6 && event.cancelable) {
        event.preventDefault();
      }
    });

    function cineRelease(event) {
      if (!cineDragging) {
        return;
      }
      cineDragging = false;
      cinemaStage.classList.remove("is-dragging");
      cineCards.forEach(function (card) {
        card.classList.remove("is-dragging");
      });
      var step = cineStep();
      var elapsed = Math.max(1, Date.now() - cineLastTime);
      var velocity = elapsed > 12 ? Math.abs(cineMoved) / elapsed : 0;
      var target = Math.round(cinePos);
      if (Math.abs(cineMoved) > step * 0.22 || velocity > 0.6) {
        target = cineMoved < 0 ? Math.ceil(cinePos) : Math.floor(cinePos);
      }
      cineGo(target);
      if (Math.abs(cineMoved) < 6 && event && event.type === "pointerup") {
        var card = event.target.closest ? event.target.closest(".cine-card") : null;
        if (card) {
          var index = Number(card.getAttribute("data-slide"));
          if (!Number.isNaN(index) && index !== cineIndex) {
            cineGo(index);
          }
        }
      }
      cinePauseThenResume();
    }

    cinemaStage.addEventListener("pointerup", cineRelease);
    cinemaStage.addEventListener("pointercancel", cineRelease);
    cinemaStage.addEventListener("lostpointercapture", cineRelease);

    cinemaStage.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        cineGo(cineIndex - 1);
        cinePauseThenResume();
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        cineGo(cineIndex + 1);
        cinePauseThenResume();
        event.preventDefault();
      } else if (event.key === "Home") {
        cineGo(0);
        event.preventDefault();
      } else if (event.key === "End") {
        cineGo(cineCards.length - 1);
        event.preventDefault();
      } else if (event.key === " " || event.key === "Enter") {
        if (cinePlaying) {
          cineStop();
        } else {
          cineStart();
        }
        event.preventDefault();
      }
    });

    cinemaStage.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse" && cinePlaying && cineTimer) {
        window.clearInterval(cineTimer);
        cineTimer = null;
      }
    });
    cinemaStage.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse" && cinePlaying && !cineTimer && !cineDragging) {
        cineStart();
      }
    });

    cineGo(0, true);

    /* 标签页切到后台时停掉自动巡览，回来再续上 */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (cineTimer) {
          window.clearInterval(cineTimer);
          cineTimer = null;
        }
      } else if (cinePlaying && !cineTimer && !cineDragging) {
        cineStart();
      }
    });

    if ("IntersectionObserver" in window) {
      var cineObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !cineAutoStarted) {
              cineAutoStarted = true;
              cineStart();
              return;
            }
            if (!cinePlaying) {
              return;
            }
            if (!entry.isIntersecting && cineTimer) {
              window.clearInterval(cineTimer);
              cineTimer = null;
            } else if (entry.isIntersecting && !cineTimer && !cineDragging) {
              cineStart();
            }
          });
        },
        { threshold: 0.25 }
      );
      cineObserver.observe(cinemaStage);
    }
  }

  window.__cinema = {
    index: function () {
      return cineIndex;
    },
    count: cineCards.length,
    go: cineGo,
    playing: function () {
      return cinePlaying;
    },
    start: cineStart,
    stop: cineStop
  };

  /* ============================================================
     12 作者 · 数字滚动
     ============================================================ */
  var authorCounted = false;

  function authorCountUp() {
    if (authorCounted) {
      return;
    }
    authorCounted = true;
    Array.prototype.slice
      .call(document.querySelectorAll("[data-author-count]"))
      .forEach(function (el) {
        var target = Number(el.getAttribute("data-author-count")) || 0;
        if (reduceMotion) {
          el.textContent = String(target);
          return;
        }
        var start = null;
        var duration = 1000;
        function step(now) {
          if (start === null) {
            start = now;
          }
          var progress = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = String(Math.round(target * eased));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        }
        window.requestAnimationFrame(step);
      });
  }

  /* ============================================================
     新增区块的滚动渐显
     ============================================================ */
  var extraReveal = Array.prototype.slice.call(
    document.querySelectorAll(
      ".studio, .cinema, .author-grid, .studio-tips, .contact-card"
    )
  );
  extraReveal.forEach(function (target) {
    target.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var extraObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("studio")) {
            studioCountUp();
          }
          if (entry.target.classList.contains("author-grid")) {
            authorCountUp();
          }
          extraObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    extraReveal.forEach(function (target) {
      extraObserver.observe(target);
    });
  } else {
    extraReveal.forEach(function (target) {
      target.classList.add("is-visible");
    });
    studioCountUp();
    authorCountUp();
  }

  /* ============================================================
     全局点击特效 · 粒子迸发 + 光标光晕 + 触屏点按反馈
     ============================================================ */
  var clickCanvas = document.getElementById("click-canvas");
  var clickCtx = clickCanvas ? clickCanvas.getContext("2d") : null;
  var burst = [];
  var burstFrame = 0;
  var clickFxStats = { bursts: 0, particles: 0 };

  function burstResize() {
    if (!clickCanvas) {
      return;
    }
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    clickCanvas.width = Math.floor(window.innerWidth * ratio);
    clickCanvas.height = Math.floor(window.innerHeight * ratio);
    if (clickCtx) {
      clickCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  function burstDraw() {
    if (!clickCtx) {
      return;
    }
    clickCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var alive = 0;
    burst.forEach(function (particle) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.965;
      particle.vy = particle.vy * 0.965 + 0.06;
      particle.life -= 0.022;
      if (particle.life <= 0) {
        return;
      }
      alive += 1;
      clickCtx.globalAlpha = Math.max(0, particle.life) * 0.9;
      clickCtx.fillStyle = particle.color;
      clickCtx.beginPath();
      clickCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      clickCtx.fill();
    });
    clickCtx.globalAlpha = 1;
    burst = burst.filter(function (particle) {
      return particle.life > 0;
    });
    clickFxStats.particles = burst.length;
    if (alive > 0) {
      burstFrame = window.requestAnimationFrame(burstDraw);
    } else {
      burstFrame = 0;
      clickCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function burstAt(x, y, strength) {
    if (!clickCanvas || !clickCtx || reduceMotion) {
      return;
    }
    var colors = ["#4a86ff", "#2f6be4", "#22d3c5", "#8fb6ff"];
    var count = strength === "big" ? 22 : 13;
    for (var index = 0; index < count; index += 1) {
      var angle = (Math.PI * 2 * index) / count + Math.random() * 0.5;
      var speed = 1.4 + Math.random() * (strength === "big" ? 3.6 : 2.4);
      burst.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        radius: 1 + Math.random() * 2.1,
        life: 0.85 + Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    clickFxStats.bursts += 1;
    if (!burstFrame) {
      burstFrame = window.requestAnimationFrame(burstDraw);
    }
  }

  var cursorHalo = document.getElementById("cursor-halo");
  var haloX = 0;
  var haloY = 0;
  var haloActive = false;

  function haloLoop() {
    if (!cursorHalo || !haloActive) {
      return;
    }
    cursorHalo.style.transform =
      "translate3d(" + haloX.toFixed(1) + "px, " + haloY.toFixed(1) + "px, 0)";
    window.requestAnimationFrame(haloLoop);
  }

  if (clickCanvas) {
    burstResize();
    window.addEventListener("resize", burstResize, { passive: true });
    window.addEventListener("orientationchange", burstResize, { passive: true });
  }

  document.addEventListener(
    "pointerdown",
    function (event) {
      var interactive = event.target.closest(
        "a, button, input, select, summary, .studio-nav, .cine-card, .tab, .sim-card"
      );
      burstAt(event.clientX, event.clientY, interactive ? "big" : "small");

      /* 冲击波环：点哪儿扩哪儿 */
      if (!reduceMotion) {
        var ring = document.createElement("span");
        ring.className = "click-ring" + (interactive ? "" : " is-soft");
        ring.style.left = event.clientX + "px";
        ring.style.top = event.clientY + "px";
        document.body.appendChild(ring);
        clickFxStats.rings = (clickFxStats.rings || 0) + 1;
        window.setTimeout(function () {
          if (ring.parentNode) {
            ring.parentNode.removeChild(ring);
          }
        }, 980);
      }

      /* 支持的安卓浏览器给一点轻振 */
      if (event.pointerType === "touch" && navigator.vibrate) {
        try {
          navigator.vibrate(8);
        } catch (error) {
          void error;
        }
      }

      if (cursorHalo && event.pointerType === "mouse") {
        cursorHalo.classList.add("is-hot");
      }

      if (event.target.closest(".btn, .mini, .tab, .cine-arrow, .cine-play, .studio-nav, .studio-switch, .copy")) {
        var el = event.target.closest(".btn, .mini, .tab, .cine-arrow, .cine-play, .studio-nav, .studio-switch, .copy");
        el.classList.remove("tap-pop");
        void el.offsetWidth;
        el.classList.add("tap-pop");
        window.setTimeout(function () {
          el.classList.remove("tap-pop");
        }, 340);
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerup",
    function (event) {
      if (cursorHalo && event.pointerType === "mouse") {
        cursorHalo.classList.remove("is-hot");
      }
    },
    { passive: true }
  );

  if (cursorHalo && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var haloSeen = false;
    document.addEventListener("pointermove", function (event) {
      if (event.pointerType !== "mouse") {
        return;
      }
      haloX = event.clientX;
      haloY = event.clientY;
      if (!haloSeen) {
        haloSeen = true;
        haloActive = true;
        cursorHalo.classList.add("is-on");
        cursorHalo.style.transform =
          "translate3d(" + haloX.toFixed(1) + "px, " + haloY.toFixed(1) + "px, 0)";
        haloLoop();
      }
    });
    document.addEventListener("mouseleave", function () {
      haloActive = false;
      cursorHalo.classList.remove("is-on");
    });
    document.addEventListener("mouseenter", function () {
      if (!haloActive) {
        haloActive = true;
        cursorHalo.classList.add("is-on");
        haloLoop();
      }
    });
  }

  window.__clickFx = clickFxStats;

  /* ============================================================
     06 4D 全景 · WebGL 实时场景（自写着色器，无外部依赖）
     ============================================================ */
  var gl4dState = {
    ok: false,
    fps: 0,
    nodes: 288,
    depth: 0,
    nonBlank: 0,
    error: "",
    mode: "auto",
    rotation: { yaw: 0, pitch: 0 },
    zoom: 0,
  };
  window.__gl4d = gl4dState;

  (function initScene4d() {
    var stage = document.getElementById("stage4d");
    var canvas = document.getElementById("gl-canvas");
    var fallback = document.getElementById("stage4d-fallback");
    if (!stage || !canvas) {
      return;
    }

    var fpsEl = document.getElementById("stage4d-fps");
    var nodesEl = document.getElementById("stage4d-nodes");
    var depthEl = document.getElementById("stage4d-depth");
    var modeEl = document.getElementById("stage4d-mode");
    var tipEl = null;
    var resetEl = document.getElementById("topo-reset");

    var vertexSrc = [
      "attribute vec2 aPos;",
      "void main() {",
      "  gl_Position = vec4(aPos, 0.0, 1.0);",
      "}",
    ].join("\n");

    var fragmentSrc = [
      "precision highp float;",
      "uniform vec2 uRes;",
      "uniform float uTime;",
      "uniform vec2 uRot;",
      "uniform float uZoom;",
      "uniform float uScroll;",
      "uniform vec4 uBurst;",
      "",
      "float hash21(vec2 p) {",
      "  p = fract(p * vec2(123.34, 456.21));",
      "  p += dot(p, p + 45.32);",
      "  return fract(p.x * p.y);",
      "}",
      "",
      "mat2 rot2(float a) {",
      "  float c = cos(a);",
      "  float s = sin(a);",
      "  return mat2(c, -s, s, c);",
      "}",
      "",
      "void main() {",
      "  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;",
      "  vec3 col = vec3(0.014, 0.021, 0.039);",
      "",
      "  // 地平线光晕 + 远景太阳",
      "  col += vec3(0.05, 0.13, 0.32) * exp(-abs(uv.y + 0.06) * 5.0);",
      "  float sun = exp(-length(vec2(uv.x * 0.7, uv.y + 0.07)) * 5.5);",
      "  col += vec3(0.16, 0.34, 0.82) * sun * 0.6;",
      "",
      "  // 星空（第 4 维：闪烁随帧变化）",
      "  float star = hash21(mod(floor((uv + vec2(uRot.x * 0.12, 0.0)) * 92.0), 128.0));",
      "  float twinkle = pow(star, 240.0) * (0.55 + 0.45 * sin(uTime * 2.6 + star * 70.0));",
      "  col += vec3(0.66, 0.82, 1.0) * twinkle * smoothstep(-0.32, 0.45, uv.y) * 2.4;",
      "",
      "  vec3 rd = normalize(vec3(uv.x, uv.y, -1.0));",
      "  rd.xz = rot2(uRot.x) * rd.xz;",
      "  rd.yz = rot2(uRot.y) * rd.yz;",
      "  vec3 ro = vec3(0.0, 1.25, uTime * 0.85 + uZoom);",
      "  ro.y -= uScroll * 0.3;",
      "",
      "  if (rd.y < -0.002) {",
      "    float t = -ro.y / rd.y;",
      "    vec3 p = ro + rd * t;",
      "    vec2 g = abs(fract(p.xz * 0.22) - 0.5);",
      "    float w = 0.014 + 0.0035 * t;",
      "    float line = 1.0 - smoothstep(0.0, w, min(g.x, g.y));",
      "    float fade = exp(-t * 0.055);",
      "    col += vec3(0.17, 0.42, 1.0) * line * fade * 1.75;",
      "    // 交点上的数据节点，而不是整块亮面",
      "    float nodeMask = smoothstep(0.17, 0.0, length(g));",
      "    float cell = hash21(mod(floor(p.xz * 0.22), 64.0));",
      "    col += vec3(0.36, 0.76, 1.0) * nodeMask * step(0.52, cell) * fade * 1.5;",
      "  }",
      "",
      "  for (int i = 0; i < 2; i++) {",
      "    float scale = 5.0 + float(i) * 3.5;",
      "    vec2 sp = uv * scale;",
      "    sp.x += uRot.x * 3.0;",
      "    sp.y += uTime * (0.16 + float(i) * 0.09) + uScroll * 0.7;",
      "    vec2 cell = mod(floor(sp), 64.0);",
      "    vec2 f = fract(sp) - 0.5;",
      "    float h = hash21(cell);",
      "    vec2 off = 0.4 * vec2(sin(h * 6.2831), cos(h * 5.13));",
      "    float node = smoothstep(0.06, 0.0, length(f - off)) * step(0.78, h);",
      "    vec3 tint = mix(vec3(0.36, 0.7, 1.0), vec3(0.24, 1.0, 0.84), h);",
      "    col += tint * node * 1.7;",
      "  }",
      "",
      "  if (uBurst.z >= 0.0 && uBurst.z < 1.7) {",
      "    vec2 bp = (uBurst.xy - 0.5 * uRes) / uRes.y;",
      "    vec2 d = uv - bp;",
      "    float r = uBurst.z * 0.95;",
      "    float ring = smoothstep(0.05, 0.0, abs(length(d) - r));",
      "    col += vec3(0.5, 0.78, 1.0) * ring * (1.0 - uBurst.z / 1.7) * 2.4 * uBurst.w;",
      "  }",
      "",
      "  col *= 1.0 - 0.42 * dot(uv, uv);",
      "  col = col / (col + vec3(0.82));",
      "  gl_FragColor = vec4(pow(col, vec3(0.92)), 1.0);",
      "}",
    ].join("\n");

    function fail(message) {
      gl4dState.error = message;
      gl4dState.ok = false;
      if (fallback) {
        fallback.hidden = false;
      }
      canvas.style.display = "none";
    }

    var gl = null;
    try {
      gl =
        canvas.getContext("webgl", {
          alpha: false,
          antialias: false,
          depth: false,
          powerPreference: "high-performance",
        }) || canvas.getContext("experimental-webgl");
    } catch (error) {
      gl = null;
    }
    if (!gl) {
      fail("no-webgl");
      return;
    }

    function compile(type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(log || "shader-compile-failed");
      }
      return shader;
    }

    var program = null;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSrc));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSrc));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "link-failed");
      }
    } catch (error) {
      fail(String(error && error.message ? error.message : error));
      return;
    }

    gl.useProgram(program);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    var aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uniforms = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      rot: gl.getUniformLocation(program, "uRot"),
      zoom: gl.getUniformLocation(program, "uZoom"),
      scroll: gl.getUniformLocation(program, "uScroll"),
      burst: gl.getUniformLocation(program, "uBurst"),
    };

    gl4dState.ok = true;
    if (fallback) {
      fallback.hidden = true;
    }

    var view = { yaw: 0, pitch: 0, zoom: 0 };
    var autoRotate = !reduceMotion;
    var dragging = false;
    var dragStart = null;
    var pointers = {};
    var pinchDistance = 0;
    var burst = { x: 0, y: 0, start: -10, strength: 0 };
    var running = false;
    var frameId = 0;
    var startTime = performance.now();
    var frameCount = 0;
    var fpsStamp = startTime;
    var visible = true;
    var sampled = 0;
    var probeSize = 32;
    var samplePixels = new Uint8Array(probeSize * probeSize * 4);
    /*
     * 主缓冲没有 preserveDrawingBuffer，readPixels 拿不到内容；
     * 这里额外挂一个小离屏缓冲专做「画面非空白」自检，不影响主渲染。
     */
    var probeFbo = gl.createFramebuffer();
    var probeTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, probeTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      probeSize,
      probeSize,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, probeFbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      probeTex,
      0
    );
    var probeReady =
      gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    /* 滚轮只在用户点过场景后才推纵深，避免把页面滚动抢掉 */
    var wheelArmed = false;

    function resize() {
      var rect = stage.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      var width = Math.max(1, Math.floor(rect.width * dpr));
      var height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    function draw(now) {
      var seconds = (now - startTime) / 1000;
      var rect = stage.getBoundingClientRect();
      var scrollFactor = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
      );

      if (autoRotate && !dragging) {
        view.yaw += 0.0016;
        view.pitch = Math.sin(seconds * 0.22) * 0.06;
      }

      /* 第 4 维：自动漫游时镜头轻微呼吸，手动推的纵深不会被覆盖 */
      var breathe = autoRotate && !dragging ? Math.sin(seconds * 0.16) * 1.6 : 0;

      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, reduceMotion ? 6 : seconds);
      gl.uniform2f(uniforms.rot, view.yaw, view.pitch);
      gl.uniform1f(uniforms.zoom, view.zoom + breathe);
      gl.uniform1f(uniforms.scroll, scrollFactor);
      gl.uniform4f(
        uniforms.burst,
        burst.x * canvas.width,
        burst.y * canvas.height,
        burst.start < 0 ? -1 : seconds - burst.start,
        burst.strength
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      frameCount += 1;
      if ((frameCount === 1 || frameCount % 12 === 0) && probeReady) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, probeFbo);
        gl.viewport(0, 0, probeSize, probeSize);
        gl.uniform2f(uniforms.res, probeSize, probeSize);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.readPixels(
          0,
          0,
          probeSize,
          probeSize,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          samplePixels
        );
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.res, canvas.width, canvas.height);
        var lit = 0;
        for (var index = 0; index < samplePixels.length; index += 4) {
          if (
            samplePixels[index] +
              samplePixels[index + 1] +
              samplePixels[index + 2] >
            12
          ) {
            lit += 1;
          }
        }
        sampled = lit;
        gl4dState.nonBlank = lit;
        gl4dState.probe = {
          ready: probeReady,
          first: [
            samplePixels[0],
            samplePixels[1],
            samplePixels[2],
            samplePixels[3],
          ],
        };
      }
      if (now - fpsStamp > 500) {
        gl4dState.fps = Math.round((frameCount * 1000) / (now - fpsStamp));
        frameCount = 0;
        fpsStamp = now;
        if (fpsEl) {
          fpsEl.textContent = String(gl4dState.fps);
        }
        gl4dState.depth = view.zoom;
      }
    }

    function loop(now) {
      frameId = window.requestAnimationFrame(loop);
      draw(now);
    }

    function start() {
      if (running) {
        return;
      }
      running = true;
      fpsStamp = performance.now();
      frameCount = 0;
      frameId = window.requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }

    resize();
    gl.clearColor(0.02, 0.03, 0.06, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (reduceMotion) {
      draw(performance.now());
      gl4dState.mode = "reduced";
    } else {
      start();
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("orientationchange", resize, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else if (visible && !reduceMotion) {
        start();
      }
    });

    if ("IntersectionObserver" in window) {
      var stageObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            visible = entry.isIntersecting;
            if (visible && !reduceMotion) {
              start();
            } else {
              stop();
            }
          });
        },
        { threshold: 0.08 }
      );
      stageObserver.observe(stage);
    }

    /* 全景触控：拖动转视角，双指/滚轮推纵深，单击冲击波 */
    function localPoint(event) {
      var rect = stage.getBoundingClientRect();
      var dpr = canvas.width / Math.max(1, rect.width);
      return {
        x: ((event.clientX - rect.left) * dpr) / canvas.width,
        y: 1 - ((event.clientY - rect.top) * dpr) / canvas.height,
      };
    }

    stage.addEventListener("pointerdown", function (event) {
      pointers[event.pointerId] = { x: event.clientX, y: event.clientY };
      if (Object.keys(pointers).length === 1) {
        dragging = true;
        wheelArmed = true;
        dragStart = {
          x: event.clientX,
          y: event.clientY,
          yaw: view.yaw,
          pitch: view.pitch,
          moved: 0,
        };
        stage.classList.add("is-dragging");
      }
      if (Object.keys(pointers).length === 2) {
        var ids = Object.keys(pointers);
        pinchDistance = Math.hypot(
          pointers[ids[0]].x - pointers[ids[1]].x,
          pointers[ids[0]].y - pointers[ids[1]].y
        );
      }
      /* 点在节点/按钮上时不抢指针，否则 click 会被算到舞台头上，节点点不动 */
      var onControl = event.target.closest
        ? event.target.closest(".topo-node, button")
        : null;
      if (stage.setPointerCapture && !onControl) {
        try {
          stage.setPointerCapture(event.pointerId);
        } catch (error) {
          void error;
        }
      }
    });

    stage.addEventListener("pointermove", function (event) {
      if (!pointers[event.pointerId]) {
        return;
      }
      pointers[event.pointerId] = { x: event.clientX, y: event.clientY };
      var ids = Object.keys(pointers);
      if (ids.length >= 2) {
        var dist = Math.hypot(
          pointers[ids[0]].x - pointers[ids[1]].x,
          pointers[ids[0]].y - pointers[ids[1]].y
        );
        if (pinchDistance) {
          view.zoom += (dist - pinchDistance) * 0.035;
          view.zoom = Math.max(-6, Math.min(28, view.zoom));
        }
        pinchDistance = dist;
        return;
      }
      if (!dragging || !dragStart) {
        return;
      }
      var dx = event.clientX - dragStart.x;
      var dy = event.clientY - dragStart.y;
      dragStart.moved = Math.max(dragStart.moved, Math.abs(dx) + Math.abs(dy));
      view.yaw = dragStart.yaw + dx * 0.005;
      view.pitch = Math.max(
        -0.42,
        Math.min(0.42, dragStart.pitch + dy * 0.0035)
      );
      gl4dState.rotation = { yaw: view.yaw, pitch: view.pitch };
      /* 第一次拖动就停掉自动漫游，链路要稳着看 */
      if (autoRotate && dragStart.moved > 12) {
        autoRotate = false;
      }
      var plane = document.getElementById("topo-plane");
      if (plane) {
        plane.style.setProperty(
          "--topo-ry",
          Math.max(-26, Math.min(26, dx * 0.02)).toFixed(2) + "deg"
        );
        plane.style.setProperty(
          "--topo-rx",
          Math.max(-6, Math.min(30, 12 - dy * 0.02)).toFixed(2) + "deg"
        );
      }
    });

    function endPointer(event) {
      var wasTap =
        dragging && dragStart && dragStart.moved < 8 && Object.keys(pointers).length === 1;
      delete pointers[event.pointerId];
      if (Object.keys(pointers).length < 2) {
        pinchDistance = 0;
      }
      if (Object.keys(pointers).length === 0) {
        dragging = false;
        stage.classList.remove("is-dragging");
        if (wasTap) {
          var point = localPoint(event);
          burst = { x: point.x, y: point.y, start: (performance.now() - startTime) / 1000, strength: 1.35 };
          gl4dState.lastBurst = true;
          if (tipEl) {
            tipEl.textContent = "冲击波已触发 —— 再拖动看看角度。";
          }
        }
        dragStart = null;
      }
    }

    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);

    stage.addEventListener(
      "wheel",
      function (event) {
        if (!wheelArmed && !event.ctrlKey) {
          return;
        }
        view.zoom = Math.max(-6, Math.min(28, view.zoom + event.deltaY * 0.006));
        gl4dState.zoom = view.zoom;
        if (event.cancelable) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    stage.addEventListener("pointerleave", function () {
      wheelArmed = false;
    });

    if (resetEl) {
      resetEl.addEventListener("click", function () {
        view.yaw = 0;
        view.pitch = 0;
        view.zoom = 0;
        gl4dState.rotation = { yaw: 0, pitch: 0 };
        gl4dState.zoom = 0;
        burst = { x: 0, y: 0, start: -10, strength: 0 };
        if (tipEl) {
          tipEl.textContent = "视角已重置 —— 按住拖动可以继续探索。";
        }
        if (!running && !reduceMotion) {
          start();
        }
      });
    }

    gl4dState.sample = function () {
      return sampled;
    };
    /* 节点数由链路调试器负责显示，这里不再覆盖 */
    void nodesEl;
  })();

  /* ============================================================
     06 · 3D 授权链路调试器：拓扑 / 场景运行器 / 节点详情
     ============================================================ */
  (function initTopologyDebugger() {
    var stage = document.getElementById("stage4d");
    var plane = document.getElementById("topo-plane");
    var svg = document.getElementById("topo-links");
    if (!stage || !plane || !svg) {
      return;
    }

    var NS = "http://www.w3.org/2000/svg";
    var nodeEls = {};
    Array.prototype.slice
      .call(plane.querySelectorAll(".topo-node"))
      .forEach(function (el) {
        nodeEls[el.getAttribute("data-node")] = el;
      });

    var layout = {
      wide: {
        client: [9, 52],
        api: [29, 52],
        core: [49, 52],
        risk: [69, 22],
        notify: [87, 66],
      },
      narrow: {
        client: [20, 20],
        api: [52, 13],
        core: [82, 26],
        risk: [28, 72],
        notify: [72, 84],
      },
    };

    var linkDefs = [
      { id: "client-api", from: "client", to: "api" },
      { id: "api-core", from: "api", to: "core" },
      { id: "core-risk", from: "core", to: "risk" },
      { id: "risk-notify", from: "risk", to: "notify" },
      { id: "core-client", from: "core", to: "client", ret: true },
    ];

    var linkEls = {};
    linkDefs.forEach(function (def) {
      var path = document.createElementNS(NS, "path");
      path.setAttribute("class", "topo-link" + (def.ret ? " is-return" : ""));
      svg.appendChild(path);
      linkEls[def.id] = path;
    });

    var defs = document.createElementNS(NS, "defs");
    var glow = document.createElementNS(NS, "filter");
    glow.setAttribute("id", "topo-glow");
    glow.setAttribute("x", "-80%");
    glow.setAttribute("y", "-80%");
    glow.setAttribute("width", "260%");
    glow.setAttribute("height", "260%");
    var blur = document.createElementNS(NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "3.4");
    blur.setAttribute("result", "blur");
    var merge = document.createElementNS(NS, "feMerge");
    ["blur", "SourceGraphic"].forEach(function (input) {
      var node = document.createElementNS(NS, "feMergeNode");
      node.setAttribute("in", input);
      merge.appendChild(node);
    });
    glow.appendChild(blur);
    glow.appendChild(merge);
    defs.appendChild(glow);
    svg.appendChild(defs);

    var packet = document.createElementNS(NS, "circle");
    packet.setAttribute("r", "5");
    packet.setAttribute("fill", "#9fd4ff");
    packet.setAttribute("filter", "url(#topo-glow)");
    packet.setAttribute("opacity", "0");
    svg.appendChild(packet);

    function toSvg(point) {
      return [point[0] * 10, point[1] * 4.6];
    }

    var currentLayout = layout.wide;

    function applyLayout() {
      var narrow = window.matchMedia("(max-width: 1080px)").matches;
      currentLayout = narrow ? layout.narrow : layout.wide;
      Object.keys(nodeEls).forEach(function (id) {
        var point = currentLayout[id];
        if (!point) {
          return;
        }
        nodeEls[id].style.left = point[0] + "%";
        nodeEls[id].style.top = point[1] + "%";
      });
      linkDefs.forEach(function (def) {
        var path = linkEls[def.id];
        var a = toSvg(currentLayout[def.from]);
        var b = toSvg(currentLayout[def.to]);
        if (def.ret) {
          var cx = (a[0] + b[0]) / 2;
          var cy = Math.min(a[1], b[1]) - 96;
          path.setAttribute(
            "d",
            "M" + a[0] + " " + a[1] + " Q" + cx + " " + cy + " " + b[0] + " " + b[1]
          );
        } else {
          path.setAttribute(
            "d",
            "M" + a[0] + " " + a[1] + " L" + b[0] + " " + b[1]
          );
        }
      });
    }

    applyLayout();
    window.addEventListener("resize", applyLayout, { passive: true });

    var nodeInfo = {
      client: {
        title: "客户端 · 验证端 / 管理端 / SDK",
        body: "发起激活、心跳与离线激活；启动时先做自身完整性自检，发现 EXE 或发布目录被增删改，本地就直接拒绝，不等服务器回话。",
        list: [
          ["职责", "激活 · 心跳（带随机抖动） · 离线激活码校验"],
          ["关键校验", "release_manifest.json + Ed25519 签名"],
          ["失败表现", "403 拒绝 + 本地弹窗 + 上报完整性事件"],
        ],
      },
      api: {
        title: "本地服务器 API · 78 个接口",
        body: "所有请求先过 HMAC-SHA256 签名校验与限流，再做参数与角色判定；响应统一由 Ed25519 签名，客户端会逐个验签。",
        list: [
          ["鉴权", "HMAC-SHA256 请求签名 + 时间窗校验"],
          ["性能兜底", "统计缓存 · 过期扫描节流 · 空队列不抢写锁"],
          ["接口规模", "server/api.py 共 78 条路由"],
        ],
      },
      core: {
        title: "授权内核 · SQLite 状态机",
        body: "密钥生命周期、设备位原子占用、批次吊销与恢复都在事务里完成；状态只有有效 / 未使用 / 冻结 / 吊销 / 过期几种，不允许多头真相。",
        list: [
          ["设备位", "max_devices 事务内原子占用，并发不超卖"],
          ["批次", "整批吊销 / 整批延期 / 渠道分发"],
          ["留痕", "每次状态变更写 audit_logs"],
        ],
      },
      risk: {
        title: "风控与完整性引擎",
        body: "把异常翻译成裁决：新硬件码抢占直接封禁，IP 网段在时间窗内超过 2 次自动发告警，完整性事件 ≥1 触发高优先级通知。",
        list: [
          ["风控事件", "risk_events"],
          ["完整性事件", "tamper_events"],
          ["规则引擎", "7 类指标 + 阈值 / 冷却 / 三态事件"],
        ],
      },
      notify: {
        title: "通知通道 · 邮件为主",
        body: "告警由主控端发出，收件人是验证端绑定的邮箱。邮件失败会退避重试；Webhook、钉钉、企微、飞书按规则挂载。",
        list: [
          ["邮件", "SMTP 配置 + 模板 + 队列重试"],
          ["其它渠道", "Webhook · 钉钉 · 企微 · 飞书"],
          ["收件人", "验证端绑定邮箱（一个邮箱一枚密钥）"],
        ],
      },
    };

    var scenarios = {
      normal: {
        title: "正常激活",
        status: "通过",
        tone: "ok",
        verdict:
          "激活成功：设备位占用 1/3，到期 2027-03-18，激活记录与审计日志均已写入。",
        steps: [
          { node: "client", tag: "请求", text: "验证端提交激活请求：密钥 + 设备指纹 8F3A1-0C4D9-7E2B5。" },
          { node: "api", link: "client-api", tag: "验签", tone: "ok", text: "HMAC-SHA256 请求签名通过，未命中限流。" },
          { node: "core", link: "api-core", tag: "状态机", tone: "ok", text: "密钥 unused → active，设备位 1/3 原子占用。" },
          { node: "risk", link: "core-risk", tag: "风控", tone: "ok", text: "硬件码首次出现，IP 网段 1/2，未触发任何规则。" },
          { node: "core", link: "core-client", tag: "回执", tone: "ok", text: "签发会话密钥并返回，客户端验签通过。" },
        ],
      },
      expired: {
        title: "密钥已过期",
        status: "拒绝 + 告警",
        tone: "bad",
        verdict:
          "授权被拒：密钥已过期。同时触发过期率指标告警，到期提醒邮件已投递给绑定邮箱。",
        steps: [
          { node: "client", tag: "请求", text: "验证端提交激活请求。" },
          { node: "api", link: "client-api", tag: "验签", tone: "ok", text: "请求签名通过。" },
          { node: "core", link: "api-core", tag: "拒绝", tone: "bad", text: "expires_at 已过期，状态置为 expired，不再签发会话。" },
          { node: "risk", link: "core-risk", tag: "指标", tone: "warn", text: "expiration_rate 上升，窗口内越过阈值，规则触发。" },
          { node: "notify", link: "risk-notify", tag: "投递", tone: "warn", text: "到期提醒邮件进入队列并投递成功。" },
        ],
      },
      device: {
        title: "新硬件码抢占",
        status: "封禁 + 告警",
        tone: "bad",
        verdict:
          "已直接封禁授权并发出高等级告警：判定为克隆或共用，主控可解封或换绑设备。",
        steps: [
          { node: "client", tag: "请求", text: "请求携带新硬件码 B41C9-73E0A-19F6D。" },
          { node: "api", link: "client-api", tag: "验签", tone: "ok", text: "请求签名通过，进入内核裁决。" },
          { node: "core", link: "api-core", tag: "设备位", tone: "warn", text: "该密钥设备位 3/3 已满，新指纹不在绑定列表内。" },
          { node: "risk", link: "core-risk", tag: "裁决", tone: "bad", text: "命中「新硬件码抢占」规则：直接封禁，risk_events +1。" },
          { node: "notify", link: "risk-notify", tag: "通知", tone: "bad", text: "高优先级邮件 + Webhook 同步发出，事件写入告警中心。" },
        ],
      },
      ip: {
        title: "IP 网段跳动",
        status: "告警（未封禁）",
        tone: "warn",
        verdict:
          "本次只告警不封禁：2 小时内跨网段 3 次，已超过 2 次阈值，邮件已发给绑定邮箱。",
        steps: [
          { node: "client", tag: "心跳", text: "验证端按 120 秒间隔发送心跳。" },
          { node: "api", link: "client-api", tag: "会话", tone: "ok", text: "会话签名有效，心跳被接受。" },
          { node: "core", link: "api-core", tag: "记录", tone: "ok", text: "写入本次访问 IP 网段，供风控按时间窗统计。" },
          { node: "risk", link: "core-risk", tag: "判定", tone: "warn", text: "窗口内第 3 次跨网段，超过 2 次阈值，规则触发。" },
          { node: "notify", link: "risk-notify", tag: "通知", tone: "warn", text: "中优先级邮件发出；授权保持有效，等待人工确认。" },
        ],
      },
      tamper: {
        title: "发布文件被改",
        status: "拒绝 + 告警",
        tone: "bad",
        verdict:
          "直接拒绝访问：客户端自检发现文件多了 / 少了 / 被改，本地弹窗告警并上报完整性事件。",
        steps: [
          { node: "client", tag: "自检", text: "启动自检：EXE 自身哈希 + 目录清单逐个比对。" },
          { node: "client", link: null, tag: "发现", tone: "bad", text: "release_manifest 哈希不一致，目录存在额外文件。" },
          { node: "api", link: "client-api", tag: "拒绝", tone: "bad", text: "完整性校验未通过，服务端直接返回 403。" },
          { node: "risk", link: "core-risk", tag: "告警", tone: "bad", text: "tamper_events +1，命中「完整性告警 ≥ 1」规则。" },
          { node: "notify", link: "risk-notify", tag: "通知", tone: "bad", text: "高优先级邮件 + 本地弹窗同时触发。" },
        ],
      },
    };

    var logEl = document.getElementById("topo-log");
    var statusEl = document.getElementById("topo-status");
    var stepCountEl = document.getElementById("stage4d-depth");
    var modeEl = document.getElementById("stage4d-mode");
    var detailTitle = document.getElementById("topo-detail-title");
    var detailBody = document.getElementById("topo-detail-body");
    var detailList = document.getElementById("topo-detail-list");
    var scenarioBtns = Array.prototype.slice.call(
      document.querySelectorAll("#topo-scenarios button")
    );

    var state = { key: "normal", index: 0, timer: 0, packetFrame: 0, running: false };
    var autoPlayed = false;

    function setStatus(text, tone) {
      if (!statusEl) {
        return;
      }
      statusEl.textContent = text;
      statusEl.className = "console-status" + (tone ? " is-" + tone : "");
      if (modeEl) {
        modeEl.textContent = text === "待运行" ? "链路就绪" : "链路 · " + text;
        modeEl.classList.toggle("is-live", tone === "ok");
      }
    }

    function appendLog(tag, text, tone) {
      if (!logEl) {
        return;
      }
      var li = document.createElement("li");
      if (tone) {
        li.className = "is-" + tone;
      }
      var b = document.createElement("b");
      b.textContent = "[" + tag + "]";
      var span = document.createElement("span");
      span.textContent = text;
      li.appendChild(b);
      li.appendChild(span);
      logEl.appendChild(li);
      logEl.scrollTop = logEl.scrollHeight;
    }

    function clearLog(hint) {
      if (!logEl) {
        return;
      }
      logEl.innerHTML = "";
      if (hint) {
        var li = document.createElement("li");
        li.className = "is-hint";
        li.textContent = hint;
        logEl.appendChild(li);
      }
    }

    function resetNodes() {
      Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].classList.remove("is-active", "is-ok", "is-blocked");
        nodeEls[id].classList.add("is-dim");
      });
      Object.keys(linkEls).forEach(function (id) {
        linkEls[id].classList.remove("is-hot", "is-blocked");
      });
      packet.setAttribute("opacity", "0");
      if (stepCountEl) {
        stepCountEl.textContent = "0";
      }
    }

    function pointOn(id, t) {
      var path = linkEls[id];
      if (!path) {
        return null;
      }
      var length = path.getTotalLength();
      return path.getPointAtLength(length * Math.max(0, Math.min(1, t)));
    }

    function animatePacket(linkId, done) {
      var start = performance.now();
      var duration = reduceMotion ? 1 : 640;
      if (state.packetFrame) {
        window.cancelAnimationFrame(state.packetFrame);
      }
      packet.setAttribute("opacity", "1");
      function frame(now) {
        var t = duration <= 1 ? 1 : (now - start) / duration;
        if (t > 1) {
          t = 1;
        }
        var point = pointOn(linkId, t);
        if (point) {
          packet.setAttribute("cx", point.x);
          packet.setAttribute("cy", point.y);
        }
        if (t < 1) {
          state.packetFrame = window.requestAnimationFrame(frame);
        } else {
          state.packetFrame = 0;
          packet.setAttribute("opacity", "0");
          if (done) {
            done();
          }
        }
      }
      state.packetFrame = window.requestAnimationFrame(frame);
    }

    function playStep(done) {
      var scenario = scenarios[state.key];
      var step = scenario.steps[state.index];
      if (!step) {
        if (done) {
          done();
        }
        return;
      }
      Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].classList.remove("is-active");
      });
      var el = nodeEls[step.node];
      if (el) {
        el.classList.remove("is-dim");
        if (step.tone === "bad") {
          el.classList.add("is-blocked");
        } else if (step.tone === "ok") {
          if (!el.classList.contains("is-blocked")) {
            el.classList.add("is-ok");
          }
        } else {
          el.classList.add("is-active");
        }
      }
      if (step.link && linkEls[step.link]) {
        linkEls[step.link].classList.add("is-hot");
        linkEls[step.link].classList.toggle("is-blocked", step.tone === "bad");
      }
      appendLog(step.tag || "步骤", step.text, step.tone);
      state.index += 1;
      if (stepCountEl) {
        stepCountEl.textContent = String(state.index);
      }
      var after = function () {
        if (step.link && linkEls[step.link] && step.tone !== "bad") {
          linkEls[step.link].classList.remove("is-hot");
        }
        if (done) {
          done();
        }
      };
      if (step.link) {
        animatePacket(step.link, after);
      } else {
        window.setTimeout(after, reduceMotion ? 30 : 320);
      }
    }

    function finish() {
      var scenario = scenarios[state.key];
      state.running = false;
      setStatus(scenario.status, scenario.tone);
      appendLog("结论", scenario.verdict, scenario.tone);
      if (scenario.tone !== "ok") {
        /* 告警直接长在通知通道旁边，不用浮层挡住节点详情 */
        showAlertChip("邮件已发送 → 绑定邮箱", scenario.tone);
      }
    }

    function showAlertChip(text, tone) {
      if (!plane) {
        return;
      }
      var old = plane.querySelector(".topo-alert");
      if (old) {
        old.remove();
      }
      var chip = document.createElement("span");
      chip.className = "topo-alert is-" + (tone || "warn");
      chip.textContent = text;
      var point = currentLayout.notify || [86, 64];
      chip.style.left = Math.max(12, point[0] - 20) + "%";
      chip.style.top = Math.max(8, point[1] - 24) + "%";
      plane.appendChild(chip);
    }

    function runAll() {
      if (state.running) {
        return;
      }
      reset();
      state.running = true;
      setStatus("运行中", "running");
      var tick = function () {
        if (state.index >= scenarios[state.key].steps.length) {
          finish();
          return;
        }
        playStep(function () {
          state.timer = window.setTimeout(tick, reduceMotion ? 60 : 420);
        });
      };
      tick();
    }

    function stepOnce() {
      if (state.running) {
        return;
      }
      if (state.index >= scenarios[state.key].steps.length) {
        finish();
        return;
      }
      setStatus("单步 · " + (state.index + 1), "running");
      playStep(function () {
        if (state.index >= scenarios[state.key].steps.length) {
          finish();
        }
      });
    }

    function reset() {
      if (state.timer) {
        window.clearTimeout(state.timer);
        state.timer = 0;
      }
      if (state.packetFrame) {
        window.cancelAnimationFrame(state.packetFrame);
        state.packetFrame = 0;
      }
      state.running = false;
      state.index = 0;
      resetNodes();
      var oldAlert = plane.querySelector(".topo-alert");
      if (oldAlert) {
        oldAlert.remove();
      }
      clearLog("场景已切换到「" + scenarios[state.key].title + "」，点「运行整条链路」或「单步」开始。");
      setStatus("待运行", "");
    }

    function showNode(id) {
      var info = nodeInfo[id];
      if (!info || !detailTitle || !detailBody || !detailList) {
        return;
      }
      detailTitle.textContent = info.title;
      detailBody.textContent = info.body;
      detailList.innerHTML = "";
      info.list.forEach(function (row) {
        var li = document.createElement("li");
        var code = document.createElement("code");
        code.textContent = row[0];
        var span = document.createElement("span");
        span.textContent = row[1];
        li.appendChild(code);
        li.appendChild(span);
        detailList.appendChild(li);
      });
    }

    scenarioBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.key = btn.getAttribute("data-scenario");
        scenarioBtns.forEach(function (item) {
          item.classList.toggle("is-on", item === btn);
        });
        reset();
      });
    });

    Object.keys(nodeEls).forEach(function (id) {
      nodeEls[id].addEventListener("click", function () {
        Object.keys(nodeEls).forEach(function (other) {
          nodeEls[other].classList.toggle("is-selected", other === id);
        });
        showNode(id);
      });
    });

    var runEl = document.getElementById("topo-run");
    var stepEl = document.getElementById("topo-step");
    var resetEl = document.getElementById("topo-reset");
    if (runEl) {
      runEl.addEventListener("click", runAll);
    }
    if (stepEl) {
      stepEl.addEventListener("click", stepOnce);
    }
    if (resetEl) {
      resetEl.addEventListener("click", reset);
    }

    reset();

    /* 第一次滚到这里时自动跑一遍正常链路，让人一眼看懂它在干什么 */
    if ("IntersectionObserver" in window) {
      var demoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !autoPlayed) {
              autoPlayed = true;
              window.setTimeout(runAll, 700);
              demoObserver.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      demoObserver.observe(stage);
    }

    window.__topo = {
      scenario: function () {
        return state.key;
      },
      index: function () {
        return state.index;
      },
      steps: function () {
        return scenarios[state.key].steps.length;
      },
      running: function () {
        return state.running;
      },
      logCount: function () {
        return logEl ? logEl.children.length : 0;
      },
      status: function () {
        return statusEl ? statusEl.textContent : "";
      },
      setScenario: function (key) {
        if (!scenarios[key]) {
          return;
        }
        state.key = key;
        scenarioBtns.forEach(function (item) {
          item.classList.toggle("is-on", item.getAttribute("data-scenario") === key);
        });
        reset();
      },
      run: runAll,
      step: stepOnce,
      reset: reset,
      showNode: showNode,
    };
  })();

  /* 首次进入时给一个说明性提示，验证提示条不会秒消失 */
  if (studioApp) {
    window.setTimeout(function () {
      if (!toastStats.shown) {
        sqToast(
          "这里是可点的软件模拟",
          "提示条默认停留 6.5 秒。鼠标悬停或手指按住会暂停倒计时，右上角可以直接关闭。",
          "info",
          7000
        );
      }
    }, 2600);
  }

  onScroll();
  window.__siteReady = true;
})();
