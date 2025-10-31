async function addLevels() {
    try {
        const response = await fetch("jsons/challenges.json");
        const levels = await response.json();

        const wrapper = document.getElementById("levels-wrapper");
        wrapper.innerHTML = ""; // очистим перед вставкой

        // сохраняем уровни в глобальной переменной, чтобы потом находить их по ID
        window.demonLevels = levels;

        levels.forEach((levelData, index) => {
            const { name, creator, videoURL, imageURL, levelID } = levelData;

            const position = index + 1;
            const hasVideo = videoURL && videoURL !== "false";

            const levelElement = document.createElement("div");
            levelElement.className = "level";

            levelElement.innerHTML = `
                <div class="level-page" onclick="viewDemonInfo(${levelData["levelID"]})">
                    <div class="level-image">
                        ${
                            hasVideo
                                ? `<a href="${videoURL}" target="_blank" onclick="event.stopPropagation()"><img src="${imageURL}" alt="${name}"></a>`
                                : `<img src="${imageURL}" alt="${name}">`
                        }
                    </div>
                    <div class="level-text">
                        <h1>#${position} - ${name}</h1>
                        <h3>${creator}</h3>
                        <p>ID: ${levelID}</p>
                    </div>
                </div>
            `;

            wrapper.appendChild(levelElement);
        });
    } catch (error) {
        console.error("Ошибка при загрузке уровней:", error);
    }
}

// 📌 Функция открытия окна с инфой об уровне
function viewDemonInfo(levelID) {
    const modal = document.getElementById("level-modal");
    const modalContent = document.getElementById("modal-content");

    // ищем уровень по ID в глобальном списке
    const levelData = window.demonLevels.find(l => l.levelID == levelID);
    if (!levelData) return;

    // заполняем окно
    modalContent.innerHTML = `
        <h1 class="inViewInfoName">${levelData.name}</h1>
        <h3 class="inViewInfoCreator">by ${levelData.creator}</h3>
        <img class="inViewInfoImg" src="${levelData.imageURL}" alt="${levelData.name}">
        <p class="inViewInfoID"><strong>ID:</strong> ${levelData.levelID}</p>
        <p><strong>Верифер:</strong> ${levelData.Verifier}</p>

        ${
            levelData.videoURL && levelData.videoURL !== "false"
                ? `<a href="${levelData.videoURL}" target="_blank" class="video-link">Смотреть шоукейс</a>`
                : ""
        }
        ${
            levelData.verifURL && levelData.verifURL !== "false"
                ? `<a href="${levelData.verifURL}" target="_blank" class="video-link">Смотреть верификацию</a>`
                : ""
        }
    `;

    modal.classList.add("show");
}

// 📌 Закрытие окна
function closeLevelInfo() {
    document.getElementById("level-modal").classList.remove("show");
}

// 📌 Закрытие по клику вне модального окна
window.addEventListener("click", (e) => {
    const modal = document.getElementById("level-modal");
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});

document.addEventListener("DOMContentLoaded", addLevels);
