
let projectsAmnt = 0;
let projectJson = {};

let projectsDiv = document.getElementById("projectsDiv");

async function loadJson() {
    try {
        const response = await fetch("./projects/projects.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading .json:", error);
        return null;
    }
}

async function setup(){
    projectsJson = await loadJson();
    console.log(projectsJson);
    projectsAmnt = Object.keys(projectsJson).length;
    console.log(projectsAmnt);
    fillPage();
}

function fillPage(){
    for (let i = projectsAmnt - 1; i >= 0; i--) {
        project = projectsJson[i];
        console.log(project);

        let prName = project["name"];
        let prDate = project["date"];
        let prDescription = project["description"];
        let prImageLoc = project["imageLoc"];
        let prPLanguage = project["Planguage"];
        let prPrivateOrSchool = project["PrivateOrSchool"];
        let prInProgress = project["In-Progress"];
        let prLink = project["link"];
        let prGHLink = project["githubLink"];

        console.log(prName);
        console.log(prDate);
        console.log(prDescription);
        console.log(prImageLoc);
        console.log(prPLanguage);
        console.log(prPrivateOrSchool);
        console.log(prInProgress);
        console.log(prLink);
        console.log(prGHLink);


        let tagshtml = "";

        if (prInProgress === true) {
            tagshtml += `<div class="lable current-project">In Progress</div>`;
        }

        if (prPrivateOrSchool === "prive") {
            tagshtml += `<div class="lable private-project">Privé</div>`;
        } else if (prPrivateOrSchool === "school") {
            tagshtml += `<div class="lable school-project">School</div>`;
        }

        for (let j = 0; j < prPLanguage.length; j++) {
            tagshtml += `<div class="lable languages">${prPLanguage[j]}</div>`;
        }

        console.log(tagshtml);

        let html = `
        <div class="projectbox">
            <img src="${prImageLoc}" alt="Pic" width="200px" class="projectpic" onclick=" window.open('${prLink}','_blank')">
            <div class="projecttextbox">
              ${tagshtml}
              <h3>
                ${prName} (${prDate})
              </h3>
              <p>
                ${prDescription}
              </p>
              <a href="${prGHLink}" target="_blank"><img src="pictures/githubLogoWhite.webp" alt="github" height="32px"></a>
            </div>
          </div>
        `;
        projectsDiv.innerHTML += html;
    }
}

setup();
