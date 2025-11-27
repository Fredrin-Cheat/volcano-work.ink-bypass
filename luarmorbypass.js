// --- 1. UI FLOATING STATUS DAN LOG ---
function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    };
}
window.__bypass_status_box = null;
window.updateBypassStatus = function(msg) {
    if (!window.__bypass_status_box) return;
    const stat = window.__bypass_status_box.querySelector('.status');
    if (stat) stat.innerHTML = msg;
};

    (function uiBypassStatus() {
    function ensureUI() {
        if (!document.body) {
            setTimeout(ensureUI, 100);
            return;
        }
        // Remove box lama (anti double)
        const prev = document.querySelector('.bypass-box');
        if (prev) prev.remove();

        // --- CSS ---
        const styleEl = document.createElement('style');
        styleEl.textContent = `
        .bypass-box {
            position: fixed;
            bottom: 28px; right: 28px;
            min-width: 250px; max-width: 340px;
            background: linear-gradient(120deg, #151d31 47%, #22d2ff33 100%);
            color: #fff;
            font-family: Inter, Arial, sans-serif;
            font-size: 15px;
            border-radius: 14px;
            box-shadow: 0 6px 32px 0 #152d4460;
            border: 1.8px solid #22d2ff66;
            padding: 20px 18px 18px 20px;
            z-index: 2147483647 !important;
            opacity: 0.92;
            user-select: none;
            cursor: grab;
        }
        .bypass-box:active { cursor: grabbing; }
        .bypass-box strong { color: #21d2ff; font-weight: 900; }
        .bypass-box .status { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: #21d2ff;}
        .bypass-box .site { font-size: 13px; color: #91d7ff;}
        .bypass-box .debug-log { font-size:12px;color: #dadada; max-height: 67px; overflow-y:auto; margin-top:7px; }

        .bypass-box .credit {
    margin-top: 10px;
    padding-top: 4px;
    font-size: 13px;
    color: #90c9ff;
    opacity: 0.75;
    line-height: 1.28;
    text-align: right;
    font-family: inherit;
    border-top: 1px dashed #2796ee40;
    letter-spacing: 0.1px;
}
.bypass-box .credit .cn-project,
.bypass-box .credit .cn-role {
    color: #e6f6ff;
    font-weight: 500;
    letter-spacing: 0.2px;
}
.bypass-box .credit b {
    color: #22d2ff;
    font-weight: bold;
}
.bypass-box .credit div {
    display: block;
    margin: 1px 0 0 0;
    padding: 0;
}

        `;
        document.head.appendChild(styleEl);

        // --- HTML (DIV UI) ---
        const box = document.createElement("div");
        box.className = 'bypass-box';

        let currentSite = 'Unknown';
        if (location.hostname.includes("ads.luarmor.net")) currentSite = 'Luarmor';
        else if (location.hostname.includes("work.ink")) currentSite = 'Work.Ink';

box.innerHTML = `
    <div class="status">🟢 Script Ready</div>
    <div class="site">Site: <strong>${currentSite}</strong></div>
    <div class="debug-log" id="bp-log">Ready.</div>
    <div class="credit">
        <div>
            Made By <b>Nadhif</b> • <span class="cn-project">Luarmor Bypass</span>
        </div>
        <div>
            UI/UX By <b>Vynzz</b> • <span class="cn-role">UI/UX DESIGNER</span>
        </div>
    </div>
`;


        document.body.appendChild(box);
        window.__bypass_status_box = box;

        // --- Drag / geser ---
        let isDragging = false, offsetX = 0, offsetY = 0;
        box.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return;
            isDragging = true;
            offsetX = e.clientX - box.getBoundingClientRect().left;
            offsetY = e.clientY - box.getBoundingClientRect().top;
            box.style.transition = 'none';
        });
        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            box.style.left = (e.clientX - offsetX) + 'px';
            box.style.top = (e.clientY - offsetY) + 'px';
            box.style.right = 'auto'; box.style.bottom = 'auto';
            box.style.position = 'fixed';
        });
        window.addEventListener('mouseup', function() {
            isDragging = false;
            box.style.transition = '';
        });

        function resetPosition() {
            box.style.top = 'auto'; box.style.left = 'auto';
            box.style.right = '28px'; box.style.bottom = '28px';
            box.style.position = 'fixed';
        }
        resetPosition();

        // Box anti hilang (no close)
        box.addEventListener('contextmenu', e=>e.preventDefault());
        box.addEventListener('mousedown', e=>{if(e.button===2)e.preventDefault()});

        // --- Logging debug (SAFE PRINT OBJECT) ---
        const bpLog = box.querySelector('.debug-log');
        const oldLog = console.log;
        console.log = function(...args) {
            oldLog.apply(console, args);
            if (bpLog) {
                const str = args.map(a => {
                    try {
                        return (typeof a === "object")
                            ? JSON.stringify(a, getCircularReplacer())
                            : a;
                    } catch(e) {
                        return "[object]";
                    }
                }).join(' ');
                bpLog.textContent = (bpLog.textContent + "\n" + str).split("\n").slice(-7).join("\n");
            }
        };
    }
    ensureUI();
})();


