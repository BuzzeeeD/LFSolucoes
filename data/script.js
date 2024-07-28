document.addEventListener('DOMContentLoaded', () => {
    const planilhaUrl = 'data/data.xlsx';

    // Carregar a planilha automaticamente
    fetch(planilhaUrl)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const products = XLSX.utils.sheet_to_json(sheet);
            
            // Exibe os produtos e popula os filtros
            displayProducts(products);
            populateFilters(products);
            addClickEventsToProducts(products);
        })
        .catch(error => console.error('Erro ao carregar a planilha:', error));

    // Função para exibir produtos na galeria
    function displayProducts(products) {
        const galeriaContainer = document.querySelector('.galeria-container');
        
        if (!galeriaContainer) {
            console.error('Elemento .galeria-container não encontrado no DOM.');
            return;
        }

        galeriaContainer.innerHTML = ''; // Limpa o conteúdo atual
    
        products.forEach(product => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('image-container');
            itemDiv.setAttribute('data-date', product['Data Inclusão']); // Atributo data-date para ordenação por data
            itemDiv.innerHTML = `
                <div class="item">
                    <img src="${product.Imagem}" alt="${product.Produto}">
                </div>
                <div class="info">
                    <p class="nome">${product.Produto}</p>
                    <p class="categoria">${product.Categoria}</p>
                    <p class="catalogo">${product.Catalogo}</p>
                    <p class="preco-original">R$ ${product.Valor.toFixed(2)}</p>
                    <p class="preco-promocional">R$ ${(product.Valor * (1 - product.Desconto)).toFixed(2)}</p>
                    <p class="parcelamento">ou em até 3x de R$ ${(product.Valor / 3).toFixed(2)}</p>
                </div>
            `;
            galeriaContainer.appendChild(itemDiv);
        });
    }

    // Função para preencher os filtros de categoria e catálogo
    function populateFilters(products) {
        const categories = new Set();
        const catalogos = new Set();
        
        products.forEach(product => {
            if (product.Categoria) categories.add(product.Categoria);
            if (product.Catalogo) catalogos.add(product.Catalogo);
        });

        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } else {
            console.error('Elemento de seleção #categorySelect não encontrado.');
        }

        const catalogoSelect = document.getElementById('catalogoSelect');
        if (catalogoSelect) {
            catalogos.forEach(catalogo => {
                const option = document.createElement('option');
                option.value = catalogo;
                option.textContent = catalogo;
                catalogoSelect.appendChild(option);
            });
        } else {
            console.error('Elemento de seleção #catalogoSelect não encontrado.');
        }
    }

    // Função para filtrar itens na galeria com base na categoria e catálogo
    window.filterItems = function() {
        const selectedCategory = document.getElementById('categorySelect').value;
        const selectedCatalogo = document.getElementById('catalogoSelect').value;
        const items = document.querySelectorAll('.galeria-container .image-container');

        items.forEach(item => {
            const itemCategory = item.querySelector('.categoria').textContent;
            const itemCatalogo = item.querySelector('.catalogo').textContent;

            const categoryMatch = selectedCategory === 'todos' || itemCategory === selectedCategory;
            const catalogoMatch = selectedCatalogo === 'todos' || itemCatalogo === selectedCatalogo;

            if (categoryMatch && catalogoMatch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Função para ordenar produtos por data de inclusão
    window.sortByDate = function() {
        const galeriaContainer = document.querySelector('.galeria-container');
        const items = Array.from(galeriaContainer.getElementsByClassName('image-container'));

        items.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            return dateB - dateA;
        });

        items.forEach(item => galeriaContainer.appendChild(item));
    }

    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', filterItems);
    }

    const catalogoSelect = document.getElementById('catalogoSelect');
    if (catalogoSelect) {
        catalogoSelect.addEventListener('change', filterItems);
    }

    const sortButton = document.querySelector('.filter-container button');
    if (sortButton) {
        sortButton.addEventListener('click', sortByDate);
    }

    // Função para alternar a visibilidade do menu de usuário
    function toggleUserMenu(event) {
        event.stopPropagation();
        var userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
        }
    }

    // Fecha o menu de usuário se clicar fora
    document.addEventListener('click', function(event) {
        var userMenu = document.getElementById('user-menu');
        var profileButton = document.getElementById('profile-button');
        if (userMenu && profileButton) {
            if (!userMenu.contains(event.target) && event.target !== profileButton) {
                userMenu.style.display = 'none';
            }
        }
    });

    // Adiciona o evento de clique ao botão de perfil para abrir/fechar o menu de usuário
    var profileButton = document.getElementById('profile-button');
    if (profileButton) {
        profileButton.addEventListener('click', toggleUserMenu);
    }
});

// Função para abrir o popup
function openPopup(popupId) {
    document.getElementById(popupId).style.display = "block";
}

// Função para fechar o popup
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    } else {
        console.error(`Popup com ID ${popupId} não encontrado.`);
    }
}

// Fecha o popup se o usuário clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target.classList.contains('popup')) {
        event.target.style.display = 'none';
    }
}

// Função para adicionar eventos de clique nos produtos
function addClickEventsToProducts(products) {
    const items = document.querySelectorAll('.galeria-container .image-container');
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            showProductDetails(products[index]);
        });
    });
}

// Função para exibir o popup com as informações do produto
function showProductDetails(product) {
    const popup = document.getElementById('productPopup');
    popup.querySelector('.popup-title').textContent = product.Produto;
    popup.querySelector('.popup-category').textContent = `Categoria: ${product.Categoria}`;
    popup.querySelector('.popup-catalogo').textContent = `Catálogo: ${product.Catalogo}`;
    popup.querySelector('.popup-price').textContent = `Preço: R$ ${product.Valor.toFixed(2)}`;
    popup.querySelector('.popup-discount').textContent = `Desconto: ${(product.Desconto * 100).toFixed(0)}%`;
    popup.querySelector('.popup-description').textContent = product.Descrição || 'Descrição não disponível.';

    // Adicionar imagens adicionais
    const mainImage = popup.querySelector('.popup-main-image');
    const thumbnailContainer = popup.querySelector('.popup-thumbnails');
    
    if (mainImage && thumbnailContainer) {
        mainImage.src = ''; // Limpa a imagem principal anterior
        thumbnailContainer.innerHTML = ''; // Limpa as miniaturas anteriores

        const images = [
            product.Imagem,
            product['Imagem 2'],
            product['Imagem 3'],
            product['Imagem 4'],
            product['Imagem 5']
        ];

        let firstImageSet = false;

        images.forEach((imageSrc, index) => {
            if (imageSrc) {
                // Define a primeira imagem como a principal
                if (!firstImageSet) {
                    mainImage.src = imageSrc;
                    firstImageSet = true;
                }
                // Adiciona miniaturas
                const thumbElement = document.createElement('img');
                thumbElement.src = imageSrc;
                thumbElement.alt = `Imagem ${index + 1} de ${product.Produto}`;
                thumbElement.classList.add('thumbnail');
                thumbElement.onclick = () => {
                    mainImage.src = imageSrc;
                };
                thumbnailContainer.appendChild(thumbElement);
            }
        });
    }

    popup.style.display = 'block';
}
