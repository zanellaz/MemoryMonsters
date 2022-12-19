const dataDiv = document.getElementById('useData')
const mainDiv = document.getElementById('main')
const allMonsters = []
const gameMonsters = ['Noggin', 'Mammott', 'Toe Jammer', 'Potbelly', 'Fwog', 'Shrubb', 'Furcorn', 'Oaktopus', 'Maw', 'Drumpler', 'Pummel', 'Bowgart', 'Clamble', 'T-Rox', 'Entbrat', 'Ghazt', 'Punkleton','Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti', 'Shugabush', 'Tawkerr', 'Parlsona', `G'joob`, 'Wubbox']
const cards = {}
async function main() {
    await getPage()
    getContent()
}

main()

async function getPage() {
  try {
    await axios.get('https://mysingingmonsters.fandom.com/wiki/Monsters')
        .then(({ data }) => {
            dataDiv.innerHTML = data
        })
  } catch (error) {
    mainDiv.innerHTML = 'you need CORS<br><a href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf">https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf</a>'
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
    if (monsterName.includes('Element'))
        return
    return monsterName.replace('.png', '').replace('_', ' ')
}

function filterMonsters(monster) {
    for (const gameMonster of gameMonsters) {
        monster = decodeURI(monster)
        if (monster.split(' ').pop() === decodeURI(gameMonster))
            return monster
    }
    return undefined
}

function filterLinks(links) {
    let futureMainDiv = ''
    links.forEach(link => {
        if (!link)
            return
        let monsterName = getMonsterName(decodeURI(link))
        monsterName = filterMonsters(monsterName)
        if (!monsterName)
            return
        const realLink = getRealLink(link)
        console.log(monsterName, realLink);
        futureMainDiv += `<div class="monsterWrapper"><img class="monster" src="${realLink}"/>${monsterName}</div>`
        const monsterObj = {}
        monsterObj[monsterName] = realLink
        allMonsters.push(monsterObj)
    })
    mainDiv.innerHTML = futureMainDiv
    mainDiv.style.display = 'flex'
    createMonstersObject()
}

function getContent() {
    const content = document.getElementById('content')
    const tables = content.getElementsByClassName('article-table-custom-border')
    let monsters
    Array.from(tables).forEach(table => {
        mainDiv.innerHTML += table.innerHTML
        monsters = mainDiv.getElementsByTagName('a')
    })
    dataDiv.innerHTML = ''
    let links = []
    Array.from(monsters).forEach(monster => {
        const monsterImg = monster.getElementsByTagName('img')
        links.push($(monsterImg).attr('data-src'))
    })
    filterLinks(links)
}

function createMonstersObject() {
    gameMonsters.forEach(gameMonster => {
        const monstersTypes = []
        allMonsters.forEach(monster => {
            monster = Object.keys(monster)[0]
            console.log(monster);
            if(monster.includes(gameMonster)) {
                monstersTypes.push(monster)
            }
        })
        cards[gameMonster] = monstersTypes
    })
    console.log(cards);
}