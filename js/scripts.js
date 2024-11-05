const form = document.getElementById('fileUploadForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    fetch('/upload', {
        method: 'post',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
})