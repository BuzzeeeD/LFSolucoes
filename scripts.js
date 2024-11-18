document.addEventListener('DOMContentLoaded', () => {
    console.log("Scripts carregados com sucesso.");

    // Seleciona os ícones e popups
    const chatIcon = document.getElementById('chat-icon');
    const youtubeIcon = document.getElementById('youtube-icon');
    const chatPopup = document.getElementById('chat-popup');
    const youtubePopup = document.getElementById('youtube-popup');
    const closeButtons = document.querySelectorAll('.close-btn');
    const overlay = document.querySelector('.body-overlay');

    // Função para abrir o popup
    function openPopup(popup) {
        if (!popup) {
            console.error("Popup não encontrado!");
            return;
        }
        document.querySelectorAll('.popup.active').forEach(p => p.classList.remove('active'));
        popup.classList.remove('hidden');
        popup.classList.add('active');
        const overlay = document.querySelector('.body-overlay');
        overlay?.classList.add('active');
    }
    
    function closeAllPopups() {
        document.querySelectorAll('.popup.active').forEach(p => p.classList.remove('active'));
        const overlay = document.querySelector('.body-overlay');
        overlay?.classList.remove('active');
    }

    // Eventos de clique nos ícones
    if (chatIcon && chatPopup) {
        chatIcon.addEventListener('click', () => openPopup(chatPopup));
    }
    if (youtubeIcon && youtubePopup) {
        youtubeIcon.addEventListener('click', () => openPopup(youtubePopup));
    }

    // Fechar popups ao clicar nos botões de fechar ou na sobreposição
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllPopups);
    });
    if (overlay) {
        overlay.addEventListener('click', closeAllPopups);
    }

    // Botão de expansão do vídeo
    const resizeButton = document.getElementById('resize-video');
    if (resizeButton) {
        resizeButton.addEventListener('click', toggleVideoExpansion);
    }

    // Capturar o envio do formulário
    const form = document.querySelector('.quote-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const email = formData.get('email');
            const necessidade = formData.get('necessidade');

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    mostrarPopup(`
                        <h2>Obrigado pelo seu pedido!</h2>
                        <p>Nós entraremos em contato em breve. Aqui estão os detalhes que você forneceu:</p>
                        <div>
                            <p><strong>E-mail:</strong> ${email}</p>
                            <p><strong>Necessidade:</strong> ${necessidade}</p>
                        </div>
                    `);
                    form.reset();
                } else {
                    mostrarPopup("<p>Algo deu errado. Por favor, tente novamente mais tarde.</p>");
                }
            } catch (error) {
                console.error("Erro ao processar o envio:", error);
                mostrarPopup("<p>Erro ao processar o formulário. Por favor, tente novamente mais tarde.</p>");
            }
        });
    }

    // Expandir e recolher FAQ
    document.querySelectorAll('.faq-item h3').forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            document.querySelectorAll('.faq-item').forEach(faq => {
                if (faq !== parent) faq.classList.remove('open');
            });
            parent.classList.toggle('open');
        });
    });

    // Logs de interação com "use cases"
    document.querySelectorAll('.use-case').forEach(useCase => {
        useCase.addEventListener('mouseover', () => {
            console.log("Use Case Hovered:", useCase.querySelector('h3').textContent);
        });
    });

    // Função reutilizável para popups de mensagens
    function mostrarPopup(mensagem) {
        if (document.querySelector('.popup-container')) return; // Evita duplicação
        const popup = document.createElement('div');
        popup.classList.add('popup-container');
        popup.innerHTML = `
            <div class="popup">
                <span class="close-btn">&times;</span>
                ${mensagem}
            </div>
        `;
        document.body.appendChild(popup);
        popup.querySelector('.close-btn').addEventListener('click', () => {
            popup.remove();
        });
    }
});
