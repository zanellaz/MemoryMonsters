const dataDiv = document.getElementById('useData')
const mainDiv = document.getElementById('main')

async function main() {
    await getPage()
    getContent()
}

main()

async function getPage() {
  try {
    await axios.get('https://mysingingmonsters.fandom.com/wiki/Monsters#Natural_Monsters', {headers: {'Access-Control-Allow-Origin': '*'}})
        .then(({ data }) => {
            dataDiv.innerHTML = data
        })
  } catch (error) {
    console.error(error);
  }
}

function getImage(link) {
  try {
    axios.get(link)
        .then(({ data }) => {
            return data
        })
  } catch (error) {
    console.error(error);
  }
}

function getRealLink(link) {
    let realLink = ''
    for (let i = 0; i < 8; i++)
        realLink += link.split('/')[i] + '/'
    return realLink
}

function getMonsterName(link) {
    const monsterName = link.split('/')[7];
    if (monsterName.includes('Element') ||
        monsterName.includes('%'))
        return
    return monsterName.replace('.png', '').replace('_', ' ')
}

function getContent() {
    const content = document.getElementById('content')
    const tables = content.getElementsByClassName('article-table-custom-border')
    let monsters
    let futureMainDiv = ''
    Array.from(tables).forEach(table => {
        mainDiv.innerHTML += table.innerHTML
        monsters = mainDiv.getElementsByTagName('a')
    })
    dataDiv.innerHTML = ''
    Array.from(monsters).forEach(monster => {
        const monsterImg = monster.getElementsByTagName('img')
        const link = $(monsterImg).attr('data-src')
        if (!link)
            return
        const monsterName = getMonsterName(link)
        if (!monsterName)
            return
        const realLink = getRealLink(link)
        console.log(monsterName, realLink);
        futureMainDiv += `<div class="monsterWrapper"><img class="monster" src="${realLink}"/>${monsterName}</div>`
    })
    mainDiv.innerHTML = futureMainDiv
    mainDiv.style.display = 'flex'
    mainDiv.textContent
}