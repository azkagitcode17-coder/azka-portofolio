document.addEventListener('DOMContentLoaded', () => {

    const initMatrixRain = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array.from({ length: columns }).fill(1);
        const draw = () => {
            ctx.fillStyle = 'rgba(5, 7, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#10b981'; 
            ctx.font = `${fontSize}px 'Fira Code'`;
            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) drops[i] = 0;
                drops[i]++;
            }
            requestAnimationFrame(draw);
        };
        draw();
    };

    const typeEffect = async (element, text, speed = 60) => {
        if (!element) return;
        element.classList.add('caret');
        for(let i=0; i < text.length; i++) {
            await new Promise(r => setTimeout(r, speed));
            element.innerHTML = text.substring(0, i+1);
        }
        element.classList.remove('caret');
    };

    const initQuotesCarousel = async (quotes) => {
        const quoteEl = document.getElementById('quote-text');
        if (!quoteEl || !quotes || quotes.length === 0) return;
        let index = 0;
        while(true) {
            const str = quotes[index];
            quoteEl.innerHTML = '';
            for(let i=0; i<str.length; i++) {
                await new Promise(r => setTimeout(r, 60));
                quoteEl.innerHTML = str.substring(0, i+1);
            }
            await new Promise(r => setTimeout(r, 4000));
            for(let i=str.length; i>=0; i--) {
                await new Promise(r => setTimeout(r, 30));
                quoteEl.innerHTML = str.substring(0, i);
            }
            await new Promise(r => setTimeout(r, 500));
            index = (index + 1) % quotes.length;
        }
    };

    const initTerminalSimulator = (globalData) => {
        const inputField = document.getElementById('terminal-input');
        const logWorkspace = document.getElementById('log-workspace');
        if (!inputField || !logWorkspace) return;
        
        document.getElementById('hero-terminal').addEventListener('click', () => inputField.focus());
        const bootLog = document.createElement('p');
        bootLog.innerHTML = `[ <span class="text-[#10b981]">OK</span> ] n4tuss_hahaha.exe loaded.<br>Type '<span class="text-[#fac863]">help</span>' to list commands.`;
        bootLog.className = "text-slate-300 pb-3 font-['Fira_Code']";
        logWorkspace.appendChild(bootLog);

        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = inputField.value.trim().toLowerCase();
                inputField.value = ''; 
                if (cmd === '') return;

                const cmdLine = document.createElement('p');
                cmdLine.innerHTML = `<span class="text-[#10b981] font-bold">user@n4tuss:~$</span> <span class="text-white">${cmd}</span>`;
                logWorkspace.appendChild(cmdLine);

                const resLine = document.createElement('p');
                resLine.className = 'text-slate-400 pl-4 py-2 text-xs leading-relaxed';

                if (cmd === 'help') {
                    resLine.innerHTML = `Available commands:<br><span class="text-[#fac863]">skills</span>  - Render competency array<br><span class="text-[#fac863]">projects</span> - Fetch deployed systems<br><span class="text-[#fac863]">clear</span>    - Flush terminal output`;
                } else if (cmd === 'skills') {
                    resLine.innerHTML = `<span class="text-[#10b981]">--- VECTOR DATA ---</span><br>` + globalData.skills.map(s => `${s.name} [${s.percentage}%]`).join('<br>');
                } else if (cmd === 'projects') {
                    resLine.innerHTML = `<span class="text-[#10b981]">--- REPOSITORIES ---</span><br>` + globalData.projects.map(p => `[${p.status}] ${p.title}`).join('<br>');
                } else if (cmd === 'clear') {
                    logWorkspace.innerHTML = '';
                    return;
                } else {
                    resLine.innerHTML = `<span class="text-red-500">[ ERROR ]</span> '${cmd}' not recognized.`;
                }

                logWorkspace.appendChild(resLine);
                const terminalContent = document.getElementById('terminal-content');
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }
        });
    };

    const initLogicSandbox = () => {
        const container = document.getElementById('stack-container');
        const btnPush = document.getElementById('btn-push');
        const btnPop = document.getElementById('btn-pop');
        const log = document.getElementById('stack-log');
        if(!container || !btnPush || !btnPop) return;

        let stack = [];
        const MAX_STACK = 5;

        const renderStack = (action, val) => {
            container.innerHTML = '';
            stack.forEach((item, index) => {
                const el = document.createElement('div');
                el.className = 'w-48 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-["Fira_Code"] text-center py-2 rounded shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all duration-300 z-10';
                el.innerText = `[${index}] ${item}`;
                
                if(action === 'push' && index === stack.length - 1) {
                    el.style.transform = 'translateY(-20px)';
                    el.style.opacity = '0';
                    setTimeout(() => { el.style.transform = 'translateY(0)'; el.style.opacity = '1'; }, 50);
                }
                container.appendChild(el);
            });

            if (stack.length === 0) {
                container.innerHTML = `<div class="absolute inset-0 flex items-center justify-center pointer-events-none"><span class="text-slate-700 font-['Fira_Code'] text-sm">Stack Memory Empty</span></div>`;
            }
        };

        btnPush.addEventListener('click', () => {
            if (stack.length >= MAX_STACK) {
                log.innerHTML = `<span class="text-rose-500">Error: StackOverflowException</span>`;
                return;
            }
            const val = "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
            stack.push(val);
            log.innerHTML = `Action: <span class="text-emerald-400">push(${val})</span>`;
            renderStack('push', val);
        });

        btnPop.addEventListener('click', () => {
            if (stack.length === 0) {
                log.innerHTML = `<span class="text-rose-500">Error: Stack Underflow</span>`;
                return;
            }
            const val = stack.pop();
            log.innerHTML = `Action: <span class="text-rose-400">pop()</span> -> ${val}`;
            renderStack('pop');
        });
        
        renderStack(); 
    };

    const initTilt = () => {
        document.querySelectorAll('.tilt-element').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const rX = ((y - rect.height/2) / (rect.height/2)) * -6;
                const rY = ((x - rect.width/2) / (rect.width/2)) * 6;
                card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
        });
    };
    const initMagnetic = () => {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width/2) * 0.4; const y = (e.clientY - rect.top - rect.height/2) * 0.4;
                btn.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
            });
            btn.addEventListener('mouseleave', () => btn.style.transform = `translate(0px, 0px) scale(1)`);
        });
    };
    const initObserver = () => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    };

    const loadData = async () => {
        try {
            const res = await fetch(`data.json?nocache=${new Date().getTime()}`);
            const data = await res.json();

            document.getElementById('hero-status').innerHTML = `> ${data.profile.status} <span class="text-white">||</span> ${data.profile.platform}`;
            
            const p1 = data.projects[0];
            document.getElementById('project-main').innerHTML = `<div class="flex justify-between items-start"><span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] uppercase text-emerald-400 font-bold font-['Fira_Code']">${p1.category}</span><span class="text-emerald-400 text-xs font-bold font-['Fira_Code'] animate-pulse">[ ${p1.status} ]</span></div><div class="mt-8"><h2 class="text-4xl font-bold text-white mb-3 hover:text-emerald-400 transition-colors">${p1.title}</h2><p class="text-slate-400 text-sm/relaxed max-w-md">${p1.desc}</p><div class="flex flex-wrap gap-2 mt-6">${p1.tech.map(t => `<span class="px-2 py-1 bg-[#1e293b] border border-slate-700 rounded text-xs text-slate-300 font-['Fira_Code']">${t}</span>`).join('')}</div></div>`;
            
            document.getElementById('about-mini').innerHTML = `<div class="flex flex-col h-full justify-center"><i class="fa-solid fa-microchip text-4xl text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"></i><h3 class="text-white font-bold text-xl mb-2">${data.profile.nickname}</h3><p class="text-slate-400 text-sm/relaxed mb-4">Focusing strictly on <strong class="text-emerald-400 font-medium">${data.profile.focus}</strong>.</p></div>`;
            
            document.getElementById('skills-list').innerHTML = data.skills.map(skill => `<div class="group"><div class="flex justify-between text-sm mb-2 font-['Fira_Code']"><span class="text-slate-300">${skill.name}</span><span class="text-emerald-400 font-bold">${skill.percentage}%</span></div><div class="w-full bg-[#1e293b] rounded-full h-2 border border-slate-800"><div class="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_#10b981]" style="width: ${skill.percentage}%"></div></div></div>`).join('');
            
            const p2 = data.projects[1];
            document.getElementById('project-archived').innerHTML = `<div class="flex justify-between items-start mb-6"><i class="fa-solid fa-server text-2xl text-slate-500"></i><span class="text-[10px] uppercase text-slate-400 font-bold border border-slate-700 px-2 py-1 rounded font-['Fira_Code']">${p2.status}</span></div><div class="mt-auto"><h3 class="text-xl font-bold text-white mb-2 hover:text-emerald-400 transition-colors">${p2.title}</h3><p class="text-slate-400 text-sm/relaxed">${p2.desc}</p></div>`;
            
            document.getElementById('achievements-container').innerHTML = data.achievements.map(ach => `<div class="bg-[#0a0d14] border-2 border-slate-800 p-5 rounded-xl hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all flex gap-4 items-start"><div class="mt-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"></div><div><h4 class="font-bold text-white text-lg">${ach.title}</h4><p class="font-light text-slate-400 text-sm mt-1">${ach.desc}</p></div></div>`).join('');
            
            document.getElementById('targets-container').innerHTML = data.targets.map(target => `<div class="flex items-center gap-4 bg-[#0a0d14] border-2 border-slate-800 px-5 py-4 rounded-xl hover:border-emerald-400 transition-all group"><div class="w-5 h-5 rounded border-2 border-slate-600 group-hover:border-emerald-400 flex items-center justify-center transition-colors"><i class="fa-solid fa-check text-emerald-400 opacity-0 group-hover:opacity-100 text-xs"></i></div><span class="font-medium text-slate-300 group-hover:text-white transition-colors">${target}</span></div>`).join('');
            
            document.getElementById('tools-container').innerHTML = data.tools.map(tool => `<span class="px-4 py-2 bg-[#0a0d14] border-2 border-slate-800 rounded-lg text-slate-300 font-['Fira_Code'] text-sm hover:border-emerald-400 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all cursor-default">${tool}</span>`).join('');
            
            if(data.personal && data.personal.spotify) {
                const music = data.personal.spotify;
                document.getElementById('spotify-card').innerHTML = `
                    <div class="h-full w-full p-8 flex flex-col justify-between cursor-pointer group hover:bg-white/5 transition-colors" onclick="window.open('${music.url}', '_blank')">
                        <div class="flex justify-between items-start mb-4 w-full">
                            <span class="text-[10px] uppercase tracking-widest text-[#1DB954] font-bold font-['Fira_Code']">On Repeat</span>
                            <div class="flex gap-1 h-3 items-end">
                                <div class="w-1 bg-[#1DB954] h-[40%] equalizer-bar animate-pulse"></div>
                                <div class="w-1 bg-[#1DB954] h-[100%] equalizer-bar animate-pulse" style="animation-delay: 0.2s"></div>
                                <div class="w-1 bg-[#1DB954] h-[60%] equalizer-bar animate-pulse" style="animation-delay: 0.4s"></div>
                            </div>
                        </div>
                        <div class="flex flex-col w-full group-hover:scale-[1.02] transition-transform duration-300">
                            <i class="fa-brands fa-spotify text-4xl text-[#1DB954] mb-3 drop-shadow-[0_0_15px_rgba(29,185,84,0.4)]"></i>
                            <h4 class="text-white font-bold text-lg leading-tight truncate">${music.title}</h4>
                            <p class="text-slate-400 text-sm truncate">${music.artist}</p>
                        </div>
                        <div class="w-full mt-auto pt-4 space-y-3">
                            <div class="w-full bg-slate-800 rounded-full h-1">
                                <div class="bg-[#1DB954] h-1 rounded-full w-1/3"></div>
                            </div>
                            <div class="bg-[#1DB954]/10 border border-[#1DB954]/20 rounded px-2 py-1.5 text-center overflow-hidden">
                                <p class="text-[#1DB954] font-['Fira_Code'] text-[10px] italic truncate group-hover:text-white transition-colors duration-300">
                                    "${music.lyrics || 'Playing now...'}"
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }

            const iconMap = { github: 'fa-github', discord: 'fa-discord', instagram: 'fa-instagram', whatsapp: 'fa-whatsapp', email: 'fa-envelope', tiktok: 'fa-tiktok', telegram: 'fa-telegram' };
            document.getElementById('socials-links').innerHTML = Object.entries(data.socials).map(([key, link]) => `<a href="${link}" target="_blank" class="magnetic w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors" title="${key}"><i class="${key === 'email' ? 'fa-solid' : 'fa-brands'} ${iconMap[key]} text-2xl"></i></a>`).join('');

            initTerminalSimulator(data);
            if(data.personal && data.personal.quotes) initQuotesCarousel(data.personal.quotes);

        } catch (error) { console.error('Core Logic Failure:', error); }
    };

    initMatrixRain();
    initTilt();
    initMagnetic();
    initObserver();
    initLogicSandbox();
    
    const topNameElement = document.getElementById('top-name-typing');
    if (topNameElement) {
        typeEffect(topNameElement, "Hi, I'm Ahmad Azka Rizqi");
    }

    loadData();
});