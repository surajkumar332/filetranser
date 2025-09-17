const imageInput = document.getElementById('imageInput');
const videoInput = document.getElementById('videoInput');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const link = document.getElementById('link');
const createLinkBtn = document.getElementById('cl');
const copyBtn = document.getElementById('cpy');

let selectedFile = null;

// Handle Image Upload
imageInput.addEventListener('change', function () {
    if (imageInput.files.length > 0) {
        selectedFile = imageInput.files[0];
        status.textContent = "Selected: " + selectedFile.name;
    }
});

// Handle Video Upload
videoInput.addEventListener('change', function () {
    if (videoInput.files.length > 0) {
        selectedFile = videoInput.files[0];
        status.textContent = "Selected: " + selectedFile.name;
    }
});

// Handle Other File Upload
fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
        selectedFile = fileInput.files[0];
        status.textContent = "Selected: " + selectedFile.name;
    }
});

// clear function
function clear() {
    // status.textContent = "";
    status.innerHTML = "";
    link.textContent = "";
    selectedFile = null;
    imageInput.value = "";
    videoInput.value = "";
    fileInput.value = "";
}

// Create Link button functionality (GoFile API)
createLinkBtn.addEventListener('click', async function () {
    if (!selectedFile) {
        status.textContent = "Please select a Photo/Video/file first!";
        return;
    }

    status.textContent = "Uploading...";
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await fetch("https://store1.gofile.io/uploadFile", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.status === "ok") {
            const downloadLink = data.data.downloadPage;
            link.innerHTML = `<a href="${downloadLink}" target="_blank">${downloadLink}</a>`;
            status.textContent = "Uploaded Successfully!";
        } else {
            status.textContent = "Upload failed.";
        }
    } catch (err) {
        status.textContent = "Error: " + err.message;
    }
});


// Copy Link button functionality
copyBtn.addEventListener('click', function () {
    if (link.textContent === "") {
        status.innerHTML = "No link to copy!";
        return;
    }

    const tempInput = document.createElement("input");
    tempInput.value = link.textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Link copied to clipboard!");
});


// dark mode toggle

let modebtn = document.querySelector("#mode");
let currMode = "light"; 

modebtn.addEventListener("click", () => {
  if (currMode === "light") {
    document.body.style.backgroundColor = "black";
    document.body.style.transition = "all 2s ease-in-out";
    document.body.style.color = "white";
    modebtn.classList.remove("fa-sun");
    modebtn.classList.add("fa-moon");
    currMode = "dark";
  } else {
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.body.style.transition = "all 2s ease-in-out";
    modebtn.classList.remove("fa-moon");
    modebtn.classList.add("fa-sun");
    currMode = "light";
  }
});

// humburger menu (nav bar, 3 lines)
function myFunction() {
  var x = document.querySelector(".navbar");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}