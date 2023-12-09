const handleFetching = async (task) => {
    try {
        const data = await task;
        const result = await data.json();
        return [result, null];
    } catch (error) {
        return [null, error];
    }
};

const fetchCoutriesData = async () => {
    const url = "https://restcountries.com/v2/all";

    const [data, error] = await handleFetching(fetch(url));

    if (error) {
        throw "Something went wrong";
    }

    return data;
};

const getNMost = (data, toGet = "population", n = 10) => {
    const countMap = new Map();
    let total = 0;

    if (toGet == "population") {
        for (const country of data) {
            countMap.set(country.name, country.population);
            total += country.population;
        }
    } else if (toGet == "languages") {
        for (const country of data) {
            country.languages.forEach((lang) => {
                countMap.set(lang.name, (countMap.get(lang.name) || 0) + 1);
                total += 1;
            });
        }
    }

    return {
        result: Array.from(countMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, n),
        total: total,
    };
};

const createResultList = (data) => {
    const total = ["Total", data.total];
    const resultContainer = document.querySelector(".container");
    resultContainer.innerHTML = "";

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("coutry");
    totalDiv.innerHTML = `${
        total[0]
    } <div class="result" style="max-width: 100%;"></div> ${total[1].toLocaleString(
        "en-US"
    )}`;
    resultContainer.appendChild(totalDiv);

    for (const res of data.result) {
        const resDiv = document.createElement("div");
        resDiv.classList.add("coutry");
        resDiv.innerHTML = `${res[0]} <div class="result" style="max-width: ${(
            (res[1] / total[1]) *
            100
        ).toFixed(2)}%;"></div> ${res[1].toLocaleString("en-US")}`;
        resultContainer.appendChild(resDiv);
    }
};

let resolved = false;

let coutriesData;

fetchCoutriesData()
    .then((result) => {
        resolved = true;
        coutriesData = result;
        const replaceNum = document.querySelector("header > p");
        replaceNum.textContent = replaceNum.textContent.replace("#", result.length);
    })
    .catch((error) => console.log(error));

const populationBtn = document.getElementById("populationBtn");
const languageBtn = document.getElementById("languageBtn");
let mostPopulatedCoutries = [],
    mostSpokenLanguages = [];

populationBtn.onclick = () => {
    if (!resolved) return;

    if (!mostPopulatedCoutries.length) {
        mostPopulatedCoutries = getNMost(coutriesData, "population", 10);
    }
    createResultList(mostPopulatedCoutries);
};

languageBtn.onclick = () => {
    if (!resolved) return;

    if (!mostPopulatedCoutries.length) {
        mostPopulatedCoutries = getNMost(coutriesData, "languages", 10);
    }
    createResultList(mostPopulatedCoutries);
};