(function () {
    'use strict';

    const host = location.hostname;
    const defaultTime = 21;
    const debug = true;
    if (host.includes("ads.luarmor.net")) handleLuarmor();
    else if (host.includes("work.ink")) handleWorkInk();

    // Handler for LUARMOR
    function handleLuarmor() {
        updateBypassStatus('🟢 Activating Script: Luarmor...');
        console.log('Activing Script: Luarmor')
        let alreadyDone = false

        function actOnCheckpoint() {
            if (alreadyDone){
                const btn = document.getElementById(`nextbtn`);
                const currentBtn = btn;
                setTimeout(() => {
                    try {
                        currentBtn.click();
                        console.log('Clicked Start Button');
                        alreadyDone = true
                    } catch (err) {
                        setTimeout(actOnCheckpoint(), 1000)
                    }
                }, 300);
                return true;
            }
        }

        const mo = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                          actOnCheckpoint();
                            if (actOnCheckpoint()) {
                                if (alreadyDone) {
                                    mo.disconnect();
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        });

        if (document.documentElement) {
            mo.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        } else {
            setTimeout(() => {
                mo.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                });
            }, 100);
        }
    }

    function handleWorkInk() {
        const startTime = Date.now();
        let sessionControllerA = undefined;
        let sendMessageA = undefined;
        let onLinkInfoA = undefined;
        let onLinkDestinationA = undefined;
        let bypassTriggered = false;
        let destinationReceived = false;
        let turnstileReceived = false;
        let controllerDetected = false;

        const map = {
            onLI: ["onLinkInfo"],
            onLD: ["onLinkDestination"],
        };

        const originalFetch = unsafeWindow.fetch;

        // Timpa fungsi fetch di window halaman web
        unsafeWindow.fetch = function(url, options) {
            const requestUrl = typeof url === 'string' ? url : url.url;

        if (
            requestUrl.includes("work.ink/cdn-cgi/challenge-platform/scripts/jsd/main.js")
        ) {
            console.log("[Main] Blocked challenge script:", requestUrl);

            return Promise.reject(new Error('Request blocked by Tampermonkey script'));
        }

            return originalFetch.call(unsafeWindow, url, options);
        };

        function resolveName(obj, candidates) {
            if (!obj || typeof obj !== "object") {
                return { fn: null, index: -1, name: null };
            }

            for (let i = 0; i < candidates.length; i++) {
                const name = candidates[i];
                if (typeof obj[name] === "function") {
                    return { fn: obj[name], index: i, name };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        function resolveWriteFunction(obj) {
            if (!obj || typeof obj !== "object") {
                return { fn: null, index: -1, name: null };
            }

            for (let i in obj) {
                if (typeof obj[i] === "function" && obj[i].length === 2) {
                    return { fn: obj[i], name: i };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        const types = {
            an: "c_announce",
            mo: "c_monetization",
            ss: "c_social_started",
            rr: "c_recaptcha_response",
            hr: "c_hcaptcha_response",
            tr: "c_turnstile_response",
            ad: "c_adblocker_detected",
            fl: "c_focus_lost",
            os: "c_offers_skipped",
            ok: "c_offer_skipped",
            fo: "c_focus",
            wp: "c_workink_pass_available",
            wu: "c_workink_pass_use",
            pi: "c_ping",
            kk: "c_keyapp_key",
        };

        function triggerBypass(reason) {
            if (bypassTriggered) {
                if (debug)
                    console.log(
                        "[Debug] trigger Bypass skipped, already triggered",
                    );
                return;
            }
            bypassTriggered = true;
            if (debug) console.log("[Debug] trigger Bypass via:", reason);

            let retryCount = 0;
            const maxRetries = 5;

            function keepSpoofing() {
                if (destinationReceived) {
                    if (debug)
                        console.log(
                            "[Debug] Destination received, stopping spoofing after",
                            retryCount,
                            "attempts",
                        );
                    return;
                }

                retryCount++;
                if (debug)
                    console.log(`[Debug] Spoofing attempt #${retryCount}`);

                if (retryCount > maxRetries) {
                    if (debug)
                        console.log(
                            "[Debug] Max retries reached, reloading page...",
                        );
                    window.location.reload();
                    return;
                }

                spoofWorkink();
                setTimeout(keepSpoofing, 3000);
            }

            keepSpoofing();
            if (debug)
                console.log(
                    "[Debug] Waiting for server to send destination data...",
                );
        }

        function spoofWorkink() {
             updateBypassStatus("🕒 CAPTCHA solved successfully, bypassing...");
            if (!onLinkInfoA) {
                if (debug)
                    console.log("[Debug] spoof Workink skipped: no linkInfo");
                return;
            }
            if (debug)
                console.log(
                    "[Debug] spoof Workink starting, linkInfo:",
                    onLinkInfoA,
                );

            const socials = onLinkInfoA.socials || [];
            if (debug)
                console.log("[Debug] Total socials to fake:", socials.length);

            if (socials.length > 0) {
                (async () => {
                    for (let i = 0; i < socials.length; i++) {
                        const soc = socials[i];
                        try {
                            if (sendMessageA && sessionControllerA) {
                                const payload = { url: soc.url };

                                if (
                                    sessionControllerA.websocket &&
                                    sessionControllerA.websocket.readyState ===
                                        WebSocket.OPEN
                                ) {
                                    if (debug)
                                        console.log(
                                            `[Debug] WebSocket open, sending social [${i + 1}/${socials.length}]`,
                                        );

                                    sendMessageA.call(
                                        sessionControllerA,
                                        types.ss,
                                        payload,
                                    );

                                    if (debug)
                                        console.log(
                                            `[Debug] Social [${i + 1}/${socials.length}] sent successfully`,
                                        );
                                } else {
                                    if (debug)
                                        console.error(
                                            `[Debug] WebSocket not ready! State:`,
                                            sessionControllerA.websocket
                                                ?.readyState,
                                        );
                                    await new Promise((resolve) =>
                                        setTimeout(resolve, 1000),
                                    );
                                    i--;
                                    continue;
                                }
                            } else {
                                if (debug)
                                    console.warn(
                                        `[Debug] sendMessage or sessionController is null`,
                                        { sendMessageA, sessionControllerA },
                                    );
                            }
                        } catch (e) {
                            if (debug)
                                console.error(
                                    `[Debug] Error sending social [${i + 1}/${socials.length}]:`,
                                    e,
                                );
                        }
                    }

                    if (debug)
                        console.log(
                            "[Debug] All socials sent, reloading page...",
                        );
                    setTimeout(() => {
                        if (debug)
                            console.log(
                                "[Debug] Reloading page after social spoof...",
                            );
                        window.location.reload();
                    }, 1000);
                })();
            } else {
                if (debug)
                    console.log(
                        "[Debug] No socials to send, processing monetizations directly...",
                    );
                handleMonetizations();
            }

            async function handleMonetizations() {
                const monetizations = sessionControllerA?.monetizations || [];
                if (debug)
                    console.log(
                        "[Debug] Total monetizations to fake:",
                        monetizations.length,
                    );

                for (let i = 0; i < monetizations.length; i++) {
                    const monetization = monetizations[i];
                    if (debug)
                        console.log(
                            `[Debug] Processing monetization [${i + 1}/${monetizations.length}]:`,
                            monetization,
                        );
                    const monetizationId = monetization.id;
                    const monetizationSendMessage = monetization.sendMessage;

                    if (!monetizationSendMessage) {
                        if (debug)
                            console.log(
                                `[Debug] Skipping monetization [${i + 1}/${monetizations.length}]: no sendMessage function`,
                            );
                        continue;
                    }

                    try {
                        switch (monetizationId) {
                            case 22: {
                                monetizationSendMessage.call(monetization, {
                                    event: "read",
                                });
                                if (debug)
                                    console.log(
                                        `[Debug] Faked readArticles2 [${i + 1}/${monetizations.length}]`,
                                    );
                                break;
                            }
                            case 25: {
                                monetizationSendMessage.call(monetization, {
                                    event: "start",
                                });
                                monetizationSendMessage.call(monetization, {
                                    event: "installedClicked",
                                });
                                fetch("/_api/v2/affiliate/operaGX", {
                                    method: "GET",
                                    mode: "no-cors",
                                });
                                setTimeout(() => {
                                    fetch(
                                        "https://work.ink/_api/v2/callback/operaGX",
                                        {
                                            method: "POST",
                                            mode: "no-cors",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                noteligible: true,
                                            }),
                                        },
                                    );
                                }, 5000);
                                if (debug)
                                    console.log(
                                        `[Debug] Faked operaGX [${i + 1}/${monetizations.length}]`,
                                    );
                                break;
                            }
                            case 34: {
                                monetizationSendMessage.call(monetization, {
                                    event: "start",
                                });
                                monetizationSendMessage.call(monetization, {
                                    event: "installedClicked",
                                });
                                if (debug)
                                    console.log(
                                        `[Debug] Faked norton [${i + 1}/${monetizations.length}]`,
                                    );
                                break;
                            }
                            case 71: {
                                monetizationSendMessage.call(monetization, {
                                    event: "start",
                                });
                                monetizationSendMessage.call(monetization, {
                                    event: "installed",
                                });
                                if (debug)
                                    console.log(
                                        `[Debug] Faked externalArticles [${i + 1}/${monetizations.length}]`,
                                    );
                                break;
                            }
                            case 45: {
                                monetizationSendMessage.call(monetization, {
                                    event: "installed",
                                });
                                if (debug)
                                    console.log(
                                        `[Debug] Faked pdfeditor [${i + 1}/${monetizations.length}]`,
                                    );
                                break;
                            }
                            case 57: {
                                monetizationSendMessage.call(monetization, {
                                    event: "installed",
                                });
                                if (debug)
                                    console.log(
                                        `[Debug] Faked betterdeals [${i + 1}/${monetizations.length}]`,
                                    );
                                break;
                            }
                            default: {
                                if (debug)
                                    console.log(
                                        `[Debug] Unknown monetization [${i + 1}/${monetizations.length}]:`,
                                        monetization,
                                    );
                                break;
                            }
                        }
                    } catch (e) {
                        if (debug)
                            console.error(
                                `[Debug] Error faking monetization [${i + 1}/${monetizations.length}]:`,
                                monetization,
                                e,
                            );
                    }
                }

                if (debug) console.log("[Debug] spoof Workink completed");
            }
        }

        function createSendMessageProxy() {
            return function (...args) {
                const pt = args[0];
                const pd = args[1];

                if (pt !== types.pi) {
                    if (debug) console.log("[Debug] Message sent:", pt, pd);
                }

                if (pt === types.ad) {
                    if (debug)
                        console.log("[Debug] Blocking adblocker message");
                    return;
                }

                if (pt === types.tr || pt === types.rr || pt === types.hr) {
                    turnstileReceived = true;
                    if (debug) console.log("[Debug] Captcha bypassed via TR");
                    triggerBypass("tr");
                }

                return sendMessageA
                    ? sendMessageA.apply(this, args)
                    : undefined;
            };
        }

        function createLinkInfoProxy() {
            return function (...args) {
                const info = args[0];
                onLinkInfoA = info;
                if (debug) console.log("[Debug] Link info:", info);
                spoofWorkink();
                try {
                    Object.defineProperty(info, "isAdblockEnabled", {
                        get: () => false,
                        set: () => {},
                        configurable: false,
                        enumerable: true,
                    });
                    if (debug)
                        console.log("[Debug] Adblock disabled in linkInfo");
                } catch (e) {
                    if (debug)
                        console.warn("[Debug] Define Property failed:", e);
                }
                return onLinkInfoA ? onLinkInfoA.apply(this, args) : undefined;
            };
        }

function createDestinationProxy() {
    return function (...args) {
        // 1. Tampilkan status awal
        updateBypassStatus("🕒 Bypass successfull.");

        // 2. Hapus kode setTimeout/redirect yang ada, ganti dengan urutan delay step berikut:
        const data = args[0];
        const secondsPassed = (Date.now() - startTime) / 1000;
        destinationReceived = true;
        if (debug) console.log("[Debug] Destination data:", data.url);

        let waitTimeSeconds = 5;
        const url = location.href;
        if (
            url.includes("42rk6hcq") ||
            url.includes("ito4wckq") ||
            url.includes("pzarvhq1")
        ) {
            waitTimeSeconds = 5;
        }
        const timeRemaining = waitTimeSeconds - secondsPassed;

        function doRedirect() {
            if (debug) console.log("[Debug] Redirecting to destination");
            try { if (sessionControllerA?.websocket) { sessionControllerA.websocket.close(); } } catch (e) {}
            try { window.stop(); } catch (e) {}
            window.location.replace(data.url);
        }

        // --- Atur Delay UI & Redirect Berurutan ---
        setTimeout(function() {
            updateBypassStatus("🕒 Returning To AdsLuarmor..");
            // Setelah status kedua muncul, tunggu lagi (misal 2 detik), lalu redirect
            setTimeout(function() {
                if (timeRemaining <= 0) {
                    doRedirect();
                } else {
                    if (debug)
                        console.log("[Debug] Waiting", Math.ceil(timeRemaining), "seconds");
                    setTimeout(doRedirect, timeRemaining * 1000);
                }
            }, 2000); // 2 detik setelah status kedua, redirect ke tujuan (silakan atur sesuai kebutuhan)
        }, 3000); // 3 detik setelah status pertama, ganti ke status kedua

        // Note: Jika redirect HARUS menunggu sejumlah detik tertentu, gabungkan setTimeout jadi satu

        return onLinkDestinationA
            ? onLinkDestinationA.apply(this, args)
            : undefined;
    };
}

        function setupProxies() {
            const send = resolveWriteFunction(sessionControllerA);
            const info = resolveName(sessionControllerA, map.onLI);
            const dest = resolveName(sessionControllerA, map.onLD);

            sendMessageA = send.fn;
            onLinkInfoA = info.fn;
            onLinkDestinationA = dest.fn;

            const sendMessageProxy = createSendMessageProxy();
            const onLinkInfoProxy = createLinkInfoProxy();
            const onDestinationProxy = createDestinationProxy();

            Object.defineProperty(sessionControllerA, send.name, {
                get() {
                    return sendMessageProxy;
                },
                set(v) {
                    sendMessageA = v;
                },
                configurable: false,
                enumerable: true,
            });

            Object.defineProperty(sessionControllerA, info.name, {
                get() {
                    return onLinkInfoProxy;
                },
                set(v) {
                    onLinkInfoA = v;
                },
                configurable: false,
                enumerable: true,
            });

            Object.defineProperty(sessionControllerA, dest.name, {
                get() {
                    return onDestinationProxy;
                },
                set(v) {
                    onLinkDestinationA = v;
                },
                configurable: false,
                enumerable: true,
            });

            if (debug)
                console.log(
                    `[Debug] setupProxies: installed ${send.name}, ${info.name}, ${dest.name}`,
                );
        }

        function checkController(target, prop, value, receiver) {
            if (debug)
                console.log("[Debug] Checking prop:", prop, typeof value);
            if (
                value &&
                typeof value === "object" &&
                resolveWriteFunction(value).fn &&
                resolveName(value, map.onLI).fn &&
                resolveName(value, map.onLD).fn &&
                !sessionControllerA
            ) {
                sessionControllerA = value;
                controllerDetected = true;
                if (debug)
                    console.log(
                        "[Debug] Controller detected:",
                        sessionControllerA,
                    );
                setupProxies();
            } else {
                if (debug)
                    console.log(
                        "[Debug] checkController: No controller found for prop:",
                        prop,
                    );
            }
            return Reflect.set(target, prop, value, receiver);
        }

        function createComponentProxy(comp) {
            return new Proxy(comp, {
                construct(target, args) {
                    const instance = Reflect.construct(target, args);
                    if (instance.$$.ctx) {
                        instance.$$.ctx = new Proxy(instance.$$.ctx, {
                            set: checkController,
                        });
                    }
                    return instance;
                },
            });
        }

        function createNodeResultProxy(result) {
            return new Proxy(result, {
                get: (target, prop, receiver) => {
                    if (prop === "component") {
                        return createComponentProxy(target.component);
                    }
                    return Reflect.get(target, prop, receiver);
                },
            });
        }

        function createNodeProxy(oldNode) {
            return async (...args) => {
                const result = await oldNode(...args);
                return createNodeResultProxy(result);
            };
        }

        function createKitProxy(kit) {
            if (!kit?.start) return [false, kit];

            return [
                true,
                new Proxy(kit, {
                    get(target, prop, receiver) {
                        if (prop === "start") {
                            return function (...args) {
                                const appModule = args[0];
                                const options = args[2];

                                if (
                                    typeof appModule === "object" &&
                                    typeof appModule.nodes === "object" &&
                                    typeof options === "object" &&
                                    typeof options.node_ids === "object"
                                ) {
                                    const nodeIndex = options.node_ids[1];
                                    const oldNode = appModule.nodes[nodeIndex];
                                    appModule.nodes[nodeIndex] =
                                        createNodeProxy(oldNode);
                                }

                                if (debug)
                                    console.log(
                                        "[Debug] kit.start intercepted!",
                                        options,
                                    );
                                return kit.start.apply(this, args);
                            };
                        }
                        return Reflect.get(target, prop, receiver);
                    },
                }),
            ];
        }

        function setupInterception() {
            const origPromiseAll = Promise.all;
            let intercepted = false;

            Promise.all = async function (promises) {
                const result = origPromiseAll.call(this, promises);
                if (!intercepted) {
                    intercepted = true;
                    return await new Promise((resolve) => {
                        result.then(([kit, app, ...args]) => {
                            if (debug)
                                console.log("[Debug]: Set up Interception!");

                            const [success, created] = createKitProxy(kit);
                            if (success) {
                                Promise.all = origPromiseAll;
                                if (debug)
                                    console.log(
                                        "[Debug]: Kit ready",
                                        created,
                                        app,
                                    );
                            }
                            resolve([created, app, ...args]);
                        });
                    });
                }
                return await result;
            };
        }

        setupInterception();

        window.googletag = { cmd: [], _loaded_: true };

        const hide =
            "W2lkXj0iYnNhLXpvbmVfIl0sCmRpdi5maXhlZC5pbnNldC0wLmJnLWJsYWNrXC81MC5iYWNrZHJvcC1ibHVyLXNtLApkaXYuZG9uZS1iYW5uZXItY29udGFpbmVyLnN2ZWx0ZS0xeWptazFnLAppbnM6bnRoLW9mLXR5cGUoMSksCmRpdjpudGgtb2YtdHlwZSg5KSwKZGl2LmZpeGVkLnRvcC0xNi5sZWZ0LTAucmlnaHQtMC5ib3R0b20tMC5iZy13aGl0ZS56LTQwLm92ZXJmbG93LXktYXV0bywKcFtzdHlsZV0sCi5hZHNieWdvb2dsZSwKLmFkc2Vuc2Utd3JhcHBlciwKLmlubGluZS1hZCwKLmdwdC1iaWxsYm9hcmQtY29udGFpbmVyLAojYmlsbGJvYXJkLTEsCiNiaWxsYm9hcmQtMiwKI2JpbGxib2FyZC0zLAojc2lkZWJhci1hZC0xLAojc2t5c2NyYXBlci1hZC0xIHsKICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsKfQ==";

        const style = document.createElement("style");
        style.textContent =
            typeof atob === "function"
                ? atob(hide)
                : Buffer
                  ? Buffer.from(hide, "base64").toString()
                  : "";
        const appendTarget =
            document.head || document.documentElement || document.body;
        if (appendTarget) {
            appendTarget.appendChild(style);
        } else {
            setTimeout(() => {
                (
                    document.head ||
                    document.documentElement ||
                    document.body
                ).appendChild(style);
            }, 100);
        }

        const ob = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    if (node.classList?.contains("adsbygoogle")) node.remove();
                    node.querySelectorAll?.(".adsbygoogle").forEach((el) =>
                        el.remove(),
                    );

                    if (node.id === "qc-cmp2-container") {
                        if (debug)
                            console.log(
                                "[Debug] Removed privacy container qc-cmp2-container",
                            );
                        node.remove();
                    }
                    node.querySelectorAll?.("#qc-cmp2-container").forEach(
                        (el) => {
                            if (debug)
                                console.log(
                                    "[Debug] Removed privacy container qc-cmp2-container",
                                );
                            el.remove();
                        },
                    );

                    if (
                        node.matches(".button.large.accessBtn.pos-relative") &&
                        node.textContent.includes("Go To Destination")
                    ) {
                        node.click();
                    } else {
                        node.querySelectorAll?.(
                            ".button.large.accessBtn.pos-relative",
                        ).forEach((btn) => {
                            if (btn.textContent.includes("Go To Destination"))
                                btn.click();
                        });
                    }
                }
            }
        });
        if (document.documentElement) {
            ob.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        } else {
            setTimeout(() => {
                ob.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                });
            }, 100);
        }

        setTimeout(() => {
            const existingContainer =
                document.querySelector("#qc-cmp2-container");
            if (existingContainer) {
                if (debug)
                    console.log(
                        "[Debug] Removed existing privacy container qc-cmp2-container",
                    );
                existingContainer.remove();
            }
        });
    }

})();
