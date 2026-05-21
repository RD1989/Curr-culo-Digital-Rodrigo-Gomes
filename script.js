document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar os Ícones do Lucide
    lucide.createIcons();

    // 1b. Inicializar imagem de QR Code para a impressão
    const qrImg = document.getElementById("print-qrcode-img");
    if (qrImg) {
        qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://www.rodrigowabdesigner.com.br";
    }

    // 2. Elementos DOM do Switcher, Temas e Onboarding
    const switchTech      = document.querySelector('[data-switch="tech"]');
    const switchMarketing = document.querySelector('[data-switch="marketing"]');
    const body            = document.body;
    const loadingBar      = document.getElementById("loading-bar");
    const onboardingBanner = document.getElementById("onboarding-banner");
    const onboardingClose  = document.getElementById("onboarding-close");
    const switcher         = document.querySelector(".profile-switcher");

    // Elementos dinâmicos que mudam conforme o perfil
    const dynamicElements = document.querySelectorAll(
        '[data-profile="tech"], [data-profile="marketing"]'
    );

    // Função para dispensar/fechar o onboarding suavemente
    function dismissOnboarding() {
        if (onboardingBanner && onboardingBanner.style.display !== "none") {
            onboardingBanner.style.transition = "all 0.4s ease";
            onboardingBanner.style.opacity = "0";
            onboardingBanner.style.transform = "translateY(-12px)";
            setTimeout(() => {
                onboardingBanner.style.display = "none";
            }, 400);
            localStorage.setItem("rodrigo-cv-onboarding-dismissed", "true");
        }
    }

    // 3. Função para Alternar Perfil
    function switchProfile(profile) {
        if (body.getAttribute("data-theme") === profile) return;

        // Se o usuário alternar o perfil, consideramos que ele interagiu (remove o pulso)
        if (switcher && !switcher.classList.contains("interacted")) {
            switcher.classList.add("interacted");
            localStorage.setItem("rodrigo-cv-interacted", "true");
        }

        // Esconde o onboarding se ainda estiver ativo
        dismissOnboarding();

        // Aciona animação da barra de progresso no topo
        if (loadingBar) {
            loadingBar.style.transition = "width 0.2s ease, opacity 0.1s ease";
            loadingBar.style.opacity = "1";
            loadingBar.style.width = "40%";
        }

        // Efeito de Transição (Fade Out + Slide)
        body.classList.add("switching");

        setTimeout(() => {
            if (loadingBar) {
                loadingBar.style.width = "85%";
            }
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

            if (loadingBar) {
                loadingBar.style.width = "100%";
                setTimeout(() => {
                    loadingBar.style.opacity = "0";
                    setTimeout(() => {
                        loadingBar.style.width = "0%";
                    }, 200);
                }, 150);
            }

            body.classList.remove("switching");
        }, 400);
    }

    // 4. Event Listeners para os botões do Switcher e Onboarding
    switchTech.addEventListener("click",      () => switchProfile("tech"));
    switchMarketing.addEventListener("click", () => switchProfile("marketing"));

    if (onboardingClose) {
        onboardingClose.addEventListener("click", (e) => {
            e.stopPropagation();
            dismissOnboarding();
        });
    }

    // 5. Inicializar estados a partir do localStorage
    if (localStorage.getItem("rodrigo-cv-onboarding-dismissed") === "true") {
        if (onboardingBanner) {
            onboardingBanner.style.display = "none";
        }
    }

    if (localStorage.getItem("rodrigo-cv-interacted") === "true") {
        if (switcher) {
            switcher.classList.add("interacted");
        }
    }

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

        if (switcher) {
            switcher.classList.add("interacted");
        }
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
