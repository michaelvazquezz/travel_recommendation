// Navegación entre páginas
document.addEventListener('DOMContentLoaded', function() {
    // Navegación
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home');
        setActiveNavLink('home-link');
    });
    
    document.getElementById('about-link').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('about');
        setActiveNavLink('about-link');
    });
    
    document.getElementById('contact-link').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('contact');
        setActiveNavLink('contact-link');
    });

    // Formulario de contacto
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Botón BOOK NOW
    document.querySelector('.book-btn').addEventListener('click', function() {
        alert('Booking feature coming soon!');
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function setActiveNavLink(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

// Búsqueda y resultados - CÓDIGO CORREGIDO
document.getElementById('search-btn').addEventListener('click', performSearch);
document.getElementById('reset-btn').addEventListener('click', clearResults);

// Datos de ejemplo en caso de que el JSON no cargue
const sampleData = {
    "countries": [
        {
            "id": 1,
            "name": "Australia",
            "cities": [
                {
                    "name": "Sydney, Australia",
                    "imageUrl": "sydney.jpg",
                    "description": "A vibrant city known for its iconic Sydney Opera House and beautiful harbor bridges. Enjoy stunning beaches and a lively cultural scene."
                },
                {
                    "name": "Melbourne, Australia",
                    "imageUrl": "melbourne.jpg",
                    "description": "Cultural capital of Australia, famous for its art, food, coffee, and sporting events. Explore hidden laneways and vibrant neighborhoods."
                }
            ]
        },
        {
            "id": 2,
            "name": "Japan",
            "cities": [
                {
                    "name": "Tokyo, Japan",
                    "imageUrl": "tokyo.jpg",
                    "description": "A bustling metropolis where traditional temples stand beside neon-lit skyscrapers. Experience incredible cuisine and cutting-edge technology."
                },
                {
                    "name": "Kyoto, Japan",
                    "imageUrl": "kyoto.jpg",
                    "description": "Ancient capital known for its classical Buddhist temples, gardens, and traditional wooden houses. The heart of Japanese culture."
                }
            ]
        },
        {
            "id": 3,
            "name": "Brazil",
            "cities": [
                {
                    "name": "Rio de Janeiro, Brazil",
                    "imageUrl": "rio.jpg",
                    "description": "Famous for its Carnival, samba, bossa nova, and balneario beaches such as Copacabana and Ipanema."
                }
            ]
        }
    ],
    "temples": [
        {
            "id": 1,
            "name": "Angkor Wat, Cambodia",
            "imageUrl": "angkor.jpg",
            "description": "The largest religious monument in the world, this stunning temple complex is a masterpiece of Khmer architecture."
        },
        {
            "id": 2,
            "name": "Taj Mahal, India",
            "imageUrl": "taj-mahal.jpg",
            "description": "An ivory-white marble mausoleum, one of the most beautiful buildings in the world and a symbol of eternal love."
        }
    ],
    "beaches": [
        {
            "id": 1,
            "name": "Bora Bora, French Polynesia",
            "imageUrl": "bora-bora.jpg",
            "description": "An island known for its stunning turquoise lagoon and luxurious overwater bungalows. Paradise on Earth."
        },
        {
            "id": 2,
            "name": "Maldives Islands",
            "imageUrl": "maldives.jpg",
            "description": "Crystal clear waters, vibrant coral reefs, and exclusive resorts make this the ultimate beach destination."
        }
    ]
};

async function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!query) {
        alert('Please enter a search term (beach, temple, or country)');
        return;
    }

    let results = [];
    let data;

    try {
        // Intentar cargar datos del JSON
        const response = await fetch('travel_recommendation_api.json');
        data = await response.json();
    } catch (error) {
        console.log('Using sample data instead');
        data = sampleData;
    }

    console.log('Search query:', query);
    console.log('Available data:', data);

    // Lógica de búsqueda mejorada
    if (query.includes('beach')) {
        results = data.beaches || [];
        console.log('Found beaches:', results);
    } else if (query.includes('temple')) {
        results = data.temples || [];
        console.log('Found temples:', results);
    } else if (query.includes('country')) {
        results = data.countries ? data.countries.flatMap(country => country.cities) : [];
        console.log('Found countries/cities:', results);
    } else {
        // Búsqueda general
        const allResults = [
            ...(data.beaches || []),
            ...(data.temples || []),
            ...(data.countries ? data.countries.flatMap(country => country.cities) : [])
        ];
        
        results = allResults.filter(item => 
            item.name.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query))
        );
        console.log('General search results:', results);
    }

    if (results.length === 0) {
        displayNoResults(query);
    } else {
        displayResults(results);
    }
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    // Colores para las tarjetas
    const colors = [
        'linear-gradient(45deg, #667eea, #764ba2)',
        'linear-gradient(45deg, #f093fb, #f5576c)',
        'linear-gradient(45deg, #4facfe, #00f2fe)',
        'linear-gradient(45deg, #43e97b, #38f9d7)',
        'linear-gradient(45deg, #fa709a, #fee140)'
    ];

    results.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        const color = colors[index % colors.length];
        
        card.innerHTML = `
            <div class="result-image" style="background: ${color};">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 3rem; opacity: 0.3;">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
            </div>
            <div class="result-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <button class="book-btn" style="margin: 1rem 0 0 0; padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="alert('Learn more about ${item.name}')">
                    <i class="fas fa-plane"></i> Learn More
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });

    showPage('results');
    console.log(`Displayed ${results.length} results`);
}

function displayNoResults(query) {
    const container = document.getElementById('results-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
            <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
            <h3>No results found for "${query}"</h3>
            <p>Try searching for:</p>
            <ul style="list-style: none; padding: 0; margin: 1rem 0;">
                <li>• "beach" or "beaches"</li>
                <li>• "temple" or "temples"</li>
                <li>• "country" or "countries"</li>
            </ul>
        </div>
    `;
    showPage('results');
}

function clearResults() {
    document.getElementById('search-input').value = '';
    document.getElementById('results-container').innerHTML = '';
    showPage('home');
    setActiveNavLink('home-link');
    console.log('Results cleared');
}

// Función para probar la búsqueda directamente desde la consola
window.testSearch = function(query) {
    document.getElementById('search-input').value = query;
    performSearch();
};