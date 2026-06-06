document.addEventListener('DOMContentLoaded', () => {

    // 1. Persistent Green Matrix Rain
    const initMatrixRain = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array.from({ length: columns }).fill(1);

        const draw = () => {
            // Opacity sangat kecil (0.02) agar biner lama tidak cepat hilang
            ctx.fillStyle = 'rgba(5, 7, 10, 0.02)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Warna Hijau Neon Murni
            ctx.fillStyle = '#10b981'; 
            ctx.font = `${fontSize}px 'Fira Code'`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            requestAnimationFrame(draw);
        };
        draw();
    };

    // 2. Typing Effect (Hi, I'm...)
    const typeEffect = async (elementId, text, speed = 80) => {
        const el = document.getElementById(elementId);
        el.classList.add('caret');
        for(let i = 0; i < text.length; i++) {
            await new Promise(r => setTimeout(r, speed));
            el.innerHTML = text.substring(0, i + 1);
        }
    };

    // 3. 3D Tilt Effect
    const initTilt = () => {
        document.querySelectorAll('.tilt-element').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8; // Rotasi sumbu X max 8 deg
                const rotateY = ((x - centerX) / centerX) * 8;  // Rotasi sumbu Y max 8 deg

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    };

    // 4. Magnetic Buttons (Footer Icons)
    const initMagnetic = () => {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
                btn.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px) scale(1)`;
            });
        });
    };

    // 5. Scroll Reveal
    const initObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    // 6. Data Assembly (Redesigned UI)
    const loadData = async () => {
        try {
            const response = await fetch('data.json');
            const data = await response.json();

            // Typing Effect eksekusi
            typeEffect('hero-greeting', `Hi, I'm ${data.profile.name}`);
            
            document.getElementById('hero-status').innerHTML = `
                &gt; ${data.profile.status} <span class="text-white">||</span> ${data.profile.platform}
            `;

            // Project 1
            const p1 = data.projects[0];
            document.getElementById('project-main').innerHTML = `
                <div class="flex justify-between items-start">
                    <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] uppercase text-emerald-400 font-bold font-['Fira_Code']">${p1.category}</span>
                    <span class="text-emerald-400 text-xs font-bold font-['Fira_Code'] animate-pulse">[ ${p1.status} ]</span>
                </div>
                <div class="mt-8">
                    <h2 class="text-4xl font-bold text-white mb-3 hover:text-emerald-400 transition-colors">${p1.title}</h2>
                    <p class="text-slate-400 text-sm/relaxed max-w-md">${p1.desc}</p>
                    <div class="flex flex-wrap gap-2 mt-6">
                        ${p1.tech.map(t => `<span class="px-2 py-1 bg-[#1e293b] border border-slate-700 rounded text-xs text-slate-300 font-['Fira_Code']">${t}</span>`).join('')}
                    </div>
                </div>
            `;

            // Profile Mini
            document.getElementById('about-mini').innerHTML = `
                <div class="flex flex-col h-full justify-center">
                    <i class="fa-solid fa-microchip text-4xl text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"></i>
                    <h3 class="text-white font-bold text-xl mb-2">${data.profile.nickname}</h3>
                    <p class="text-slate-400 text-sm/relaxed mb-4">Focusing strictly on <strong class="text-emerald-400 font-medium">${data.profile.focus}</strong>.</p>
                </div>
            `;

            // Skills
            document.getElementById('skills-list').innerHTML = data.skills.map(skill => `
                <div class="group">
                    <div class="flex justify-between text-sm mb-2 font-['Fira_Code']">
                        <span class="text-slate-300">${skill.name}</span>
                        <span class="text-emerald-400 font-bold">${skill.percentage}%</span>
                    </div>
                    <div class="w-full bg-[#1e293b] rounded-full h-2 border border-slate-800">
                        <div class="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_#10b981]" style="width: ${skill.percentage}%"></div>
                    </div>
                </div>
            `).join('');

            // Project Archived
            const p2 = data.projects[1];
            document.getElementById('project-archived').innerHTML = `
                <div class="flex justify-between items-start mb-6">
                    <i class="fa-solid fa-server text-2xl text-slate-500"></i>
                    <span class="text-[10px] uppercase text-slate-400 font-bold border border-slate-700 px-2 py-1 rounded font-['Fira_Code']">${p2.status}</span>
                </div>
                <div class="mt-auto">
                    <h3 class="text-xl font-bold text-white mb-2 hover:text-emerald-400 transition-colors">${p2.title}</h3>
                    <p class="text-slate-400 text-sm/relaxed">${p2.desc}</p>
                </div>
            `;

            // Achievements (Solid Neon Redesign)
            document.getElementById('achievements-container').innerHTML = data.achievements.map(ach => `
                <div class="bg-[#0a0d14] border-2 border-slate-800 p-5 rounded-xl hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all flex gap-4 items-start">
                    <div class="mt-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"></div>
                    <div>
                        <h4 class="font-bold text-white text-lg">${ach.title}</h4>
                        <p class="font-light text-slate-400 text-sm mt-1">${ach.desc}</p>
                    </div>
                </div>
            `).join('');

            // Targets (Solid Row Redesign)
            document.getElementById('targets-container').innerHTML = data.targets.map(target => `
                <div class="flex items-center gap-4 bg-[#0a0d14] border-2 border-slate-800 px-5 py-4 rounded-xl hover:border-emerald-400 transition-all group">
                    <div class="w-5 h-5 rounded border-2 border-slate-600 group-hover:border-emerald-400 flex items-center justify-center transition-colors">
                        <i class="fa-solid fa-check text-emerald-400 opacity-0 group-hover:opacity-100 text-xs"></i>
                    </div>
                    <span class="font-medium text-slate-300 group-hover:text-white transition-colors">${target}</span>
                </div>
            `).join('');

            // Tools (Solid Badges Redesign)
            document.getElementById('tools-container').innerHTML = data.tools.map(tool => `
                <span class="px-4 py-2 bg-[#0a0d14] border-2 border-slate-800 rounded-lg text-slate-300 font-['Fira_Code'] text-sm hover:border-emerald-400 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all cursor-default">
                    ${tool}
                </span>
            `).join('');

            // Solid Footer Dock (Redesign)
            const iconMap = {
                github: 'fa-github', discord: 'fa-discord', instagram: 'fa-instagram',
                whatsapp: 'fa-whatsapp', email: 'fa-envelope', tiktok: 'fa-tiktok', telegram: 'fa-telegram'
            };

            document.getElementById('socials-links').innerHTML = Object.entries(data.socials).map(([key, link]) => `
                <a href="${link}" target="_blank" class="magnetic w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors" title="${key}">
                    <i class="${key === 'email' ? 'fa-solid' : 'fa-brands'} ${iconMap[key]} text-2xl"></i>
                </a>
            `).join('');

            // Initialize all interactions
            initTilt();
            initMagnetic();
            initObserver();

        } catch (error) {
            console.error('Core Logic Failure:', error);
        }
    };

    initMatrixRain();
    loadData();
});