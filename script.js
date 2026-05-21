document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar os Ícones do Lucide
    lucide.createIcons();

    // 1b. Inicializar imagem de QR Code para a impressão
    const qrImg = document.getElementById("print-qrcode-img");
    if (qrImg) {
        qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://www.rodrigowabdesigner.com.br";
    }

    // 2. Elementos DOM do Switcher e Temas
    const switchTech      = document.querySelector('[data-switch="tech"]');
    const switchMarketing = document.querySelector('[data-switch="marketing"]');
    const body            = document.body;

    // Elementos dinâmicos que mudam conforme o perfil
    const dynamicElements = document.querySelectorAll(
        '[data-profile="tech"], [data-profile="marketing"]'
    );

    // 3. Função para Alternar Perfil
    function switchProfile(profile) {
        if (body.getAttribute("data-theme") === profile) return;

        // Efeito de Transição (Fade Out)
        body.classList.add("switching");

        setTimeout(() => {
            body.setAttribute("data-theme", profile);

            if (profile === "tech") {
                switchTech.classList.add("active");
                switchMarketing.classList.remove("active");
            } else {
                switchMarketing.classList.add("active");
                switchTech.classList.remove("active");
            }

            dynamicElements.forEach(el => {
                const elProfile = el.getAttribute("data-profile");
                if (elProfile === profile) {
                    el.classList.add("active");
                } else {
                    el.classList.remove("active");
                }
            });

            lucide.createIcons();
            localStorage.setItem("rodrigo-cv-profile", profile);
            body.classList.remove("switching");
        }, 300);
    }

    // 4. Event Listeners para os botões do Switcher
    switchTech.addEventListener("click",      () => switchProfile("tech"));
    switchMarketing.addEventListener("click", () => switchProfile("marketing"));

    // 5. Recuperar o perfil salvo anteriormente
    const savedProfile = localStorage.getItem("rodrigo-cv-profile");
    if (savedProfile && (savedProfile === "tech" || savedProfile === "marketing")) {
        body.setAttribute("data-theme", savedProfile);

        if (savedProfile === "tech") {
            switchTech.classList.add("active");
            switchMarketing.classList.remove("active");
        } else {
            switchMarketing.classList.add("active");
            switchTech.classList.remove("active");
        }

        dynamicElements.forEach(el => {
            const elProfile = el.getAttribute("data-profile");
            if (elProfile === savedProfile) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
    }

    // 6. Micro-interações nas barras de idioma (IntersectionObserver)
    const langBars = document.querySelectorAll(".lang-bar-inner");

    const langObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar   = entry.target;
                const width = bar.style.width;
                bar.style.width = "0%";
                setTimeout(() => { bar.style.width = width; }, 100);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    langBars.forEach(bar => langObserver.observe(bar));

    // 7. Botão de Impressão — Prepara a página e chama window.print()
    const printBtn = document.querySelector(".print-btn");
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            // Garante que todos os elementos do perfil ativo estejam visíveis para a impressão.
            // O @media print já controla a exibição via .active, mas forçamos o scroll ao topo
            // para que o browser capture a página desde o início.
            window.scrollTo({ top: 0 });

            // Pequeno delay para o scroll terminar antes de abrir o diálogo de impressão
            setTimeout(() => {
                window.print();
            }, 150);
        });
    }
});
