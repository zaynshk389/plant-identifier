const API_KEY = 'YOUR_PLANT_ID_API_KEY'; // Replace with your API key
const API_URL = 'https://api.plant.id/v2/identify';

const imageUpload = document.getElementById('image-upload');
const preview = document.getElementById('preview');
const resultText = document.getElementById('result-text');

// Handle image upload
imageUpload.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            identifyPlant(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Identify plant using Plant.id API
async function identifyPlant(imageData) {
    resultText.textContent = 'Identifying plant...';

    const payload = {
        api_key: API_KEY,
        images: [imageData.split(',')[1]], // Remove the data URL prefix
        plant_details: ['common_names', 'url'],
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (data.suggestions && data.suggestions.length > 0) {
            const plant = data.suggestions[0];
            const commonNames = plant.plant_details.common_names.join(', ');
            resultText.innerHTML = `
                <strong>Plant Name:</strong> ${plant.plant_name}<br>
                <strong>Common Names:</strong> ${commonNames}<br>
                <a href="${plant.plant_details.url}" target="_blank">Learn More</a>
            `;
        } else {
            resultText.textContent = 'No plant identified.';
        }
    } catch (error) {
        console.error('Error identifying plant:', error);
        resultText.textContent = 'An error occurred. Please try again.';
    }
}
