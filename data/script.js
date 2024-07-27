document.addEventListener('DOMContentLoaded', () => {
    // Função para alternar a visibilidade do menu de usuário
    function toggleUserMenu(event) {
        event.stopPropagation(); // Previne que o evento se propague para outros elementos
        var userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
        }
    }

    // Função para fechar menus quando clicar fora deles
    function closeMenus(event) {
        var userMenu = document.getElementById('user-menu');
        var dropdowns = document.querySelectorAll('.dropdown-content');

        // Verificar se userMenu existe antes de tentar acessar suas propriedades
        if (userMenu && !userMenu.contains(event.target) && event.target.id !== 'profile-button') {
            userMenu.style.display = 'none';
        }

        // Fecha menus de produtos se o clique não for neles ou em seus acionadores
        dropdowns.forEach(menu => {
            if (menu && !menu.contains(event.target) && !menu.parentElement.contains(event.target)) {
                menu.style.display = 'none';
            }
        });
    }

    // Ativa o menu de usuário quando o botão é clicado
    var profileButton = document.getElementById('profile-button');
    if (profileButton) {
        profileButton.addEventListener('click', toggleUserMenu);
    }

    // Fecha menus quando clicar em qualquer lugar fora deles
    document.addEventListener('click', closeMenus);

    // Abre/fecha menus de produtos
    document.querySelectorAll('.dropdown > a').forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Previne que o evento se propague para o documento
            var dropdownMenu = this.nextElementSibling;
            if (dropdownMenu) {
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
});

// Função para abrir o popup
function openPopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = "block";
    }
}

// Função para fechar o popup
function closePopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = "none";
    }
}

// Fecha o popup se o usuário clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target.className === 'popup') {
        event.target.style.display = "none";
    }
}
